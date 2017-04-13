const vscode = require('vscode');
const path = require('path');
const moment = require('moment');
const fs = require('fs');
const { spawn } = require('child_process');
const qnUpload = require('./lib/upload');

exports.activate = (context) => {
    const disposable = vscode.commands.registerCommand('extension.pasteImageToQiniu', () => {
        start();
    });
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
exports.deactivate = () => { }

function start() {
    // 获取当前编辑文件
    let editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let fileUri = editor.document.uri;
    if (!fileUri) return;

    if (fileUri.scheme === 'untitled') {
        vscode.window.showInformationMessage('Before paste image, you need to save current edit file first.');
        return;
    }

    let selection = editor.selection;
    let selectText = editor.document.getText(selection);

    if (selectText && !/^[\w\-.]+$/.test(selectText)) {
        vscode.window.showInformationMessage('Your selection is not a valid file name!');
        return;
    }
    let config = vscode.workspace.getConfiguration('pasteImageToQiniu');
    let localPath = config['localPath'];
    if (localPath && (localPath.length !== localPath.trim().length)) {
        vscode.window.showErrorMessage('The specified path is invalid. "' + localPath + '"');
        return;
    }

    let filePath = fileUri.fsPath;
    let imagePath = getImagePath(filePath, selectText, localPath);
    const mdFilePath = editor.document.fileName;
    const mdFileName = path.basename(mdFilePath, path.extname(mdFilePath));

    createImageDirWithImagePath(imagePath).then(imagePath => {
        saveClipboardImageToFileAndGetPath(imagePath, (imagePath) => {
            if (!imagePath) return;
            if (imagePath === 'no image') {
                vscode.window.showInformationMessage('There is not a image in clipboard.');
                return;
            }
            qnUpload(config, imagePath, mdFilePath).then(({ name, url }) => {
                vscode.window.showInformationMessage('上传成功');
                const img = `![${name}](${url})`;
                editor.edit(textEditorEdit => {
                    textEditorEdit.insert(editor.selection.active, img)
                });
            }).catch((err) => {
                vscode.window.showErrorMessage('Upload error.');
            });
        });
    }).catch(err => {
        vscode.window.showErrorMessage('Failed make folder.');
        return;
    });
}

function getImagePath(filePath, selectText, localPath) {
    // 图片名称
    let imageFileName = '';
    if (!selectText) {
        imageFileName = moment().format("Y-MM-DD-HH-mm-ss") + '.png';
    } else {
        imageFileName = selectText + '.png';
    }

    // 图片本地保存路径
    let folderPath = path.dirname(filePath);
    let imagePath = '';
    if (path.isAbsolute(localPath)) {
        imagePath = path.join(localPath, imageFileName);
    } else {
        imagePath = path.join(folderPath, localPath, imageFileName);
    }

    return imagePath;
}

function createImageDirWithImagePath(imagePath) {
    return new Promise((resolve, reject) => {
        let imageDir = path.dirname(imagePath);
        fs.exists(imageDir, (exists) => {
            if (exists) {
                resolve(imagePath);
                return;
            }
            fs.mkdir(imageDir, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(imagePath);
            });
        });
    });
}

function saveClipboardImageToFileAndGetPath(imagePath, cb) {
    if (!imagePath) return;
    let platform = process.platform;
    if (platform === 'win32') {
        // Windows
        const scriptPath = path.join(__dirname, './lib/pc.ps1');
        const powershell = spawn('powershell', [
            '-noprofile',
            '-noninteractive',
            '-nologo',
            '-sta',
            '-executionpolicy', 'unrestricted',
            '-windowstyle', 'hidden',
            '-file', scriptPath,
            imagePath
        ]);
        powershell.on('exit', function (code, signal) {

        });
        powershell.stdout.on('data', function (data) {
            cb(data.toString().trim());
        });
    } else if (platform === 'darwin') {
        // Mac
        let scriptPath = path.join(__dirname, './lib/mac.applescript');

        let ascript = spawn('osascript', [scriptPath, imagePath]);
        ascript.on('exit', function (code, signal) {
            
        });

        ascript.stdout.on('data', function (data) {
            cb(data.toString().trim());
        });
    } else {
        // Linux 

        let scriptPath = path.join(__dirname, './lib/linux.sh');

        let ascript = spawn('sh', [scriptPath, imagePath]);
        ascript.on('exit', function (code, signal) {
            
        });

        ascript.stdout.on('data', function (data) {
            let result = data.toString().trim();
            if (result == "no xclip") {
                vscode.window.showInformationMessage('You need to install xclip command first.');
                return;
            }
            cb(result);
        });
    }
}