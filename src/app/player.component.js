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
var PlayerComponent = (function () {
    function PlayerComponent(teamService, route, location) {
        this.teamService = teamService;
        this.route = route;
        this.location = location;
    }
    ;
    PlayerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.team = params['name'];
            _this.playerId = +params['id'];
        });
        this.player = this.teamService.getPlayerDetails(this.team, this.playerId);
        // .then(p => this.player = p);
        // this.player = { id: 99, name: 'Test' };
    };
    PlayerComponent.prototype.goBack = function () {
        this.location.back();
    };
    PlayerComponent = __decorate([
        core_1.Component({
            selector: 'player-detail',
            template: "<h2>Player Details</h2>\n    <p>id: {{player.id}}<br>\n    name: {{player.name}}</p>\n    <button (click)=\"goBack()\">Back</button>"
        }), 
        __metadata('design:paramtypes', [team_service_1.TeamService, router_1.ActivatedRoute, common_1.Location])
    ], PlayerComponent);
    return PlayerComponent;
}());
exports.PlayerComponent = PlayerComponent;
//# sourceMappingURL=player.component.js.map