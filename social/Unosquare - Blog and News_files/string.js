(function() {

	'use strict';

	/**
	 * String Services Module
	 *
	 */
	angular.module('stringServices', [])
		/**
		 * Basic service to provide base64 encoding and decoding to UTF8
		 * The services use under the hood the Modern Browsers: atob() & btoa()
		 */
		.factory('base64', function() {
			return {

				/**
				 * Creates a base-64 encoded ASCII string from a "string" of binary data.
				 * @param  {string} str
				 * @return {string}
				 */
				utf8ToBase64: function encodeToUTF8 (str) {
					return window.btoa(unescape(encodeURIComponent(str)));
				},

				/**
				 * Decodes a string of data which has been encoded using base-64 encoding.
				 * @param  {string} base64String
				 * @return {string}
				 */
				base64ToUtf8: function base64ToUtf8 (base64String) {
					return decodeURIComponent(escape(window.atob(base64String)));
				}

			};
		})

})();