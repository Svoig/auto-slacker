"use strict";

const request = require('request');

const token = require('./slack-data').token;

var AutoSlacker = (function(){
	function AutoSlacker() {

		this.endPoint = "https://slack.com/api";
		//Needed for most API calls
		this.tokenParam = "?token=" + token + "&pretty=1";

		this.channels = {};

		this.options = {
				method: "GET"
		};

		this.test = function() {
			const self = this;

			this.options.url = this.endPoint + "/api.test";

			request(self.options, function(err, res, body) {
				console.log(body);
			});

		};

		this.listChannels = function() {
			
			const self = this;

			this.options.url = this.endPoint + "/channels.list" + this.tokenParam;

			request(self.options, function(err, res, body) {
				console.log(JSON.parse(body).ok);
			//Convert the JSON response and store the channels
				self.channels = JSON.parse(body).channels;
			});

			let channels = Object.keys(self.channels);

			let chanNames = channels.forEach(function(key) {
				return key.name;
			});

			return chanNames;
		}

		this.listChannels = function() {	
		}

		/* this.sendMessage = function(channel, token, text) {

		} */

	}

	return AutoSlacker;
})();

module.exports = new AutoSlacker();