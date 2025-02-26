//移动端汉堡菜单
// 汉堡菜单切换逻辑
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

// 汉堡菜单点击事件
burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 导航链接点击事件
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active'); // 点击链接后关闭菜单
        }
    });
});

// 点击页面其他位置关闭汉堡菜单
document.addEventListener('click', (event) => {
    // 检查点击是否发生在汉堡菜单或导航链接之外
    if (!burger.contains(event.target) && !navLinks.contains(event.target)) {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active'); // 关闭菜单
        }
    }
});


    // 标题时间切换功能
    const mainTitle = document.getElementById('main-title');

    // 检查mainTitle是否存在
    if (mainTitle) {
        let originalTitle = mainTitle.textContent; // 获取初始标题内容
        let isTimeMode = false; // 用于标记是否显示时间

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
    }







