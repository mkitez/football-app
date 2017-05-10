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
require('rxjs/add/operator/toPromise');
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var TeamService = (function () {
    function TeamService(http) {
        this.http = http;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.teamsUrl = 'api/teams';
    }
    TeamService.prototype.handleError = function (error) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    };
    TeamService.prototype.getTeams = function () {
        return this.http.get(this.teamsUrl)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(this.handleError);
    };
    TeamService.prototype.getPlayers = function (team) {
        var url = this.teamsUrl + "?name=" + team;
        return this.http.get(url)
            .toPromise()
            .then(function (response) {
            var _team = response.json().data;
            return _team[0].players;
        })
            .catch(this.handleError);
    };
    TeamService.prototype.getPlayerDetails = function (team, id) {
        // TODO: with real server use this version
        // const url = `${this.teamsUrl}/${team}/${id}`;
        // return this.http.get(url)
        //     .toPromise()
        //     .then(response => response.json().data as Player)
        //     .catch(this.handleError);
        return { id: 0, name: 'Test' };
    };
    TeamService.prototype.createTeam = function (team) {
        return this.http
            .post(this.teamsUrl, JSON.stringify({ name: team }), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    TeamService.prototype.createPlayer = function (team, player) {
        return this.http
            .post(this.teamsUrl + "/" + team, JSON.stringify({ name: player }), { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json().data; })
            .catch(this.handleError);
    };
    TeamService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], TeamService);
    return TeamService;
}());
exports.TeamService = TeamService;
//# sourceMappingURL=team.service.js.map