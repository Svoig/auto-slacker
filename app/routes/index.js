"use strict";


const express = require('express');
const router = express.Router();
const AS = require('../src/auto-slacker.js');
const PromiseGet = require('../src/promiseGet');

const promiseGet = new PromiseGet();

/* GET home page. */
router.get('/base', function(req, res, next) {
	//Responds with {ok: true} if it's working
  AS.test()
  .then(function(data) {
    let msg;

    if(res.body.ok === "true") {
      msg = "Everything is working properly!";
    } else {
      msg = "There was a problem communicating with Slack";
    }
    res.render('test.hbs', { response: msg });
  });

  
});

router.get('/test', function(req, res, next) {
  let returned;

  const promise = new Promise(function(resolve, reject) {
    resolve(AS.confirmUser('rogerbutt@doom.com'));
  })
  .then(function(data) {
    console.log("/test got data ", data);
  });
  /*AS.confirmUser('rogerbutt@doom.com')
  .then(function(data) {
    returned = data;
  });*/
  console.log(returned);
  console.log("AS.confirmUser returns: ", returned);
})

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
	})
  .catch(promiseGet.handleError);
});

router.get('/invite', function(req, res, next) {
  res.render('invite.hbs', {
    teamName: AS.teamName
  });
});

router.post('/invite', function(req, res, next) {
  console.log('/invite received the request: ', req.body);

//Holding off on AS.confirmUser for now
  AS.inviteUser(req.body.invited)
  .then(function(data) {
    if(res.body != true && data.error != undefined) {
      res.status(500);
      console.log("Invite returned error: ", data.error);

      if(data.error === 'already_in_team') {  
        res.render('invite.hbs', {
          teamName: AS.teamName,
          error: "User is already in the team"
        });
      } else if(data.error === 'already_invited') {
        res.render('invite.hbs', {
          teamName: AS.teamName,
          error: "User has already been invited to this team"
        });
      }

    } else {
      res.render('invite.hbs', {
        teamName: AS.teamName,
        invited: req.body.invited
      });
    }
  })
  .catch(promiseGet.handleError);

});

router.get('/', function(req, res, next) {
  res.render("main.hbs");
});

module.exports = router;
