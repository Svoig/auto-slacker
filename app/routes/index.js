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

})

module.exports = router;
