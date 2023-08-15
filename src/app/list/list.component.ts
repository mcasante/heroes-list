import { Component } from '@angular/core';
import { HeroService } from '../core/heroes/hero.service';
import { catchError, takeUntil } from "rxjs/operators";
import { combineLatest, of, Subject, throwError } from "rxjs";

type Test = any
export interface Hero extends Test {
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  heroes!: Hero[]
  destroy$ = new Subject<void>();

  constructor(
    private readonly hero: HeroService,
  ) {}

  ngOnInit() {
    this.hero
      .list({ offset: 0 })
      .pipe(
        catchError((error) => {
          return throwError(error);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((heroes) => {
        this.heroes = JSON.stringify(heroes, null, 2) as unknown as Hero[];
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
