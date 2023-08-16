import { Component } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest, map } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

import { HeroService } from '../../core/services/heroes/hero.service';
import { Hero, HeroListResponse } from '../../core/models/hero';
import { MatDialog } from '@angular/material/dialog';
import { CreateHeroFormComponent } from '../../components/create-hero-form/create-hero-form.component';
import { ConfirmDialogComponent } from 'src/app/components/shared/confirm-dialog/confirm-dialog.component';

const clamp = (num: number, min: number, max: number): number =>
  Math.min(Math.max(num, min), max);

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.scss'],
})
export class HeroListComponent {
  displayedColumns: string[] = [
    'thumbnail',
    'id',
    'name',
    'description',
    'actions',
  ];

  heroes!: Hero[];
  offset: number = 0;

  pagination = {
    pageIndex: 0,
    pageSize: 10,
    total: 0,
    pageSizeOptions: [5, 10, 20, 50],
  };

  destroy$ = new Subject<void>();

  constructor(
    private readonly hero: HeroService,
    public readonly dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    combineLatest([
      this.hero.remoteList({ offset: 0, limit: 1 }),
      this.hero.localList(),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([heroes, localHeroes]) => {
        this.pagination.total = heroes.total + localHeroes.length;
        this.loadHeroes();
      });
  }

  loadHeroes() {
    const pgsize = this.pagination.pageSize;
    const offset = this.offset;

    this.hero
      .localList()
      .pipe(
        takeUntil(this.destroy$),
        map((data: Hero[]) => ({
          total: data.length,
          results: data.slice(offset, offset + pgsize),
        })),
      )
      .subscribe((localHeroes) => {
        this.heroes = localHeroes.results;

        if (localHeroes.results.length >= pgsize) return;

        const offset = clamp(
          this.offset - localHeroes.total,
          0,
          this.pagination.total - this.pagination.pageSize,
        );

        this.hero
          .remoteList({ offset, limit: pgsize - localHeroes.results.length })
          .pipe(takeUntil(this.destroy$))
          .subscribe((remoteHeroes: HeroListResponse) => {
            this.heroes = [...localHeroes.results, ...remoteHeroes.results];
            this.pagination.total = remoteHeroes.total + localHeroes.total;
          });
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pagination.pageSize = e.pageSize;
    this.offset = e.pageIndex * this.pagination.pageSize;
    this.loadHeroes();
  }

  openDialog(hero?: Hero) {
    const dialogRef = this.dialog.open(CreateHeroFormComponent, {
      width: '320px',
      autoFocus: false,
      data: { hero },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.loadHeroes();
      this._snackBar.open(
        `Hero ${hero ? 'updated' : 'created'} successfully`,
        'Close',
        { duration: 2000 },
      );
    });
  }

  deleteHero(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete hero',
        message: 'Are you sure you want to delete this hero?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;

      this.hero.delete(id);
      this.loadHeroes();
      this._snackBar.open(`Hero deleted successfully`, 'Close', {
        duration: 2000,
      });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
