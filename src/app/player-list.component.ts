import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from './team.service';
import { Player } from './player';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'my-players',
    template: `<h2>List of Players</h2>
    <div *ngIf="isAdmin">
      <label>Add player:</label> <input #playerName />
      <button (click)="add(playerName.value); playerName.value=''">
        Add
      </button>
    </div>
    <div *ngIf="!players.length">
        <p>There are no players in the team.</p>
    </div>
    <ul>
    <li *ngFor='let player of players'
        class="selectable"
        [class.selected]="player === selectedPlayer"
        (click)="onSelect(player)">
        {{player.id}}: {{player.name}}
        <button *ngIf="isAdmin" (click)="delete(player); $event.stopPropagation()">X</button>
    </li>
    </ul>
    <button (click)="goBack()">Back</button>
    <button (click)="gotoDetail(selectedPlayer)">View Details</button>`,
    styles: [`
        .selected { font-weight: bold; }
        .selectable { cursor: pointer; }
    `]
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
