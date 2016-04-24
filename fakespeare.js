(function () {
	'use strict';

	var sonnets,
		sonnetsCount,
		fakeSonnetContainers = [],
		realSonnetContainers = [],
		lineRhymes = [0, 1, 0, 1, 2, 3, 2, 3, 4, 5, 4, 5, 6, 6],
		currentSonnet = [];

	$(function () {
		$.ajax('sonnets.json', {
			dataType: 'json'
		}).done(function (data) {
			sonnets = data;
			sonnetsCount = data[0].length;

			var match = location.href.match(/s=(.+)/);

			if (match && match[1]) {
				var initial = decode(match[1]);

				if (initial && Array.isArray(initial) && initial.length === 7) {
					return generate(initial);
				}
			}

			generate();
		});

		$('#generate').click(function () {
			// We don't want the event object to be passed in to generate.
			generate();
		});
		$('#real').hide();

		for (var i = 0; i < 14; i++) {
			var $fakeLine = $('#fake-line-' + (i + 1)),
				$realLine = $('#real-line-' + (i + 1));

			$fakeLine.mouseover(i, function ($event) {
				var line = $event.data,
					lines = [],
					$containers = $(),
					rhyme = lineRhymes[line];

				lineRhymes.forEach(function (rhymeNumber, line) {
					if (rhymeNumber === rhyme) {
						$containers = $containers.add(fakeSonnetContainers[line]);
						lines.push(line);
					}
				});

				$containers.addClass('highlight');
				$containers.find('.label').removeClass('invisible');

				var sonnetNumber = currentSonnet[line],
					$real = $('#real');

				realSonnetContainers.forEach(function (container, line) {
					container.text(sonnets[line][sonnetNumber]);

					if (lines.indexOf(line) !== -1) {
						container.addClass('highlight');
					} else {
						container.removeClass('highlight');
					}
				});

				$real.show();
			});

			$fakeLine.mouseout(function () {
				fakeSonnetContainers.forEach(function (container) {
					container.removeClass('highlight');
					container.find('.label').addClass('invisible');

					var $real = $('#real');
					$real.hide();

					realSonnetContainers.forEach(function (container) {
						container.text('');
					});
				});
			});

			fakeSonnetContainers[i] = $fakeLine;
			realSonnetContainers[i] = $realLine;
		}
	});

	/**
	 * Generates a new sonnet.
	 * @param {Number[]} initial An initial pick to use.
	 */
	function generate(initial) {
		var pick = [],
			picked = 0;

		if (!initial) {
			while (picked < 7) {
				var sonnetNumber = Math.floor(Math.random() * sonnetsCount);

				if (sonnets[0][sonnetNumber] !== '') {
					pick[picked] = sonnetNumber;
					picked++;
				}
			}

			history.pushState(null, null, '?s=' + encode(pick));
		} else {
			pick = initial;
		}

		lineRhymes.forEach(function (rhymeNumber, line) {
			var $container = fakeSonnetContainers[line],
				$label = $container.find('.label'),
				$line = $container.find('.line-text');

			$label.text(pick[rhymeNumber] + 1);
			$line.text(sonnets[line][pick[rhymeNumber]]);

			currentSonnet[line] = pick[rhymeNumber];
		});
	}

	/**
	 * Encodes an array of sonnet numbers into a string.
	 * @param {Number[]} sonnets The sonnets.
	 * @returns {String} The encoded string.
	 */
	function encode(sonnets) {
		return btoa(sonnets.reduce(function (m, c) { return m + String.fromCharCode(c); }, '')).replace(/=/g, '');
	}

	/**
	 * Decodes an encoded sonnet string.
	 * @param {String} code The encoded string.
	 * @returns {Number[]} An array of sonnet numbers.
	 */
	function decode(code) {
		try {
			return atob(code).split('').map(function (c) { return c.charCodeAt(0); });
		} catch (e) {
			return null;
		}
	}
})();