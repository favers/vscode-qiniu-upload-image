# vscode-paste-image-to-qiniu

一个可以支持截图粘贴上传图片到七牛、让你写用vscode写markdown有更好的体验。

![screenshot](./screenshot/screenshot.gif)

## 安装
输入命令：
```bash
ext install paste-image-to-qiniu
```
或者在插件应用商店搜索paste-image-to-qiniu安装

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

一直使用vscode来开发、写笔记文章、但是用了几款vscode的图床插件都不是很符合我的需求。今天本来想看看书写点笔记、但是发现截图了去处理图片太过于麻烦、于是有了这个插件、仅仅是想体验一下vscode插件的开发流程、也可以方便自己的写体验。

将[vscode-paste-image](https://github.com/mushanshitiancai/vscode-paste-image)和[vscode-qiniu-upload-image](https://github.com/yscoder/vscode-qiniu-upload-image)综合改成了现在这个插件。

如果用的开心给个star也不错！