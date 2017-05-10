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
var team_service_1 = require('./team.service');
var router_1 = require('@angular/router');
var TeamListComponent = (function () {
    function TeamListComponent(teamService, router) {
        this.teamService = teamService;
        this.router = router;
        this.teams = [];
    }
    ;
    TeamListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.teamService.getTeams()
            .then(function (t) { return _this.teams = t; });
    };
    TeamListComponent.prototype.onSelect = function (team) {
        this.selectedTeam = team;
    };
    TeamListComponent.prototype.gotoDetail = function (team) {
        this.router.navigate(['/team', team.name]);
    };
    TeamListComponent.prototype.add = function (name) {
        var _this = this;
        name = name.trim();
        if (!name) {
            return;
        }
        this.teamService.createTeam(name)
            .then(function (team) {
            _this.teams.push(team);
            _this.selectedTeam = null;
        });
    };
    TeamListComponent = __decorate([
        core_1.Component({
            selector: 'my-teams',
            template: "<!--div>\n        <label>Team name:</label> <input #teamName />\n        <button (click)=\"add(teamName.value); teamName.value=''\">\n            Add\n        </button>\n    </div-->\n    <h2>List of Teams</h2>\n    <ul class='teams'>\n        <li *ngFor='let team of teams'\n            class=\"selectable\"\n            [class.selected]=\"team === selectedTeam\"\n            (click)=\"onSelect(team)\">\n            {{team.name}}\n        </li>\n    </ul>\n    <div *ngIf=\"selectedTeam\">\n        <button (click)=\"gotoDetail(selectedTeam)\">View Details</button>\n    </div>",
            styles: ["\n        .selected { font-weight: bold; }\n        .selectable { cursor: pointer; }\n    "]
        }), 
        __metadata('design:paramtypes', [team_service_1.TeamService, router_1.Router])
    ], TeamListComponent);
    return TeamListComponent;
}());
exports.TeamListComponent = TeamListComponent;
//# sourceMappingURL=team-list.component.js.map