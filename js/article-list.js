// 文章列表生成器
class ArticleListGenerator {
    constructor() {
        this.proseListContainer = document.querySelector('.prose-list');
        this.poemListContainer = document.querySelector('.poem-list');
        this.blogListContainer = document.querySelector('.blog-list');
        this.init();
    }

    async init() {
        if (this.proseListContainer && this.poemListContainer && this.blogListContainer) {
            await this.loadArticleList();
        }
    }

    async loadArticleList() {
        try {
            const articlesList = await this.getArticlesList();
            // 分组
            const proseArticles = articlesList.filter(a => a.type !== 'poem'&& a.type !== 'blog');
            const poemArticles = articlesList.filter(a => a.type === 'poem');
            const blogArticles = articlesList.filter(a => a.type === 'blog');
            this.displayArticles(proseArticles, this.proseListContainer);
            this.displayArticles(poemArticles, this.poemListContainer);
            this.displayArticles(blogArticles, this.blogListContainer);
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
            },
            {
                filename: 'WangXiZhi_LanTinJiXu',
                title: '兰亭集序',
                author: '王羲之',
                description: '况修短随化，终期于尽。',
                type: 'poem'
            },
            {
                filename: 'LSTM',
                title: 'LSTM',
                author: 'Tzerogo',
                description: 'Long Short-Term Memory，长短期记忆网络',
                type: 'blog'
            },
            {
                filename: 'SP',
                title: '随机过程',
                author: 'Tzerogo',
                description: '一族无穷多个、相互有关的随机变量，就是随机过程。',
                type: 'blog'
            }
        ];
    }

    displayArticles(articles, container) {
        const html = articles.map(article => `
            <div class="article-item">
                <h3><a href="pages/Article/reader.html?article=${article.filename}&type=${article.type}">${article.title}</a></h3>
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
                title: '加载失败',
                author: '堂吉诃德',
                description: '哈基米',
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