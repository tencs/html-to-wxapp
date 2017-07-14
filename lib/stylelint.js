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
				  reject(chalk.red('[Stylelint]Error:' + err.message))
	      }
	    }))
			.pipe(stylelint({
				failAfterError: true,
				reporters: [
	        {formatter: 'string', console: true}
	      ],
	      config: opts.config
			}))
			.on('finish', function(){
				console.log(chalk.gray('stylelint passed'))
				resolve()
			})
	})
}

module.exports = function(from, config) {
	var opts = {
		css: path.join(from, '*.+(css|scss)'),
		config: config || stylelintConf
	}
	return Promise.resolve(opts)
		.then(styles)
		.catch(function(e){
			console.log(e)
		})
}
