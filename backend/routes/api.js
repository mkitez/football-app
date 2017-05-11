const express = require('express');
const router = express.Router();

let Team = require('../models/team');
const config = require('../config');
const users = require('../users');

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/fbdb'); // this is for local launch
// mongoose.connect('mongodb://database/fbdb'); // this is for Docker launch

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Failed to connect to DB.'));
db.once('open', console.log.bind(console, 'Connection to DB established.'));

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

router.use('/api', expressJwt({ secret: config.secret }));

function createToken(user) {
   let userToSign = Object.assign({}, user);
   delete userToSign.password;
   return jwt.sign(userToSign, config.secret, {expiresIn: 60 * 60});
}

router.get('/api', (req, res) => {
    res.send('Welcome to football API!');
});

router.route('/api/teams')
    .post((req, res) => {
        if (!req.user.admin)
            return res.status(401);

        Team.find({
            name: req.body.name
        }, (err, teams) => {
            if (teams.length > 0)
                return res.status(406).json({ message: 'Team with this name already exists' });

            let team = new Team();
            team.name = req.body.name;
            team.players = [];

            team.save(err => {
                if (err)
                    res.send(err);
                res.json(team);
            });
        });
    })
    .get((req, res) => {
        Team.find((err, teams) => {
            if (err)
                res.send(err);

            if (!teams.length)
                res.json({ message: 'No teams to show' });
            else
                res.json(teams);
        });
    });

router.route('/api/teams/:team_name')
    .get((req, res) => {
        Team.find({
            name: req.params.team_name
        }, (err, team) => {
            if (err)
                res.send(err);
            if (!team.length)
                res.status(404).json({ message: 'No such team' });
            else
                res.json(team[0]);
        });
    })
    .post((req, res) => {
        if (!req.user.admin)
            return res.status(401);

        Team.find({
            name: req.params.team_name
        }, (err, teams) => {
            if (!teams.length)
                res.status(404).json({ message: 'No such team' });
            else {
                let team = teams[0];
                let playerName = req.body.name;

                if (team.players.filter(p => p.name === playerName).length > 0)
                    return res.status(406).json({ message: 'Player with this name already exists' });

                let playerId = team.players.length > 0 ? team.players[0].id + 1 : 0;
                team.players.forEach(p => {
                    if (p.id >= playerId)
                        playerId = p.id + 1;
                });

                let newPlayer = { id: playerId, name: playerName };
                team.players.push(newPlayer);

                team.save(err => {
                    if (err)
                        res.send(err);
                    res.json(newPlayer);
                });
            }
        });
    })
    .delete((req, res) => {
        if (!req.user.admin)
            return res.status(401);

        Team.remove({
            name: req.params.team_name
        }, (err, team) => {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

router.route('/api/teams/:team_name/:player_id')
    .get((req, res) => {
        Team.find({
            name: req.params.team_name
        }, (err, team) => {
            if (err)
                res.send(err);

            let players = team[0].players;
            let player = players.filter(p => p.id === +req.params.player_id)[0];

            if (typeof player === 'undefined')
                res.status(404).json({ message: 'No player with this ID' });
            else
                res.json({ id: player.id, name: player.name });
        });
    })
    .delete((req, res) => {
        if (!req.user.admin)
            return res.status(401);

        Team.find({
            name: req.params.team_name
        }, (err, team) => {
            team = team[0];
            if (err)
                res.send(err);

            let player = team.players.filter(p => p.id === +req.params.player_id)[0];
            if (typeof player === 'undefined')
                res.status(404).json({ message: 'No player with this ID' });
            else {
                let playerIdx = team.players.indexOf(player);
                team.players.splice(playerIdx, 1);

                team.save(err => {
                    if (err)
                        res.send(err);
                    res.json({ message: 'Successfully deleted' });
                });
            }
        });
    });

router.route('/auth')
    .post((req, res) => {
        if (!req.body.username || !req.body.password) {
            return res.status(400).json({ message: 'You must send the username and the password' });
        }

        let user = users.filter(u => u.username === req.body.username)[0];
        if (typeof user === 'undefined' || !(user.password === req.body.password)) {
            return res.status(401).json({ message: 'The username and password don\'t match' });
        }

        res.status(201).json({
           id_token: createToken(user)
        });
    });

module.exports = router;
