import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';

const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');

@Component({
  selector: 'login',
  template: `<div class="login jumbotron center-block">
    <h2>Login</h2>
    <form role="form" (submit)="login($event, username.value, password.value)">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" #username class="form-control" id="username" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" #password class="form-control" id="password" placeholder="Password">
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
  </div>`,
  styles: [ `.login {
    width: 40%;
  }` ]
})

export class LoginComponent implements OnInit {
  constructor(public router: Router, public http: Http) { }

  ngOnInit(): void {
      if (tokenNotExpired()) {
          this.router.navigate(['teams']);
      }
  }

  login(event: any, username: string, password: string): Promise<any> {
    event.preventDefault();
    return this.http.post('/auth', JSON.stringify({ username, password }), {headers: contentHeaders})
      .toPromise()
      .then(response => {
        localStorage.setItem('id_token', response.json().id_token);
        this.router.navigate(['teams']);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
