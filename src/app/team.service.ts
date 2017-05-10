import { Team } from './team';
import { Player } from './player';

import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class TeamService {
    private headers = new Headers({'Content-Type': 'application/json'});
    private teamsUrl = 'api/teams';
    private teams: Team[] = [];

    constructor(private http: Http, private authHttp: AuthHttp) { }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred: ', error);
        return Promise.reject(error.message || error);
    }

    getTeams(): Promise<Team[]> {
        return this.authHttp.get(this.teamsUrl)
            .toPromise()
            .then(response => response.json() as Team[])
            .catch(this.handleError);
    }

    getPlayers(team: string): Promise<Player[]> {
        const url = `${this.teamsUrl}/${team}`;
        return this.authHttp.get(url)
            .toPromise()
            .then(response => response.json().players as Player[])
            .catch(this.handleError);
    }

    getPlayerDetails(team: string, id: number): Promise<Player> {
        const url = `${this.teamsUrl}/${team}/${id}`;
        return this.authHttp.get(url)
            .toPromise()
            .then(response => response.json() as Player)
            .catch(this.handleError);
    }

    createTeam(team: string): Promise<Team> {
        return this.authHttp
            .post(this.teamsUrl, JSON.stringify({name: team}), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Team)
            .catch(this.handleError);
    }

    deleteTeam(team: string): Promise<void> {
        const url = `${this.teamsUrl}/${team}`;
        return this.authHttp.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    createPlayer(team: string, player: string): Promise<Player> {
        return this.authHttp
            .post(`${this.teamsUrl}/${team}`, JSON.stringify({name: player}), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Player)
            .catch(this.handleError);
    }

    deletePlayer(team: string, player: number): Promise<void> {
        const url = `${this.teamsUrl}/${team}/${player}`;
        return this.authHttp.delete(url, {headers: this.headers})
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }
}
