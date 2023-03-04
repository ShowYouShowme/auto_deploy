import express = require('express');
import bodyParser = require("body-parser");
import formidable = require('formidable');
import path = require('path');

//Usage
//1: 在onDeploy里面实现部署逻辑
//2: 使用postman来上传数据包,请求方法为post,body的格式是form-data. key 类型为 File, 名字可以任意
//3. 上传接口: http://127.0.0.1:3004/api/upload
//4. 发布接口: http://127.0.0.1:3004/api/deploy
//5. 请求头增加 key = zeus-is-my-god

const port = 3004;
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(auth);
const PRIVATE_KEY = 'zeus-is-my-god';

// 在工作目录下创建 文件夹/public/files
app.post('/api/upload', (req, res, next) => {
    const form = new formidable.IncomingForm({
        uploadDir: path.join(process.cwd(), 'public', 'files'),
        multiples: false,
        maxFileSize: 200 * 1024 * 1024,
        filename: (name: string, ext: string, part: formidable.Part): string => {
            return part['originalFilename'] as string;
        }
    });
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        res.json({ fields, files });
    });
});


app.post('/api/deploy', (req, res)=>{
    onDeploy();
    res.json({
        code : 0,
        msg  : '部署成功',
        date : (new Date()).toLocaleString()
    });
})

// 部署脚本
function onDeploy(){
    console.info('开始执行部署流程....');
}

function auth(req : any, res : any, next : any) {
    let { key } = req.headers;
    if(key != PRIVATE_KEY){
        res.status(401).json({
            code : -1,
            msg  : '非法的key!'
        });
        return;
    }
    next();
}

app.listen(port, '127.0.0.1', () => {
    console.log(`Example app listening on port ${port}`);
});