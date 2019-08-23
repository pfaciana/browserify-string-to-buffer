# Notice

This package is being archived and it's functionality has been merged into https://github.com/pfaciana/browserify-buffer in version 1.1.0. Please use that package instead.

# Browserify (string to) Buffer
Combine Browserify and Buffer into one wrapper for Gulp Vinyl streams using a user defined string as the input.

Browserify's API can used for working with streams, but by itself it is not compatible for receiving and sending buffers, like the Vinyl buffers used in Gulp. One solutions is to use the Gulp Recipe here: https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-transforms.md . However it is a multiple step process. First you need to create the stream in isolation using `bundle()` (which uses a non-Vinyl buffer). Then pipe the stream to `buffer()` to convert it to a useful Vinyl buffer that Gulp can deal with.

This package allows for `browserifyStr2Buffer(transforms, opts)` to be piped at any point in a stream. It accepts, processes and returns a Vinyl buffer. It is designed to used a single step alternative for any Gulp-like stream.

This package is identical to https://github.com/pfaciana/browserify-buffer except that original `Browserify Buffer` uses the Vinyl file `path` to send to Browserify, and `Browserify (string to) Buffer` use the Vinyl file `contents`. It does this by storing the file `contents` to a temporary file and the sending that file `path` to Browserify.

In most situations this will produce identical results. So why would you want to use this instead of the original `Browserify Buffer`? This has the added benefit of using "virtual" Vinyl files, or files that do not actually exist on disk. You can create a `new Vinyl({contents: new Buffer.from("Some Content")})` that has some user generated string `contents` derived from some package upstream. And now it won't error out when it gets to Browserify because the file did not exist on disk. I use this for the occasions where I'm conditionally merging certain buffers (but not all buffers). So rather than creating a temp file in my task, then deleting it after the task is done, this will essentially do that for me behind the scenes. 

## API

<b><code>browserifyStr2Buffer(transforms = [], options = {})</code></b>

Browserify Buffer accepts two optional arguments.

### transforms

(Array) An optional array of transforms to pass to Browserify

### options

(Object) An optional Browserify options ( Referenced here: https://github.com/browserify/browserify#browserifyfiles--opts )



## Usage

Internally the transforms will get called using `apply`. So each item in the array should be the arguments array for `apply`.

``` js

var browserifyStr2Buffer = require('browserify-string-to-buffer');
var babelify = require('babelify');

gulp.task('javascript', function () {
	return gulp.src('./src/**/*.js')
		.pipe(somePackageThatReturnsAVirtualFileVinylBuffer())
		.pipe(browserifyStr2Buffer([
			[babelify, {presets: ["@babel/preset-env"]}]
		]))
		.pipe(gulp.dest('./dist/'));
});


```

However, if you only need to pass one argument, as in the example below, you do not need to need to make the item an `apply` arguments array. `browserifyStr2Buffer` will automatically convert a non-array input as a singled item array for you.

``` js

var browserifyStr2Buffer = require('browserify-string-to-buffer');
var babelify = require('babelify');

gulp.task('javascript', function () {
	return gulp.src('./src/**/*.js')
		.pipe(somePackageThatReturnsAVirtualFileVinylBuffer())
		.pipe(browserifyStr2Buffer([
			babelify.configure({presets: ["@babel/preset-env"]}),
		]))
		.pipe(gulp.dest('./dist/'));
});


```
