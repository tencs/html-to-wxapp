# h5-to-wxapp

## 开始
```javascript
//安装依赖
npm install
//将命令注册到全局
sudo npm link
```

## 使用

例如：源码`test`目录文件结构如下
```
├──test
|   └── images
|   └── index.html
|   └── index.css
```

### 执行：
```javascript
wxapp stylelint test
```

将会对test/index.css文件应用配置好的stylelint规则(stylelint.config.js)


### 执行：
```javascript
wxapp transfer test
```

将会转换成：
```
├──_wxapp_test
|   └── images
|   └── index.wxml
|   └── index.wxss

```


