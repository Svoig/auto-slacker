const request = require('request');

var AutoSlacker = (function(){
	function AutoSlacker(org, token) {

		this.endPoint = "https://slack.com/api";

		this.test = function() {
			this.urlEnd = "/api.test";

			this.options = {
				url: this.endPoint + this.urlEnd,
				method: "GET"
			};

			request(this.options, function(err, res, body) {
				console.log(body);
			})

		};

	}

	return AutoSlacker;
})();

module.exports = new AutoSlacker();