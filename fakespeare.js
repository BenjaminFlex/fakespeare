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

			generate();
		});

		$('#generate').click(generate);
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
	 */
	function generate() {
		var pick = [],
			picked = 0;

		while (picked < 7) {
			var sonnetNumber = Math.floor(Math.random() * sonnetsCount);

			if (sonnets[0][sonnetNumber] !== '') {
				pick[picked] = sonnetNumber;
				picked++;
			}
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
})();