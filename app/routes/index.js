var express = require('express');
var router = express.Router();
var AS = require('../auto-slacker.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	
  AS.test();

  res.render('index.hbs', { title: 'Auto-Slacker' });
  
});

module.exports = router;
