/*
 * Client-side CAPTCHA plugin for jQuery 
 * 
 * Features:
 *  - Fully client-side, no server scripting required
 *  - Protects you from evil robots (good and neutral robots are permitted)
 *  - Sound anti-spam practices as used by large corporations such as Sony
 *  - Inspired by http://pro.sony.com/bbsc/jsp/forms/generateCaptcha.jsp
 */
(function($) {
	var defaults = {
		// Form input element that the user will type into. Required.
		input: null,
		// Element which the CAPTCHA will be appended to. Required.
		display: null,
		// Function to call when the CAPTCHA passes.
		pass: function() { return true; },
		// Function to call when the CAPTCHA fails to pass.
		fail: function() { return false; },
		// Length of CAPTCHA text.
		captchaLength: 5,
		// Characters to use when generating text
		chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
	};
	function generateCaptcha(options) {
		var text = '';
		for (var i = 0; i < options.captchaLength; i++) {
			var rand = Math.floor(Math.random() * options.chars.length);
			text += options.chars.charAt(rand);
		}
		return text;
	}
	function init(form, options) {
		var $this = $(form);
		var captchaText = generateCaptcha(options);
		$this.data('captchaText', captchaText);
		// Create CAPTCHA ui
		var table = $('<table></table>').css({ 
			'font-family' : 'cursive',
			'color' : '#fff', 
			'background-color' : '#A0A0A0',
			'text-decoration' : 'none'
		});
		var row = $('<tr></tr>').appendTo(table);
		for (var i=0; i < captchaText.length; i++) {
			$('<td>' + captchaText.charAt(i) + '</td>').css({
				'border' : '1px solid lightgrey'
			}).appendTo(row);
		}
		table.appendTo(options.display);

		// Hook events
		$this.bind('submit', function(event) {
			var value = $(options.input).val();
			if (value === captchaText) {
				return options.pass.apply(this);
			} else {
				return options.fail.apply(this);
			}
		});
		
	}
	$.fn.clientSideCaptcha = function(options) {
		var opts = $.extend({}, defaults, options);
		return this.each(function() {
			if (this.tagName.toLowerCase() === 'form' && $(opts.input).length && $(opts.display).length) {
				init(this, opts);
			}
		});
	}
})(jQuery)
