# 文章管理系统使用说明

## 添加新文章

1. 在 `ALL_DATA/articles/` 目录下创建新的 `.txt` 文件（散文/小说）
2. 在 `ALL_DATA/poetry/` 目录下创建新的 `.txt` 文件（诗歌）
3. 文件命名：使用英文或拼音，如 `my_article.txt`
3. 文件格式：

```
title:文章标题
author:作者名
author_link:作者链接（可选）
type:prose
content:
文章内容从这里开始...

可以有多行内容。
```

## 文章类型

- `type:prose` - 散文/小说（默认）
- `type:poem` - 诗歌（居中显示，无首行缩进）

## 示例

### 散文示例
```
title:我的文章
author:张三
author_link:https://example.com
type:prose
content:
这是第一段内容。

这是第二段内容。
```

### 诗歌示例
```
title:静夜思
author:李白
type:poem
content:
床前明月光，
疑是地上霜。
举头望明月，
低头思故乡。
```

## 更新文章列表

添加新文章后，需要在 `js/article-list.js` 文件的 `getArticlesList()` 函数中添加新文章信息：

```javascript
{
    filename: 'my_article', // 文件名（不含.txt）
    title: '我的文章',
    author: '张三',
    description: '文章简介...'
}
```

## 访问文章

文章访问地址：`pages/Article/reader.html?article=文件名`

例如：`pages/Article/reader.html?article=mujiewen` 