"use strict";
//To make our HTTP requests
const request = require('request');

const token = require('./slack-data').token;

//Module to wrap requests in promises
const PromiseGet = require('./promiseGet');

//Constructor
var AutoSlacker = (function(){
	function AutoSlacker() {

		this.teamName = "autoslacker";

		this.endPoint = "https://slack.com/api";

		//Needed for most API calls
		this.tokenParam = "?token=" + token + "&pretty=1";

		//For easy requests
		this.options = {
				method: "GET",

		};

		//Test to make sure the API is responding 
		this.test = function() {
			const self = this;
			//Give the options object a url property before making the request
			self.options.url = this.endPoint + "/api.test";

			const promiseGet = new PromiseGet(self.options);

			const promise = new Promise(function(resolve, reject) {

				request(self.options, function(err, res, body) {
				if(!err) {
				console.log(body);
				resolve(body);
				} else {
					console.log(("Error: ", err.message));
					reject(err);
				}
				});

			});

			promise.catch(promiseGet.handleError);

			return promise;

		};

		this.listChannels = function() {
			
			const self = this;

			//Set the options before we instantiate promiseGet,
			// which needs options to handle requests
			this.options.url = this.endPoint + "/channels.list" + this.tokenParam;


			const promiseGet = new PromiseGet(self.options)

			//Call the getWithGen method to make a get request wrapped in a promise
			return promiseGet.grab().then(function(data) {
				self.channels = data.channels;
				//Then narrow the data to just the channel names
				const chanNames = data.channels.map(function(key) {
					return key.name;
				});
				return chanNames;
			})
			.catch(promiseGet.handleError);

			return Promise.resolve(self.channels);

		};

		this.postMessage = function(msg) {

			const self = this;

			console.log("postMessage received data: ", msg);

			const msgParam = "&text=" + msg;

			const chanParam = "&channel=C1C6M69HQ";

			self.options.method = "POST";
			self.options.contentType = 'application/json';
			self.options.url = self.endPoint + "/chat.postMessage" + self.tokenParam + msgParam + chanParam;
			// self.options.headers = {value: 'application/x-www-form-urlencoded'};

			const promiseGet = new PromiseGet(self.options);

			return promiseGet.post();
		};

		this.getMessages = function(chan) {
			console.log("Running getMessages");
			const self = this;

			const fiveMinsAgo = Date.now() - 300000;

			self.options.method = "GET";
			self.options.url = self.endPoint + "/channels.history" + tokenParam + "&channel=" + chan + "&oldest=" + fiveMinsAgo + "&inclusive=1" + "&count=1";

			const promiseGet = new PromiseGet(self.options);
			console.log("Made a PromiseGet with self.options: ", self.options);
			promiseGet.grab()
			.then(function(data) {
				console.log("getMessages received the data: ", data);
			});
		};

		this.parseUserRes = function(msg) {

		};

		this.receiveMessage = function(msg) {
			console.log("Received message ", msg);
		};

		this.confirmUser = function(user) {

			const self = this;
			let channel;

			const promise = new Promise(function(resolve, reject) {

				self.listChannels()
				.then(function() {

					const msg = `Hey, the user ${user} would like to join the team. Let them in?`;
					console.log(msg);
					self.channels.forEach(function(key) {
						if(key.name === 'confirm-users') {
							channel = key;
							console.log("Found the confirm-users channel!");
						}
					});

					self.options.url = self.endPoint + "/chat.postMessage" + self.tokenParam + "&channel=" + channel.id + "&text=" + msg;
					self.options.method = "POST";
					console.log("About to make a new PromiseGet and post!");

					const promiseGet = new PromiseGet(self.options);
					console.log("Made a new PromiseGet!", !!promiseGet);

					resolve(promiseGet.post());
				});
					
			}); 

			promise.then(function(data) {
				self.getMessages(channel);
			});

			return promise;
		};

		this.inviteUser = function(email) {
			const self = this;

			self.options.url = "https://" + self.teamName + ".slack.com/api/users.admin.invite?t=" + Date.now() + "&token=" + token + "&email=" + email;

			self.options.contentType = "application/json";
			self.options.method = "POST";

			const promiseGet = new PromiseGet(self.options);

			return promiseGet.post();
		};

	}
	return AutoSlacker;
})();
//You should never need more than one
module.exports = new AutoSlacker();