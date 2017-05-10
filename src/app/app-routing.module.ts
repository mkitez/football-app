import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamListComponent } from './team-list.component';
import { PlayerListComponent } from './player-list.component';
import { PlayerComponent } from './player.component';
import { LoginComponent } from './login.component';

import { AuthGuard } from './auth-guard.service';

const routes: Routes = [
    { path: '', redirectTo: 'teams', pathMatch: 'full' },
    { path: 'teams',  component: TeamListComponent, canActivate: [ AuthGuard ] },
    { path: 'teams/:name', component: PlayerListComponent, canActivate: [ AuthGuard ] },
    { path: 'teams/:name/:id', component: PlayerComponent, canActivate: [ AuthGuard ] },
    { path: 'login', component: LoginComponent },
    { path: '**', component: LoginComponent }
];
@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule {}
