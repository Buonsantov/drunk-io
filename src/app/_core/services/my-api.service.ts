import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyApiService {
  apiPath = '/assets/config/tag.json';
  constructor(private httpClient: HttpClient) { }


  getData(): Observable<any> {
    const headers = new HttpHeaders({
      'Content-type': 'application/json'
    });
    return this.httpClient.get<any>(`${this.apiPath}`, { headers });
  }
}
