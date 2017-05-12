import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';

const contentHeaders = new Headers();
contentHeaders.append('Accept', 'application/json');
contentHeaders.append('Content-Type', 'application/json');

@Component({
  selector: 'login',
  template: `
    <form role="form" class="form-signin" (submit)="login($event, username.value, password.value)">
      <h2 class="form-signin-heading">Login</h2>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" #username class="form-control" id="username" placeholder="Username" autofocus>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" #password class="form-control" id="password" placeholder="Password">
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>`
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
      .catch(error => alert(error.json().message));
  }
}
