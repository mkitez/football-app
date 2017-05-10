import { Component, OnInit } from '@angular/core';

import { Team } from './team';
import { TeamService } from './team.service';
import { Router } from '@angular/router';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'my-teams',
    template: `
    <h2>List of Teams</h2>
    <div *ngIf="isAdmin">
      <label>Add team:</label> <input #teamName />
      <button (click)="add(teamName.value); teamName.value=''">
        Add
      </button>
    </div>
    <div *ngIf="!teams.length">
      <p>There are no teams yet.</p>
    </div>
    <ul class='teams'>
        <li *ngFor='let team of teams'
            class="selectable"
            [class.selected]="team === selectedTeam"
            (click)="onSelect(team)">
            {{team.name}}
            <button *ngIf="isAdmin" (click)="delete(team); $event.stopPropagation()">X</button>
        </li>
    </ul>
    <div *ngIf="selectedTeam">
        <button (click)="gotoDetail(selectedTeam)">View Details</button>
    </div>
    <div>
        <button (click)="logout()">Logout</button>
    </div>`,
    styles: [`
        .selected { font-weight: bold; }
        .selectable { cursor: pointer; }
    `]
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
