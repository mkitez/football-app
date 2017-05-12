import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from './team.service';
import { Player } from './player';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'my-players',
    template: `
    <div class="page-header">
        <h2>List of Players</h2>
    </div>
    <div *ngIf="isAdmin" class="row">
    <div class="col-lg-6">
      <label>Add player:</label>
      <div class="input-group">
      <input #playerName type="text" class="form-control" placeholder="Enter player name...">
      <span class="input-group-btn">
        <button class="btn btn-default" type="button"
                (click)="add(playerName.value); playerName.value=''">
                Add
        </button>
      </span>
      </div>
    </div>
    </div>
    <div *ngIf="!players.length">
        <p>There are no players in the team.</p>
    </div>
    <div class="teams list-group">
        <a *ngFor="let player of players"
            class="list-group-item"
            [class.active]="player === selectedPlayer"
            (click)="onSelect(player); $event.stopPropagation()">
            <strong>{{player.id}}:</strong> {{player.name}}
            <button type="button" class="btn btn-danger btn-xs pull-right"
                    *ngIf="isAdmin" (click)="delete(player); $event.stopPropagation()">
                    delete
            </button>
        </a>
    </div>
    <button *ngIf="selectedPlayer"
            type="button" class="btn btn-primary"
            (click)="gotoDetail(selectedPlayer)">
            View Details
    </button>
    <button type="button" class="btn btn-link pull-right" (click)="goBack()">Back</button>`
})

export class PlayerListComponent implements OnInit {
    players: Player[] = [];
    selectedPlayer: Player;
    team: string;
    jwtHelper: JwtHelper = new JwtHelper();
    isAdmin: boolean;

    constructor(private teamService: TeamService,
                private route: ActivatedRoute,
                private location: Location,
                private router: Router) {};

    ngOnInit(): void {
        this.route.params
            .subscribe((params: Params) => this.team = params['name']);
        this.teamService.getPlayers(this.team)
            .then(p => this.players = p);
        this.isAdmin = this.jwtHelper
            .decodeToken(localStorage.getItem('id_token')).admin;
    }

    onSelect(player: Player): void {
        this.selectedPlayer = player;
    }

    goBack(): void {
        this.location.back();
    }

    gotoDetail(player: Player): void {
        this.router.navigate(['/teams', this.team, player.id]);
    }

    add(name: string): void {
        name = name.trim();
        if (!name) { return; }
        this.teamService.createPlayer(this.team, name)
            .then(player => {
                this.players.push(player);
                this.selectedPlayer = null;
            });
    }

    delete(player: Player): void {
        this.teamService
            .deletePlayer(this.team, player.id)
            .then(() => {
                this.players = this.players.filter(p => p !== player);
                if (this.selectedPlayer === player) { this.selectedPlayer = null; }
            });
    }
}
