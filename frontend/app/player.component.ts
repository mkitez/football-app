import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TeamService } from './team.service';
import { Player } from './player';

@Component({
    selector: 'player-detail',
    template: `
    <div class="page-header">
        <h2>Player Details</h2>
    </div>
    <div *ngIf="!player">
        <p>No player with this ID.</p>
    </div>
    <div *ngIf="player">
        <dl class="dl-horizontal">
            <dt>ID:</dt><dd>{{player.id}}</dd>
            <dt>Name:</dt><dd>{{player.name}}</dd>
        </dl>
    </div>
    <button type="button" class="btn btn-link pull-right" (click)="goBack()">
        Back
    </button>`
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
