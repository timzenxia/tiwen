const fs = require('fs');
const path = require('path');

/**
 * 处理删除问题的API
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
function handleDelete(req, res) {
    try {
        // 获取要删除的问题ID
        const questionId = parseInt(req.params.id);
        
        if (isNaN(questionId)) {
            return res.status(400).json({
                success: false,
                message: '无效的问题ID'
            });
        }
        
        // 数据文件路径
        const dataFilePath = path.join(__dirname, '../data/data.json');
        
        // 检查文件是否存在
        if (!fs.existsSync(dataFilePath)) {
            return res.status(404).json({
                success: false,
                message: '数据文件不存在'
            });
        }
        
        // 读取文件内容
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        
        // 解析JSON数据
        let questions = [];
        if (fileData.trim()) {
            questions = JSON.parse(fileData);
        }
        
        // 查找要删除的问题索引
        const questionIndex = questions.findIndex(q => q.id === questionId);
        
        if (questionIndex === -1) {
            return res.status(404).json({
                success: false,
                message: '未找到指定ID的问题'
            });
        }
        
        // 从数组中删除问题
        questions.splice(questionIndex, 1);
        
        // 将更新后的数据写回文件
        fs.writeFileSync(dataFilePath, JSON.stringify(questions, null, 2), 'utf8');
        
        // 返回成功响应
        return res.status(200).json({
            success: true,
            message: '问题删除成功'
        });
    } catch (error) {
        console.error('删除问题时出错:', error);
        
        // 返回错误响应
        return res.status(500).json({
            success: false,
            message: '服务器内部错误，请稍后重试'
        });
    }
}

module.exports = handleDelete;
