// 菜单切换逻辑
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});



// 获取标题元素
const mainTitle = document.getElementById('main-title');

// 定义变量存储原始标题和当前状态
let originalTitle = mainTitle.textContent; // 获取初始标题内容
let isTimeMode = false; // 用于标记是否显示时间

// 添加点击事件监听
mainTitle.addEventListener('click', () => {
    if (!isTimeMode) {
        // 如果当前不是时间模式，显示当前时间
        mainTitle.textContent = new Date().toLocaleString(); // 显示本地时间
        isTimeMode = true; // 切换到时间模式
    } else {
        // 如果当前是时间模式，恢复原始标题
        mainTitle.textContent = originalTitle;
        isTimeMode = false; // 切换回标题模式
    }
});