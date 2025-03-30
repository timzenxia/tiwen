# 问题收集系统

这是一个设计精美的问题收集系统，用于通过Web页面收集和管理用户提交的问题，采用了现代化的Linear App设计风格。

## 功能特点

- **美观的设计风格**：基于Linear App的简约现代界面设计
- **二维码生成与扫描**：主页生成二维码，扫码后跳转到提交问题页面
- **问题提交功能**：用户输入并提交问题，实时反馈处理状态
- **问题列表管理**：管理员查看已提交的问题列表，支持一键复制内容
- **实时数据更新**：问题列表页面每5秒自动刷新，有新问题时显示通知
- **多终端适配**：完全响应式设计，适配移动端和桌面端
- **优雅的交互体验**：精心设计的动画和状态反馈

## 技术栈

- **前端**：HTML + Tailwind CSS + JavaScript
- **后端**：Node.js + Express
- **数据存储**：本地JSON文件 (data.json)

## 项目目录结构

```
/tiwen.xinglinzhiyu.com
├── /api                  // API处理逻辑
│   ├── list.js           // 处理获取问题列表
│   └── submit.js         // 处理提交问题
├── /data                 // 数据存储
│   └── data.json         // 问题数据JSON文件
├── /public               // 静态前端资源
│   ├── index.html        // 主页（包含二维码）
│   ├── submit.html       // 提交问题页面（移动端适配）
│   └── list.html         // 问题列表页面（自动刷新+复制功能）
├── package.json          // 项目依赖
├── server.js             // 服务器入口文件
├── nginx.conf.example    // Nginx配置示例
└── README.md             // 项目说明文件
```

## 页面说明

### 1. 主页（index.html）
- 美观的页面布局和渐变背景
- 256x256px的二维码，使用蓝色主题颜色
- 提供直接访问链接，增强可用性

### 2. 提交问题页（submit.html）
- 直观易用的表单设计
- 实时的表单验证和错误反馈
- 提交状态的动画反馈
- 完全适配移动端设备

### 3. 问题列表页（list.html）
- 自动刷新数据（5秒间隔）
- 新数据通知提示
- 一键复制问题内容功能
- 支持大数据量的滚动设计
- 优雅的空状态和错误状态处理

## 安装步骤

1. 克隆或下载项目到服务器

```bash
git clone <仓库地址> /path/to/tiwen.xinglinzhiyu.com
cd /path/to/tiwen.xinglinzhiyu.com
```

2. 安装依赖

```bash
npm install
```

3. 启动应用

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## 部署到生产环境

### 使用PM2部署

1. 安装PM2

```bash
npm install -g pm2
```

2. 启动应用

```bash
pm2 start server.js --name "tiwen"
```

3. 设置开机自启

```bash
pm2 startup
pm2 save
```

### Nginx配置

下面是一个基本的Nginx配置示例，用于反向代理到Node.js应用：

```nginx
server {
    listen 80;
    server_name tiwen.xinglinzhiyu.com;

    # 重定向HTTP到HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name tiwen.xinglinzhiyu.com;

    # SSL证书配置
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # SSL设置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # 静态文件缓存设置
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        root /path/to/tiwen.xinglinzhiyu.com/public;
        expires 1d;
    }
    
    # 反向代理到Node.js应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 注意事项

1. 确保服务器上安装了Node.js (推荐v16.x或更高版本)
2. 确保data目录具有读写权限
3. 若使用Nginx反向代理，需要确保域名DNS已经指向服务器IP
4. 为了安全性，建议添加基本的访问控制，特别是对问题列表页的访问
5. 默认配置的请求体积限制为10MB，可在server.js中按需调整

## 浏览器兼容性

- 推荐使用最新版本的Chrome、Firefox、Safari或Edge浏览器
- 支持iOS 13+和Android 8+上的移动端浏览器
- 低版本浏览器可能无法显示部分动画效果 