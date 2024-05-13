import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  url = environment.apiUrl;

  constructor( private httpClient: HttpClient) { }

  // tslint:disable-next-line:typedef
  add(data: any){
    return this.httpClient.post(this.url + '/product/add', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  update(data: any){
    return this.httpClient.post(this.url + '/product/update', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  getProducts(){
    return this.httpClient.get(this.url + '/product/get');
  }

  // tslint:disable-next-line:typedef
  updateStatus(data: any){
    return this.httpClient.post(this.url + '/product/updateStatus', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  delete(id: any){
    return this.httpClient.post(this.url + '/product/delete/' + id, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  getProductByCategory(id: any){
    return this.httpClient.get(this.url + '/product/getByCategory/' + id);
  }

  // tslint:disable-next-line:typedef
  getById(id: any){
    return this.httpClient.get(this.url + '/product/getById/' + id);
  }
}
