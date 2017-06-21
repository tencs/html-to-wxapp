var gulp = require('gulp')
var path = require('path')
var replace = require('gulp-replace')
var rename = require('gulp-rename')
var plumber = require('gulp-plumber')
var htmltidy = require('gulp-htmltidy')
var beautify = require('gulp-jsbeautifier')
var chalk = require('chalk')

var config = {
	remTimes: 40,   //rem -> rpx
	htmlToWxml: {
		"rmTagAndContent": "script",
		"rmTag": "!DOCTYPE|html|head|meta|title|link|body",
		"tagToView": "article|aside|body|div|ul|li|caption|dd|dl|dt|header|footer|nav|section|table|thead|tbody|tr|td|th|ol|h[1-6]|p|figure|figaption|i|ins",
		"tagToNav": "a",
		"tagToImage": "img",
		"tagToText": "span|b|em",
		"tagToCheckbox": "checkbox",
		"tagToRadio": "radio"
	}
}

// parse html
var tagReg = function(tag) {
  tag = tag || 'article|aside|body|div|ul|li|caption|dd|dl|dt|header|footer|nav|section|table|thead|tbody|tr|td|th|ol|h[1-6]|p|figure|figaption|i|ins'
  return new RegExp('(' + tag + ')(?=\\s+(class|href)=\".*\"|\>)', 'gmi')
}

var tagToNavReg = function(tag) {
  tag = tag || 'a'
  return new RegExp('<' + tag  + '(\\s[^>]+)>([^<]+)<\/' + tag + '>', 'gmi')
}

var tagToImage = function(tag) {
  tag = tag || 'img'
  return new RegExp('(' + tag + ')\\b(?=[\\s])', 'gmi')
}

var urlReg = function() {
  return new RegExp('(?:src=")(http\:|https\:){0,1}(\/\/[^("\']+)', 'g')
}

var inputToWxmlReg = function(attr) {
  return new RegExp('\\b.*type="' + attr + '"(?=[^\>].*\>)', 'gmi')
}

var rmTagReg = function(tag) {
  tag = tag || '!DOCTYPE|html|head|meta|title|link|body'
  return new RegExp('\<\/?(' + tag + ')[^\>]*.*\>', 'gmi')
}

var rmTagAndContent = function(tag) {
  tag = tag || 'script'
  return new RegExp('\<\/?(' + tag + ')[^\>]*\>(.|\\n|\\r)*?\<\/' + tag + '\>', 'gmi')
}

// parse css
var numberReverseReg = function(unit) {
  unit = unit || 'rem'
  return new RegExp('(\\d|\\.)+(?=(' + unit + '))', 'g')
}

var unitReplaceReg = function(unit) {
  unit = unit || 'rem'
  return new RegExp('(' + unit + ')', 'g')
}

var cssToImageReg = function(tag) {
  tag = tag || 'img'
  return new RegExp('(?:\\s)(' + tag + ')\\b(?=[\\s\\{])', 'gmi')
}

var cssToTextReg = function(tag) {
  tag = tag || 'span|b|em'
  return new RegExp('(?:\\s)(' + tag + ')\\b(?=[\\s\\{])', 'gmi')
}

var remReplacer = function(match) {
  return match * config.remTimes
}

function htmlToWxml(opts){
	return new Promise(function(resolve, reject){
		var htmlToWxml = config.htmlToWxml || {}
		gulp.src(opts.html)
			.pipe(replace(rmTagAndContent(htmlToWxml['rmTagAndContent']), ''))
			.pipe(htmltidy({
	      'output-xml': true,
	      'drop-empty-elements': false,
	      indent: true,
	    }))
			.pipe(replace(rmTagReg(htmlToWxml['rmTag']), ''))
		  .pipe(replace(tagReg(htmlToWxml['tagToView']), 'view'))
		  .pipe(replace(tagToImage(htmlToWxml['tagToImage']), 'image'))
		  .pipe(replace(inputToWxmlReg(htmlToWxml['tagToCheckbox']), 'checkbox'))
		  .pipe(replace(inputToWxmlReg(htmlToWxml['tagToRadio']), 'radio'))
		  .pipe(replace(tagReg(htmlToWxml['tagToText']), 'text'))
		  .pipe(replace(tagReg(htmlToWxml['tagToNav']), 'navigator'))
			.pipe(replace(urlReg(), 'src="https:$2'))
		  .pipe(replace(/href/g, 'url'))
		  .pipe(replace(/^\s*[\r\n]/g, ''))
		  .pipe(beautify({
	      indent_level: 2
	    }))
		  .pipe(rename(function(location) {
		      location.extname = '.wxml'
		      return location
		    }))
			.pipe(gulp.dest(opts.dist))
			.on('end', function(){
				console.log(chalk.gray('html to wxml'))
				resolve(opts)
			})
	})
}

function cssToWxss(opts){
	return new Promise(function(resolve, reject){
		gulp.src(opts.css)
			.pipe(replace(numberReverseReg('rem'), remReplacer))
			.pipe(replace(unitReplaceReg('rem'), 'rpx'))
			.pipe(replace(cssToImageReg('img'), ' image'))
		  .pipe(rename(function(location) {
	      location.extname = '.wxss'
	      return location
	    }))
			.pipe(gulp.dest(opts.dist))
			.on('end', function(){
				console.log(chalk.gray('css to wxss'))
				resolve(opts)
			})
	})
}

function copyAssets(opts){
	return new Promise(function(resolve, reject){
		gulp.src(opts.assets)
			.pipe(gulp.dest(opts.dist))
			.on('end', function(){
				console.log(chalk.gray('copy assets'))
				resolve(opts)
			})
	})
}

module.exports = function(from, to, conf) {
	var opts = {
		html: path.join(from, '*.html'),
		css: path.join(from, '*.css'),
		assets: path.join(from, '**/*.+(png|jpg|gif|mp3|webp)'),
		dist: to
	}
	if(conf) {
		for(var i in conf){
			i in config && (config[i] = conf[i])
		}
	}
	return Promise.resolve(opts)
		.then(htmlToWxml)
		.then(cssToWxss)
		.then(copyAssets)
}
