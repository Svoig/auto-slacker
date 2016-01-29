"use strict";
//To make our HTTP requests
const request = require('request');

const token = require('./slack-data').token;

//Module to wrap requests in promises
const PromiseGet = require('./promiseGet');

//Constructor
var AutoSlacker = (function(){
	function AutoSlacker() {

		this.endPoint = "https://slack.com/api";

		//Needed for most API calls
		this.tokenParam = "?token=" + token + "&pretty=1";

		//For easy requests
		this.options = {
				method: "GET"
		};

		//Test to make sure the API is responding 
		this.test = function() {
			const self = this;

			//Give the options object a url property before making the request
			this.options.url = this.endPoint + "/api.test";

			request(self.options, function(err, res, body) {
				if(!error) {
				console.log(body);
				} else console.log(("Error: ", err.message));
			});

		};

		this.listChannels = function() {
			//Initialize some variables to store received data
			var channels, chanNames;
			
			const self = this;

			//Set the options before we instantiate promiseGet,
			// which needs options to handle requests
			this.options.url = this.endPoint + "/channels.list" + this.tokenParam;


			const promiseGet = new PromiseGet(self.options)

			//Call the getWithGen method to make a get request wrapped in a promise
			return promiseGet.getWithGen().then(function(data) {
				//Then narrow the data to just the channel names
				const chanNames = data.map(function(key) {
					return key.name;
				});
				return chanNames;
			})
			.catch(promiseGet.handleError);

		}

	}
	return AutoSlacker;
})();
//You should never need more than one
module.exports = new AutoSlacker();