import { Component } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { PageEvent } from '@angular/material/paginator';

import { HeroService } from '../../core/services/heroes/hero.service';
import { Hero } from "../../core/models/hero";
import { MatDialog } from '@angular/material/dialog';
import { CreateHeroFormComponent } from '../../components/create-hero-form/create-hero-form.component';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss']
})
export class HeroListComponent {
  heroes!: Hero[]
  limit: number = 10
  offset: number = 0
  count!: number
  total!: number

  pageIndex: number = 0
  displayedColumns: string[] = ['thumbnail', 'id', 'name', 'description'];

  destroy$ = new Subject<void>();

  constructor(
    private readonly hero: HeroService,
    public readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadHeroes()
  }

  loadHeroes() {
    this.hero
      .list({ offset: this.offset, limit: this.limit })
      .pipe(takeUntil(this.destroy$))
      .subscribe((heroes) => {
        this.heroes = heroes.results
        this.limit = heroes.limit
        this.offset = heroes.offset
        this.count = heroes.count
        this.total = Math.ceil(heroes.total/heroes.limit)
      });
  }

  handlePageEvent(e: PageEvent) {
    console.log(e)
    this.limit = e.pageSize
    this.offset = (e.pageIndex) * this.limit
    this.loadHeroes()
  }

  openDialog() {
    this.dialog.open(CreateHeroFormComponent, {
      width: '320px',
      autoFocus: false
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}