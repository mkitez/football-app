const express = require('express');
const router = express.Router();
let Team = require('../../app/models/team');
const config = require('../../config');

const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/fbdb'); // this is for local launch
mongoose.connect('mongodb://database/fbdb'); // this if for Docker launch

const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

router.use('/api', expressJwt({ secret: config.secret }));

function createToken(user) {
   let userToSign = Object.assign({}, user);
   delete userToSign.password;
   return jwt.sign(userToSign, config.secret, {expiresIn: 60 * 60});
}

const users = [{
  id: 0,
  username: 'admin',
  password: 'admin',
  admin: true
},
{
  id: 1,
  username: 'user',
  password: 'user',
  admin: false
}];

/* GET api listing. */
router.get('/api', (req, res) => {
  res.send('Welcome to football API!');
});

router.route('/api/teams')
    .post(function(req, res) {
        if (!req.user.admin)
            return res.sendStatus(401);

        let team = new Team();
        team.name = req.body.name;
        team.players = [];

        team.save(function(err) {
            if (err)
                res.send(err);

            res.json(team);
        });

    })
    .get(function(req, res) {
        Team.find(function(err, teams) {
            if (err)
                res.send(err);

            if (!teams.length)
                res.json({ message: 'No teams to show.' });
            else
                res.json(teams);
        });
    });

router.route('/api/teams/:team_name')
    .get(function(req, res) {
        Team.find({
            name: req.params.team_name
        }, function(err, team) {
            if (err)
                res.send(err);
            if (!team.length)
                res.json({ message: 'No such team' });
            else
                res.json(team[0]);
        });
    })
    .post(function(req, res) {
        if (!req.user.admin)
            return res.sendStatus(401);

        Team.find({
            name: req.params.team_name
        }, function(err, team) {
            if (!team.length)
                res.json({ message: 'No such team' });
            else {
                team = team[0];

                let playerName = req.body.name;
                let playerId = team.players.length > 0 ? team.players[0].id + 1 : 0;
                for (let i = 0; i < team.players.length; i++)
                    if (team.players[i].id >= playerId)
                        playerId = team.players[i].id + 1;

                let newPlayer = { id: playerId, name: playerName };
                team.players.push(newPlayer);

                team.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json(newPlayer);
                });
            }
        });
    })
    .delete(function(req, res) {
        if (!req.user.admin)
            return res.sendStatus(401);

        Team.remove({
            name: req.params.team_name
        }, function(err, team) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

router.route('/api/teams/:team_name/:player_id')
    .get(function(req, res) {
        Team.find({
            name: req.params.team_name
        }, function(err, team) {
            if (err)
                res.send(err);

            let players = team[0].players;
            let player = players.filter(function(p) {
                return p.id === +req.params.player_id;
            })[0];

            if (typeof player === 'undefined')
                res.json({ message: 'No player with this ID.' });
            else
                res.json({ id: player.id, name: player.name });
        });
    })
    .delete(function(req, res) {
        if (!req.user.admin)
            return res.sendStatus(401);

        Team.find({
            name: req.params.team_name
        }, function(err, team) {
            team = team[0];
            if (err)
                res.send(err);

            let player = team.players.filter(function (p) {
              return p.id === +req.params.player_id;
            })[0];

            if (typeof player === 'undefined')
                res.json({ message: 'No player with this ID.' });
            else {
                let playerIdx = team.players.indexOf(player);
                team.players.splice(playerIdx, 1);

                team.save(function(err) {
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
        if (typeof user === 'undefined') {
            return res.status(401).json({ message: 'The username and password don\'t match' });
        }

        if (!(user.password === req.body.password)) {
            return res.status(401).json({ message: 'The username and password don\'t match (1)' });
        }

        res.status(201).json({
           id_token: createToken(user)
        });
    });

module.exports = router;
