const fs = require('fs');
const path = require('path');

/**
 * 处理提交问题的API
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
function handleSubmit(req, res) {
    try {
        // 获取请求体中的内容
        const { content } = req.body;
        
        // 验证内容是否存在
        if (!content || typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '问题内容不能为空'
            });
        }
        
        // 数据文件路径
        const dataFilePath = path.join(__dirname, '../data/data.json');
        
        // 读取现有数据
        let questions = [];
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            if (fileData.trim()) {
                questions = JSON.parse(fileData);
            }
        }
        
        // 生成新ID（自增）
        const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
        
        // 创建新问题对象
        const newQuestion = {
            id: newId,
            content: content.trim(),
            timestamp: new Date().toISOString() // 记录提交时间，方便后续扩展
        };
        
        // 添加到问题列表
        questions.push(newQuestion);
        
        // 写入文件
        fs.writeFileSync(dataFilePath, JSON.stringify(questions, null, 2), 'utf8');
        
        // 返回成功响应
        return res.status(200).json({
            success: true,
            message: '问题已提交'
        });
    } catch (error) {
        console.error('提交问题时出错:', error);
        
        // 返回错误响应
        return res.status(500).json({
            success: false,
            message: '服务器内部错误，请稍后重试'
        });
    }
}

module.exports = handleSubmit; 