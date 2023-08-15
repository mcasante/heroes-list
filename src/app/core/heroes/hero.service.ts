import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { Hero } from "../models/hero";
import { HeroListOptions } from '../models/hero-list-options';

const public_key = 'd0555eebb6b7c36a209e94464d944bc2'
const defaultParams = {
  apikey: public_key,
}
interface Response {
  count: number
  limit: number
  offset: number
  results: Hero[]
}

@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(
    private readonly http: HttpClient,
  ) {}

  list(config: HeroListOptions): Observable<Response> {

    let params = new HttpParams()
    const options = { ...defaultParams, ...config }

    Object.entries(options).forEach(([key, value]) => {
     params = params.set(key, value);
    })

    return this.http.get<Response>('public/characters', { params })
  }
}
