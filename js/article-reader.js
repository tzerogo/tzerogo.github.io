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
        // 【修改点 A】：获取 type 参数，如果缺失则默认为 'prose'
        const articleType = urlParams.get('type') || 'prose'; 
        
        if (articleFile) {
            // 【修改点 B】：将 type 传递给 loadArticle
            this.loadArticle(articleFile, articleType);
        } else {
            this.showError('未指定文章文件');
        }
    }

    // 【修改点 C】：接收 type 参数
    async loadArticle(filename, type) {
        try {
            let filePath;
            let extension;
            let dir;
            
            // 【修改点 D】：根据 type 确定文件路径和扩展名
            if (type === 'blog') {
                dir = 'ALL_DATA/blog'; // 目标目录
                extension = '.md';      // Markdown 格式
            } else if (type === 'poem') {
                dir = 'ALL_DATA/poetry';
                extension = '.txt';
            } else {
                dir = 'ALL_DATA/articles'; // 默认 prose
                extension = '.txt';
            }

            // reader.html 在 pages/Article/ 下，路径需要回退两级
            filePath = `../../${dir}/${filename}${extension}`;
            // 保存当前文章所在目录，用于修正 Markdown 中的相对链接（图片、相对链接等）
            this.currentDir = `../../${dir}`;
            
            console.debug('[ArticleReader] 请求文章路径:', filePath, 'type:', type);
            const response = await fetch(filePath);
            console.debug('[ArticleReader] fetch 返回状态:', response.status, response.ok);
            if (!response.ok) {
                // 打印出完整的路径，便于调试
                throw new Error(`文章文件不存在或加载失败: ${filePath}`);
            }
            
            const text = await response.text();
            let article;

            if (type === 'blog') {
                // 【关键修改】：对于博客，我们不需要解析元数据。
                // 整个文件内容就是 content，title/author 只是占位符。
                article = {
                    title: filename, 
                    author: '',
                    author_link: '',
                    type: 'blog',
                    content: text // 整个文件内容作为Markdown待解析
                };
            } else {
                // 对于文章和诗歌 (txt格式)，仍然使用原有的元数据解析逻辑
                article = this.parseArticle(text);
                article.type = type;
            }
            
            this.displayArticle(article);
            console.debug('[ArticleReader] marked available:', typeof marked !== 'undefined', 'renderMathInElement available:', typeof renderMathInElement === 'function');
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
                // 忽略文件中的 type 字段，以 URL 参数为准
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

        let html;
        if (article.type === 'blog') {
             // 针对Markdown (type: 'blog')，只渲染内容，跳过标题/作者的HTML结构
            html = `
                <section class="post-content markdown-body">
                    ${this.formatContent(article.content, article.type)}
                </section>
            `;
        } else {
            // 保持原有文章/诗歌的结构
            html = `
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
        }


        this.articleContent.innerHTML = html;
        
        // 【新增功能】：如果文件是 Markdown，则执行 KaTeX 公式渲染
        // 注意：这要求您在 reader.html 中正确引入 marked.js 和 KaTeX/auto-render.js
        if (article.type === 'blog' && typeof renderMathInElement === 'function') {
            renderMathInElement(this.articleContent, {
                // 配置 KaTeX 自动渲染的定界符，支持 $...$ 和 $$...$$
                delimiters: [
                    {left: '$$', right: '$$', display: true},  // 块级公式
                    {left: '$', right: '$', display: false},   // 行内公式
                    {left: '\\(', right: '\\)', display: false}, // MathJax 风格的行内公式
                    {left: '\\[', right: '\\]', display: true}  // MathJax 风格的块级公式
                ],
                throwOnError: false // 渲染失败时不抛出错误
            });
        }

        // 如果 KaTeX 的 auto-render 尚未加载，则尝试重试若干次（避免因 defer 加载顺序导致渲染遗漏）
        if (article.type === 'blog') {
            this._retryRenderMathInElement(this.articleContent, 5, 300);
        }
    }

    // 在 renderMathInElement 尚不可用时重试（次数、间隔以毫秒计）
    _retryRenderMathInElement(element, attempts = 5, interval = 200) {
        if (typeof renderMathInElement === 'function') {
            try {
                renderMathInElement(element, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            } catch (e) {
                console.debug('[ArticleReader] renderMathInElement 调用失败:', e.message);
            }
            return;
        }

        if (attempts <= 0) {
            console.debug('[ArticleReader] renderMathInElement 未就绪，放弃重试');
            return;
        }

        setTimeout(() => {
            this._retryRenderMathInElement(element, attempts - 1, interval);
        }, interval);
    }

    formatContent(content, type) {
        // 【关键修改 F】：新增 Markdown 解析逻辑
        if (type === 'blog') {
            // 使用 marked.js 解析 Markdown (若 marked 未加载则回退为预格式文本)
            if (typeof marked === 'undefined') {
                // 回退：对特殊字符做转义并保持换行
                const escaped = content
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                return `<pre class="markdown-fallback">${escaped}</pre>`;
            }

            // 解析为 HTML
            // 先将数学公式（$$...$$ 和 $...$）提取为占位符，避免 marked 更改或转义 $ 符号
            const mathMap = [];
            let placeholderIndex = 0;

            // 处理块级公式 $$...$$（支持跨行）
            content = content.replace(/\$\$([\s\S]+?)\$\$/g, (m) => {
                const key = `@@MATH${placeholderIndex}@@`;
                mathMap.push(m); // 保存包含分隔符的原始文本
                placeholderIndex++;
                return key;
            });

            // 处理行内公式 $...$（不跨行）
            content = content.replace(/\$([^\n\$]+?)\$/g, (m) => {
                const key = `@@MATH${placeholderIndex}@@`;
                mathMap.push(m);
                placeholderIndex++;
                return key;
            });

            const rendered = marked.parse(content);

            // 将占位符还原为原始的数学文本（带 $ 定界符），以便 KaTeX auto-render 能识别
            let restored = rendered;
            mathMap.forEach((orig, idx) => {
                const key = `@@MATH${idx}@@`;
                // 全文替换所有占位符
                restored = restored.split(key).join(orig);
            });


            // 修正相对资源链接（如图片和相对超链接），使其基于文章文件所在目录解析
            try {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = restored;

                // 处理图片
                const imgs = wrapper.querySelectorAll('img');
                imgs.forEach(img => {
                    const src = img.getAttribute('src');
                    if (src && !/^(https?:|\/|data:)/i.test(src)) {
                        img.src = `${this.currentDir}/${src}`;
                    }
                });

                // 处理锚点链接（相对链接）
                const anchors = wrapper.querySelectorAll('a');
                anchors.forEach(a => {
                    const href = a.getAttribute('href');
                    if (href && !/^(https?:|\/|#|mailto:|tel:)/i.test(href)) {
                        a.href = `${this.currentDir}/${href}`;
                    }
                });

                return wrapper.innerHTML;
            } catch (e) {
                // 任何处理失败则回退到直接输出解析结果
                    return rendered;
            }
        }

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