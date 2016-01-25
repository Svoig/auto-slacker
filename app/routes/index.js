"use strict";

var express = require('express');
var router = express.Router();
var AS = require('../auto-slacker.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  AS.test();

  res.render('index.hbs', { title: 'Auto-Slacker' });
  
});

router.get('/list', function(req, res, next) {

	console.log("Getting /list");

  function* getNames(){
  		console.log('Greetings from getNames!');
		const chanNames = yield* AS.listChannels();
		console.log("Greetings from getNames!",chanNames);
		return chanNames;
	};

	const chanNames = getNames();
	//getNames.next();
	console.log("Got the chanNames!", chanNames);
	const channels = Object.keys(AS.channels);
	
	res.render('index.hbs', {
		title: 'Auto-Slacker',
		 list: chanNames
	});
})

module.exports = router;
