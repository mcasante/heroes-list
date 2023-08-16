import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map, of } from "rxjs";

import { Hero, HeroListResponse, HeroListOptions } from "../../models/hero";
import { LocalStorageService } from '../localStorage/local-storage.service';

const public_key = 'd0555eebb6b7c36a209e94464d944bc2'
const defaultParams = {
  apikey: public_key,
}

@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: LocalStorageService
  ) {}

  remoteList(config: HeroListOptions): Observable<HeroListResponse> {
    const options = { ...defaultParams, ...config }

    const params = Object.entries(options)
      .reduce((params, [key, value]) => {
        return params.set(key, value);
      }, new HttpParams())

    return this.http.get<{ data: HeroListResponse }>('public/characters', { params })
      .pipe(map((response) => response.data))
  }

  localList(): Observable<Hero[]> {
    const storedHeroes = this.storage.getItem('heroes')
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : []

    return of(heroes as Hero[])
  }

  createOrEdit(hero: Partial<Hero>): void {
    const storedHeroes = this.storage.getItem('heroes')
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : []

    const found = heroes.find((item: Hero) => item.id === hero.id)
    const newHeroes = found
      ? heroes.map((item: Hero) => (item.id === hero.id ? hero : item))
      : [...heroes, { ...hero, id: heroes.length + 1, local: true }]

    this.storage.setItem('heroes', JSON.stringify(newHeroes))
  }

  delete(id: number): void {
    const storedHeroes = this.storage.getItem('heroes')
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : []

    const newHeroes = heroes.filter((hero: Hero) => hero.id !== id)

    this.storage.setItem('heroes', JSON.stringify(newHeroes))
  }
}
