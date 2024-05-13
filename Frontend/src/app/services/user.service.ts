import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  // tslint:disable-next-line:typedef
  signup(data: any){
    return this.httpClient.post(this.url + '/user/signup', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  forgotPassword(data: any){
    return this.httpClient.post(this.url + '/user/forgotPassword', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  login(data: any){
    return this.httpClient.post(this.url + '/user/login', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  checkToken(){
    return this.httpClient.get(this.url + '/user/checkToken');
  }

  // tslint:disable-next-line:typedef
  changePassword(data: any){
    return this.httpClient.post(this.url + '/user/changePassword/', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }

  // tslint:disable-next-line:typedef
  getUsers(){
    return this.httpClient.get(this.url + '/user/get');
  }

  // tslint:disable-next-line:typedef
  update(data: any){
    return this.httpClient.post(this.url + '/user/update', data, {
      headers: new HttpHeaders().set('content-type', 'application/json')
    });
  }
}
