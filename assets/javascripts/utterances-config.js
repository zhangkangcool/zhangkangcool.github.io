// utterances-config.js — 在文章底部插入 Utterances 评论窗
// 使用前请确保你已在 GitHub 上为目标仓库创建 issues 并启用了 utterances
// 默认配置使用你的仓库 owner/repo：zhangkangcool/zhangkangcool.github.io

(function () {
  function insertUtterances() {
    // 只在文章页面插入（存在 .md-content__inner 表示文章页面）
    var content = document.querySelector('.md-content__inner');
    if (!content) return;

    // 如果已经插入则跳过
    if (document.getElementById('utterances-thread')) return;

    // 创建容器并插入到页面底部（在内容末尾）
    var container = document.createElement('div');
    container.id = 'utterances-thread';
    container.style.marginTop = '2rem';
    container.style.marginBottom = '2rem';
    content.appendChild(container);

    var script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.setAttribute('repo', 'zhangkangcool/zhangkangcool.github.io');
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'github-dark' : 'github-light');
    script.setAttribute('crossorigin', 'anonymous');
    container.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertUtterances);
  } else {
    insertUtterances();
  }

  // SPA 导航支持：监听 popstate
  window.addEventListener('popstate', function () { setTimeout(insertUtterances, 120); });
})();
