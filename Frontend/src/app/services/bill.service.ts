import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;


  constructor( private httpClient: HttpClient) { }

  // tslint:disable-next-line:typedef
  generateReport(data: any){
    return this.httpClient.post(this.url + '/bill/generateReport', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  getPdf(data: any): Observable<Blob>{
    return this.httpClient.post(this.url + '/bill/getPdf', data, {responseType: 'blob'});
  }

  // tslint:disable-next-line:typedef
  getBills(){
    return this.httpClient.get(this.url + '/bill/getBills');
  }

  // tslint:disable-next-line:typedef
  delete(id: any){
    return this.httpClient.post(this.url + '/bill/delete/' + id, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }


}
