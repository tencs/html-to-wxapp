html-to-wxapp - 将html及css转换成微信小程序的wxml和wxss的小工具

## 开始
```sh
//安装
npm install html-to-wxapp -g
```

## 使用

例如：源码`test`目录文件结构如下
```
├──test
│   ├── images
│   ├── index.html
│   └── index.css
```

### 执行：
```sh
wxapp stylelint test
```

将会对test/index.css文件应用配置好的stylelint规则([stylelint.config.js](https://github.com/o2team/html-to-wxapp/blob/master/stylelint.config.js))，也可以通过 --config 参数来指定配置文件


### 执行：
```sh
wxapp transfer test
```

将会转换成：
```
├──_wxapp_test
│   ├── images
│   ├── index.wxml
│   └── index.wxss

```

## 说明

1. 转换工具对html标签进行替换并删除了script等标签及内容，将css里的rem单位替换成rpx，并进行数值转换
2. stylelint规则限制了动画和过渡的使用、限制了img之外的类型选择器、禁止了两层以上的级联
3. 小程序的样式有许多限制，还需要手动调试

