"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var common_1 = require('@angular/common');
var team_service_1 = require('./team.service');
var PlayerListComponent = (function () {
    function PlayerListComponent(teamService, route, location, router) {
        this.teamService = teamService;
        this.route = route;
        this.location = location;
        this.router = router;
        this.players = [];
    }
    ;
    PlayerListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) { return _this.team = params['name']; });
        this.teamService.getPlayers(this.team)
            .then(function (p) { return _this.players = p; });
    };
    PlayerListComponent.prototype.onSelect = function (player) {
        this.selectedPlayer = player;
    };
    PlayerListComponent.prototype.goBack = function () {
        this.location.back();
    };
    PlayerListComponent.prototype.gotoDetail = function (player) {
        this.router.navigate(['/team', this.team, 'player', player.id]);
    };
    PlayerListComponent = __decorate([
        core_1.Component({
            selector: 'my-players',
            template: "<h2>List of Players</h2>\n    <ul>\n    <li *ngFor='let player of players'\n        class=\"selectable\"\n        [class.selected]=\"player === selectedPlayer\"\n        (click)=\"onSelect(player)\">\n        {{player.id}}: {{player.name}}\n    </li>\n    </ul>\n    <button (click)=\"goBack()\">Back</button>\n    <button *ngIf=\"selectedPlayer\"(click)=\"gotoDetail(selectedPlayer)\">View Details</button>",
            styles: ["\n        .selected { font-weight: bold; }\n        .selectable { cursor: pointer; }\n    "]
        }), 
        __metadata('design:paramtypes', [team_service_1.TeamService, router_1.ActivatedRoute, common_1.Location, router_1.Router])
    ], PlayerListComponent);
    return PlayerListComponent;
}());
exports.PlayerListComponent = PlayerListComponent;
//# sourceMappingURL=player-list.component.js.map