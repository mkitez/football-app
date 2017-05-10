import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from './team.service';
import { Player } from './player';

@Component({
    selector: 'player-detail',
    template: `<div *ngIf="player">      
    <h2>Player Details</h2>
    <p>id: {{player.id}}<br>
    name: {{player.name}}</p>
    <button (click)="goBack()">Back</button>
    </div>`
})

export class PlayerComponent implements OnInit {
    player: Player;
    team: string;
    playerId: number;

    constructor(private teamService: TeamService,
                private route: ActivatedRoute,
                private location: Location
    ) {};

    ngOnInit(): void {
        this.route.params
            .subscribe((params: Params) => {
                  this.team = params['name'];
                  this.playerId = +params['id'];
            }
        );
        this.teamService.getPlayerDetails(this.team, this.playerId)
            .then(p => this.player = p);
    }

    goBack(): void {
        this.location.back();
    }
}
