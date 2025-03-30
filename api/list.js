const fs = require('fs');
const path = require('path');

/**
 * 处理获取问题列表的API
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
function handleList(req, res) {
    try {
        // 数据文件路径
        const dataFilePath = path.join(__dirname, '../data/data.json');
        
        // 检查文件是否存在
        if (!fs.existsSync(dataFilePath)) {
            // 文件不存在，返回空数组
            return res.status(200).json([]);
        }
        
        // 读取文件内容
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        
        // 解析JSON数据
        let questions = [];
        if (fileData.trim()) {
            questions = JSON.parse(fileData);
        }
        
        // 返回问题列表（按ID排序）
        questions.sort((a, b) => a.id - b.id);
        
        return res.status(200).json(questions);
    } catch (error) {
        console.error('获取问题列表时出错:', error);
        
        // 返回错误响应
        return res.status(500).json({
            success: false, 
            message: '服务器内部错误，请稍后重试'
        });
    }
}

module.exports = handleList; 