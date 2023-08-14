import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

const public_key = 'd0555eebb6b7c36a209e94464d944bc2'

@Injectable({ providedIn: 'root' })
export class HeroService {
  constructor(
    private readonly http: HttpClient,
  ) {}

  list() {
    return this.http.get<any>(`public/characters?apikey=${public_key}`)
  }
}
