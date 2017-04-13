# vscode-paste-image-to-qiniu

一个可以支持截图粘贴上传图片到七牛、让你写用vscode写markdown有更好的体验。

![screenshot](./screenshot/screenshot.gif)

## 安装
输入命令：
```bash
ext install paste-image-to-qiniu
```

## 参数设置
```js
{
    // 有效的七牛 AccessKey 签名授权
    "pasteImageToQiniu.access_key": "*****************************************",

    // 有效的七牛 SecretKey 签名授权
    "pasteImageToQiniu.secret_key": "*****************************************",

    // 七牛图片上传空间
    "pasteImageToQiniu.bucket": "blog",

    // 七牛图片上传路径，参数化命名，暂时支持 ${fileName}、${mdFileName}、${date}、${dateTime}
    // 示例：
    //   ${fileName}-${date} -> picName-20160725.jpg
    //   ${mdFileName}-${dateTime} -> markdownName-20170412222810.jpg
    "pasteImageToQiniu.remotePath": "${fileName}",

    // 七牛图床域名
    "pasteImageToQiniu.domain": "http://xxxxx.xxxx.com",

    // 本地储存位置
    "pasteImageToQiniu.localPath":"./img"
}
```