import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {Http, HttpModule, RequestOptions} from '@angular/http';

import { TeamService } from './team.service';
import { TeamListComponent } from './team-list.component';
import { AppRoutingModule } from './app-routing.module';
import { PlayerListComponent } from './player-list.component';
import { PlayerComponent } from './player.component';
import { LoginComponent } from './login.component';
import { AuthGuard } from './auth-guard.service';
import {AuthConfig, AuthHttp } from 'angular2-jwt';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenName: 'id_token',
    tokenGetter: (() => localStorage.getItem('id_token')),
    globalHeaders: [{ 'Content-Type' : 'application/json' }],
  }), http, options);
}

@NgModule({
  imports: [
      BrowserModule,
      AppRoutingModule,
      HttpModule
  ],
  declarations: [
      AppComponent,
      TeamListComponent,
      PlayerListComponent,
      PlayerComponent,
      LoginComponent
  ],
  providers: [
      TeamService,
      AuthGuard,
      {
          provide: AuthHttp,
          useFactory: authHttpServiceFactory,
          deps: [Http, RequestOptions]
      }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
