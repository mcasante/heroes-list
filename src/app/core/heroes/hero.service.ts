import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { Hero } from "../models/hero";
import { HeroListOptions } from '../models/hero-list-options';

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
}
