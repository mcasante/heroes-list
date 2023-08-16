import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { Hero, HeroListResponse, HeroListOptions } from '../../models/hero';
import { LocalStorageService } from '../localStorage/local-storage.service';
import { ApiService } from '../api/api.service';
@Injectable({ providedIn: 'root' })
export class HeroService {
  apikey: string = this.apiService.getApiKey();

  constructor(
    private readonly http: HttpClient,
    private readonly storage: LocalStorageService,
    private apiService: ApiService,
  ) {}

  remoteList(config: HeroListOptions): Observable<HeroListResponse> {
    const options = { apikey: this.apikey, ...config };

    const params = Object.entries(options).reduce((params, [key, value]) => {
      return params.set(key, value);
    }, new HttpParams());

    return this.http
      .get<{ data: HeroListResponse }>('public/characters', { params })
      .pipe(map((response) => response.data));
  }

  localList(): Observable<Hero[]> {
    const storedHeroes = this.storage.getItem('heroes');
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : [];

    return of(heroes as Hero[]);
  }

  createOrEdit(hero: Partial<Hero>): void {
    const storedHeroes = this.storage.getItem('heroes');
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : [];

    const found = heroes.find((item: Hero) => item.id === hero.id);
    const newHeroes = found
      ? heroes.map((item: Hero) => (item.id === hero.id ? hero : item))
      : [...heroes, { ...hero, id: `local_${heroes.length + 1}`, local: true }];

    this.storage.setItem('heroes', JSON.stringify(newHeroes));
  }

  delete(id: string): void {
    const storedHeroes = this.storage.getItem('heroes');
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : [];

    console.log(id);
    const newHeroes = heroes.filter((hero: Hero) => hero.id !== id);

    this.storage.setItem('heroes', JSON.stringify(newHeroes));
  }
}
