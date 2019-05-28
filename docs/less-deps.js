'use strict';

const path = require('path'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	through = require('through'),
	through2 = require('through2');

module.exports = function (transforms = [], opts = {}) {

	return through2.obj(function (file, encoding, cb) {
		const str = file.contents.toString();

		let stream = browserify(opts)
			.add(path.join(__dirname, 'empty.js'))
			.transform(() => {
				return through(() => {
				}, function () {
					this.queue(str);
					this.queue(null);
				});
			});

		transforms.forEach(transform => stream = stream.transform(transform));

		file.contents = stream.bundle();

		buffer().on('data', function (data) {
			this.push(data);
		}.bind(this))._transform.bind(this)(file, encoding, cb);

	});
};