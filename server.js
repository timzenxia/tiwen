const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// 引入API处理函数
const handleSubmit = require('./api/submit');
const handleList = require('./api/list');
const handleDelete = require('./api/delete');

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 使用中间件
app.use(cors()); // 允许跨域请求
// 增加请求体积限制，从默认的100kb增加到10mb
app.use(bodyParser.json({ limit: '10mb' })); 
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // 提供静态文件

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// 确保data.json文件存在
const dataFilePath = path.join(dataDir, 'data.json');
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, '[]', 'utf8');
}

// API路由
app.post('/api/submit', handleSubmit); // 处理提交问题
app.get('/api/list', handleList); // 获取问题列表
app.delete('/api/delete/:id', handleDelete); // 删除特定问题

// 前端路由（SPA支持）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/submit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'list.html'));
});

// 处理404（未找到的路由）
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动，运行在 http://localhost:${PORT}`);
    console.log(`- 主页: http://localhost:${PORT}`);
    console.log(`- 提交问题页: http://localhost:${PORT}/submit.html`);
    console.log(`- 问题列表页: http://localhost:${PORT}/list.html`);
}); 