"use strict"

module.exports = {
    "rules": {
		// 禁止多层级联
        "selector-max-compound-selectors": 2,
        // 禁止类型选择器
        "selector-no-type": [true, {
        	"ignoreTypes": ['img']
        }],
        // 禁用动画
        "at-rule-blacklist": ['keyframes'],
        // 禁用选择器前缀
        "at-rule-no-vendor-prefix": true,
        // 禁用属性
        "property-blacklist": ['transition', 'animation']

    }
};
