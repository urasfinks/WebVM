import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {
  }

  login(email: string, password: string) {
    this.http.post('/api', {action: "login", email, password}).subscribe(
      (response) => {
        // @ts-ignore
        if (response.status == "OK") {
          // @ts-ignore
          localStorage.setItem("idClient", response.data.idClient);
          this.router.navigateByUrl('/vm');
        }
      }
    );
  }

  isLogin() {
    let idClient = localStorage.getItem("idClient");
    return idClient != null && idClient != undefined;
  }

  logout() {
    localStorage.removeItem("idClient");
    this.router.navigateByUrl('/');
  }

}
