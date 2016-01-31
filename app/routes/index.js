"use strict";

var express = require('express');
var router = express.Router();
var AS = require('../src/auto-slacker.js');
var PromiseGet = require('../src/promiseGet');

const promiseGet = new PromiseGet();

/* GET home page. */
router.get('/', function(req, res, next) {
	//Responds with {ok: true} if it's working
  AS.test();

  res.render('index.hbs', { title: 'Auto-Slacker' });
  
});

router.get('/list', function(req, res, next) {

	console.log("Getting /list");

	//Get the channels, then render with the data you get back
  	AS.listChannels().
  	then(function(data){
  		res.status = 200;
  		res.render('index.hbs', {
  			title: 'Auto-Slacker',
  			list: data
  		});
  		return data;
  	})
  	.catch(promiseGet.handleError);

});

router.get('/message', function(req, res, next) {
	//Get the channels, then render with the data you get back
  	res.render('message.hbs', {
  		title: 'Auto-Slacker'
  	});
});

router.post('/message', function(req, res, next) {
	console.log("/message received the request: ", req.body);
	AS.postMessage(req.body.submitter)
	.then(function(data) {
		res.render('message.hbs', {
		title: 'Auto-Slacker',
		message: data.message.text
		});
	});
});

router.get('/invite', function(req, res, next) {
  res.render('invite.hbs', {
    teamName: AS.teamName
  });
});

router.post('/invite', function(req, res, next) {
  console.log('/invite received the request: ', req.body);
  AS.inviteUser(req.body.inviter)
  .then(function(data) {
    res.render('invite.hbs', {
      teamName: AS.teamName,
      invited: req.body.inviter
    });
  });
});

module.exports = router;
