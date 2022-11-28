import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string) {
    return this.http.post('/api', {action: "login", email, password});
  }

  isLogin() {
    let idClient = localStorage.getItem("idClient");
    return idClient != null && idClient != undefined;
  }

}
