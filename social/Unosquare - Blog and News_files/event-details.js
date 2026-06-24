(function() {

	'use stric';

	angular.module('app')
		.controller('EventDetailsController', ['base64', EventDetailsController]);

	/**
	 * @constructor
	 */
	function EventDetailsController(base64) {
		this.content = $('#event-detail-content-hidden').text();
	}


})();