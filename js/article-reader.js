// 文章读取器
class ArticleReader {
    constructor() {
        this.articleContent = document.getElementById('article-content');
        this.init();
    }

    init() {
        // 从URL参数获取文章文件名
        const urlParams = new URLSearchParams(window.location.search);
        const articleFile = urlParams.get('article');
        
        if (articleFile) {
            this.loadArticle(articleFile);
        } else {
            this.showError('未指定文章文件');
        }
    }

    async loadArticle(filename) {
        try {
            // 根据文件名判断是文章还是诗歌
            let filePath;
            if (filename.includes('LiHe') || filename.includes('poem') || filename.includes('poetry')) {
                filePath = `../../ALL_DATA/poetry/${filename}.txt`;
            } else {
                filePath = `../../ALL_DATA/articles/${filename}.txt`;
            }
            
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error('文章文件不存在');
            }
            
            const text = await response.text();
            const article = this.parseArticle(text);
            this.displayArticle(article);
        } catch (error) {
            this.showError('加载文章失败: ' + error.message);
        }
    }

    parseArticle(text) {
        const lines = text.split('\n');
        const article = {
            title: '',
            author: '',
            author_link: '',
            type: 'prose',
            content: ''
        };

        let isContent = false;
        let contentLines = [];

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            if (line.startsWith('title:')) {
                article.title = line.substring(6).trim();
            } else if (line.startsWith('author:')) {
                article.author = line.substring(7).trim();
            } else if (line.startsWith('author_link:')) {
                article.author_link = line.substring(12).trim();
            } else if (line.startsWith('type:')) {
                article.type = line.substring(5).trim();
            } else if (line.startsWith('content:')) {
                isContent = true;
            } else if (isContent) {
                contentLines.push(line);
            }
        }

        article.content = contentLines.join('\n');
        return article;
    }

    displayArticle(article) {
        // 设置页面标题
        document.title = article.title;

        // 创建文章HTML
        const html = `
            <header class="post-header">
                <h1 class="post-title">${article.title}</h1>
                <a href="${article.author_link}" target="_blank" style="text-decoration: none;">
                    <p class="post-meta">作者：${article.author}</p>
                </a>
            </header>
            <section class="post-content ${article.type === 'poem' ? 'poem-content' : ''}">
                ${this.formatContent(article.content, article.type)}
            </section>
        `;

        this.articleContent.innerHTML = html;
    }

    formatContent(content, type) {
        if (type === 'poem') {
            // 诗歌格式：每行用<br>分隔
            return content.split('\n').map(line => 
                line.trim() ? `<p class="poem-line">${line}</p>` : '<br>'
            ).join('');
        } else {
            // 散文格式：段落用<p>标签
            return content.split('\n').map(line => 
                line.trim() ? `<p>${line}</p>` : ''
            ).join('');
        }
    }

    showError(message) {
        this.articleContent.innerHTML = `
            <div class="error-message">
                <h2>错误</h2>
                <p>${message}</p>
                <a href="../../index.html">返回首页</a>
            </div>
        `;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ArticleReader();
}); 