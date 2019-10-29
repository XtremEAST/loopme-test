import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = 'https://api.coinranking.com/v1/public/';

  constructor(private http: HttpClient) {
  }

  apiRequest(type: 'get' | 'post' | 'put' | 'delete', url: string, data?: any, headers?: any): Observable<any> {
    if (type === 'get') {
      return this.http.get(`${this.apiUrl}${url}`, {headers});
    } else if (type === 'post') {
      return this.http.post(`${this.apiUrl}${url}`, data, {headers});
    } else if (type === 'put') {
      return this.http.put(`${this.apiUrl}${url}`, data, {headers});
    } else if (type === 'delete') {
      return this.http.delete(`${this.apiUrl}${url}`, {headers});
    }
  }
}
