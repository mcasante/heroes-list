import { Component } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { Subject, combineLatest, map } from "rxjs";
import { PageEvent } from '@angular/material/paginator';

import { HeroService } from '../../core/services/heroes/hero.service';
import { Hero, HeroListResponse } from "../../core/models/hero";
import { MatDialog } from '@angular/material/dialog';
import { CreateHeroFormComponent } from '../../components/create-hero-form/create-hero-form.component';

const clamp = (
    num: number,
    min: number,
    max: number
  ): number => Math.min(Math.max(num, min), max);

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss']
})
export class HeroListComponent {
  displayedColumns: string[] = ['thumbnail', 'id', 'name', 'description', 'actions'];

  heroes!: Hero[]
  offset: number = 0

  pagination = {
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [1, 5, 10]
  }

  destroy$ = new Subject<void>();

  constructor(
    private readonly hero: HeroService,
    public readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    combineLatest([
      this.hero.remoteList({ offset: 0, limit: 1 }),
      this.hero.localList()
    ])
    .pipe(takeUntil(this.destroy$))
    .subscribe(([heroes, localHeroes]) => {
      this.pagination.total = heroes.total + localHeroes.length
      this.loadHeroes()
    })
  }

  loadHeroes() {
    const pgsize = this.pagination.pageSize
    const offset = this.offset

    this.hero.localList()
      .pipe()
      .pipe(
        takeUntil(this.destroy$),
        map((data: Hero[]) => ({
          total: data.length,
          results: data.slice(offset, offset + pgsize)
        }))
      ).subscribe((localHeroes) => {
        this.heroes = localHeroes.results

        if(localHeroes.results.length >= pgsize) return

        const offset = clamp(this.offset - localHeroes.total, 0, this.pagination.total - this.pagination.pageSize)

        this.hero.remoteList({ offset, limit: pgsize - localHeroes.results.length })
          .pipe(takeUntil(this.destroy$))
          .subscribe((remoteHeroes: HeroListResponse) => {
            this.heroes = [ ...localHeroes.results, ...remoteHeroes.results]
            this.pagination.total = (remoteHeroes.total + localHeroes.total)
          })

      })
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.pageSize = e.pageSize
    this.offset = (e.pageIndex) * this.pagination.pageSize
    this.loadHeroes()
  }

  openDialog(hero?: Hero) {
    this.dialog.open(CreateHeroFormComponent, {
      width: '320px',
      autoFocus: false,
      data: { hero }
    });
  }

  deleteHero(id: string) {
    this.hero.delete(id)
    this.loadHeroes()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
