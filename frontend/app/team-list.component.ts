import { Component, OnInit } from '@angular/core';

import { Team } from './team';
import { TeamService } from './team.service';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'my-teams',
    template: `
    <div class="page-header">
        <h2>List of Teams</h2>
    </div>
    <div *ngIf="isAdmin" class="row">
    <div class="col-lg-6">
        <label>Add team:</label>
        <div class="input-group">
        <input #teamName type="text" class="form-control" placeholder="Enter team name...">
        <span class="input-group-btn">
            <button class="btn btn-default" type="button"
                    (click)="add(teamName.value); teamName.value=''">
                    Add
            </button>
        </span>
        </div>
    </div>
    </div>
    <div *ngIf="!teams.length">
      <p>There are no teams yet.</p>
    </div>
    <div class="teams list-group">
        <a *ngFor="let team of teams"
            class="list-group-item"
            [class.active]="team === selectedTeam"
            (click)="onSelect(team); $event.stopPropagation()">
            {{team.name}}
            <button type="button" class="btn btn-danger btn-xs pull-right"
                    *ngIf="isAdmin"
                    (click)="delete(team); $event.stopPropagation()">
                    delete
            </button>
        </a>
    </div>
    <button *ngIf="selectedTeam"
            type="button" class="btn btn-primary"
            (click)="gotoDetail(selectedTeam)">
            View Details
    </button>
    <button type="button" class="btn btn-link pull-right" (click)="logout()">Logout</button>`
})

export class TeamListComponent implements OnInit {
    teams: Team[] = [];
    selectedTeam: Team;
    jwtHelper: JwtHelper = new JwtHelper();
    isAdmin: boolean;

    constructor(private teamService: TeamService,
                private router: Router) {};

    ngOnInit(): void {
        this.teamService.getTeams()
            .then(t => this.teams = t);
        this.isAdmin = this.jwtHelper
            .decodeToken(localStorage.getItem('id_token')).admin;
    }

    onSelect(team: Team): void {
        this.selectedTeam = team;
    }

    gotoDetail(team: Team): void {
        this.router.navigate(['/teams', team.name ]);
    }

    add(name: string): void {
        name = name.trim();
        if (!name) { return; }
        this.teamService.createTeam(name)
            .then(team => {
                this.teams.push(team);
                this.selectedTeam = null;
            });
    }

    delete(team: Team): void {
        this.teamService
            .deleteTeam(team.name)
            .then(() => {
                this.teams = this.teams.filter(t => t !== team);
                if (this.selectedTeam === team) { this.selectedTeam = null; }
          });
    }

    logout() {
        localStorage.removeItem('id_token');
        this.router.navigate(['login']);
    }
}
