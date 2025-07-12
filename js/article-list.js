// 文章列表生成器
class ArticleListGenerator {
    constructor() {
        this.proseListContainer = document.querySelector('.prose-list');
        this.poemListContainer = document.querySelector('.poem-list');
        this.init();
    }

    async init() {
        if (this.proseListContainer && this.poemListContainer) {
            await this.loadArticleList();
        }
    }

    async loadArticleList() {
        try {
            const articlesList = await this.getArticlesList();
            // 分组
            const proseArticles = articlesList.filter(a => a.type !== 'poem');
            const poemArticles = articlesList.filter(a => a.type === 'poem');
            this.displayArticles(proseArticles, this.proseListContainer);
            this.displayArticles(poemArticles, this.poemListContainer);
        } catch (error) {
            this.showDefaultArticles();
        }
    }

    async getArticlesList() {
        // 手动维护的文章列表，你可以在这里添加新文章
        return [
            {
                filename: 'mujiewen',
                title: '墓碣文',
                author: '鲁迅',
                description: '我梦见自己正和墓碣对立，读着上面的刻辞……',
                type: 'prose'
            },
            {
                filename: 'yixiangren',
                title: '异乡人',
                author: 'H.P.lovecraft',
                description: '那一夜，男爵又做了悲哀的梦，那真是个漫长的恶梦……',
                type: 'prose'
            },
            {
                filename: 'LiHe_KuZhouDuan',
                title: '苦昼短',
                author: '李贺',
                description: '飞光飞光，劝尔一杯酒。吾不识青天高，黄地厚。',
                type: 'poem'
            }
        ];
    }

    displayArticles(articles, container) {
        const html = articles.map(article => `
            <div class="article-item">
                <h3><a href="pages/Article/reader.html?article=${article.filename}">${article.title}</a></h3>
                <p>作者：${article.author}</p>
                <p>简介：${article.description}</p>
            </div>
        `).join('');
        container.innerHTML = html;
    }

    showDefaultArticles() {
        // 如果加载失败，显示默认文章列表
        const defaultArticles = [
            {
                filename: 'mujiewen',
                title: '墓碣文',
                author: '鲁迅',
                description: '我梦见自己正和墓碣对立，读着上面的刻辞……',
                type: 'prose'
            },
            
        ];
        const proseArticles = defaultArticles.filter(a => a.type !== 'poem');
        const poemArticles = defaultArticles.filter(a => a.type === 'poem');
        this.displayArticles(proseArticles, this.proseListContainer);
        this.displayArticles(poemArticles, this.poemListContainer);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ArticleListGenerator();
}); 