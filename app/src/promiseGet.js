"use strict";
const request = require("request");

const PromiseGet = (function() {

	function PromiseGet(options) {
		//Store an options object to use with the request 
		this.options = options;

		this.handleError = function(err) {
			console.log(`There was an error: ${err.message}`);
		};

		this.post = function(value) {
			const self = this;

			const promise = new Promise(function(resolve, reject) {
				request(self.options, function(err, req, res) {
					if (err) {
						throw new Error(err.message);
					} else {
						resolve(JSON.parse(res));
					}
				});
			});

			promise.then(function(data) {
				console.log("The post was made, gave response ", data);
			});

			promise.catch(self.handleError);

			return promise;
		};

		this.grab = function() {
			const self = this;

			const promise = new Promise(function(resolve, reject) {

				request(self.options, function(err, req, res) {
					if (err) {
						throw new Error(err.message);
					} else {
						resolve(JSON.parse(res).channels);
					}
				});
			});

		promise.then(function(data) {
			console.log("The request promise was resolved with the value: ", data);
		});

		promise.catch(self.handleError);

		return promise;
		};

		this.getWithGen = function() {
			const jen = this.gen();
			//I'm not sure why, but jen.next() itself isn't the promise
			const one = jen.next().value;

			return one;
			//But if I did another jen.next() it IS the promise...
		};

		this.gen = function*() {
			const self = this;
			yield this.grab(self.options.url);
		};
	
	};

	return PromiseGet;

})();

module.exports = PromiseGet;