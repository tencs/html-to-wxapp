var stylelint = require('gulp-stylelint')
var plumber = require('gulp-plumber')
var gulp = require('gulp')
var path = require('path')
var chalk = require('chalk')
var stylelintConf = require('../stylelint.config.js')

function styles(opts) {
	return new Promise(function(resolve, reject){
		gulp.src(opts.css)
			.pipe(plumber({
	      errorHandler: function(err) {
					console.log(chalk.red('[Stylelint]Error:' + err.message))
				  reject(err)
	      }
	    }))
			.pipe(stylelint({
				failAfterError: true,
				reporters: [
	        {formatter: 'string', console: true}
	      ],
	      config: stylelintConf
			}))
			.on('finish', function(){
				console.log(chalk.green('stylelint passed'))
				resolve()
			})
	})
}

module.exports = function(from) {
	var opts = {
		css: path.join(from, '*.+(css|scss)'),
	}
	return Promise.resolve(opts)
		.then(styles)
}
