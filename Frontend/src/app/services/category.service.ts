import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  url = environment.apiUrl;

  constructor( private httpClient: HttpClient) { }

  // tslint:disable-next-line:typedef
  add(data: any){
    return this.httpClient.post(this.url + '/category/add', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }


  // tslint:disable-next-line:typedef
  update(data: any){
    return this.httpClient.post(this.url + '/category/update', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  getCategory(){
    return this.httpClient.get(this.url + '/category/get');
  }

  // tslint:disable-next-line:typedef
  getFiltredCategorys(){
    return this.httpClient.get(this.url + '/category/get?filterValue=true');
  }
}
