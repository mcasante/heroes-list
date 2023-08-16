import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getApiKey(): string {
    return environment.apiKey;
  }
}
