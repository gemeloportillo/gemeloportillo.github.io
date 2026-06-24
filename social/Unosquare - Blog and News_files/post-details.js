(function() {

	'use stric';

	angular.module('app')
		.controller('PostDetailsController', ['base64', PostDetailsController]);

	/**
	 * @constructor
	 */
	function PostDetailsController(base64) {
		this.content = $('#post-detail-content-hidden').text();
	}


})();