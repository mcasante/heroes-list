import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { Hero } from "../../models/hero";
import { HeroListOptions } from '../../models/hero-list-options';
import { LocalStorageService } from '../localStorage/local-storage.service';

const public_key = 'd0555eebb6b7c36a209e94464d944bc2'
const defaultParams = {
  apikey: public_key,
}
interface Response {
  limit: number
  offset: number
  count: number
  total: number
  results: Hero[]
}

@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(
    private readonly http: HttpClient,
    private readonly storage: LocalStorageService
  ) {}

  list(config: HeroListOptions): Observable<Response> {
    const options = { ...defaultParams, ...config }

    const params = Object.entries(options)
      .reduce((params, [key, value]) => {
        return params.set(key, value);
      }, new HttpParams())

    return this.http.get<{ data: Response }>('public/characters', { params })
      .pipe(map((response) => response.data))
  }

  localList(): Hero[] {
    const storedHeroes = this.storage.getItem('heroes')
    const heroes = storedHeroes ? JSON.parse(storedHeroes) : []

    return heroes
  }

  createOrEdit(hero: Partial<Hero>): void {
    const heroes = this.localList()

    const found = heroes.find((item: Hero) => item.id === hero.id)
    const newHeroes = found
      ? heroes.map((item: Hero) => (item.id === hero.id ? hero : item))
      : [...heroes, { ...hero, id: heroes.length + 1 }]

    this.storage.setItem('heroes', JSON.stringify(newHeroes))
  }

  delete(id: number): void {
    const heroes = this.localList()
    const newHeroes = heroes.filter((hero: Hero) => hero.id !== id)

    this.storage.setItem('heroes', JSON.stringify(newHeroes))
  }
}
