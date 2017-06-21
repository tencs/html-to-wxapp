module.exports = {
	remTimes: 40,   //rem -> rpx
	distNamePre: '_wxapp_',  //转换后重命名前缀
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