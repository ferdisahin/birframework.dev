// Runs before styles and hydration so the first paint uses the saved theme.
const themeHead = `<script>(function(){var theme='dark';try{if(localStorage.getItem('bir-theme')==='light')theme='light';}catch(e){}var root=document.documentElement;root.classList.toggle('dark',theme==='dark');root.style.colorScheme=theme;root.style.backgroundColor=theme==='dark'?'#07080a':'#fafafa';})();</script><style>html{background:#fafafa;color-scheme:light}html.dark{background:#07080a;color-scheme:dark}body{margin:0;background:inherit}</style>`;

export async function theme(ctx, next) {
  const html = ctx.html.bind(ctx);
  ctx.html = (content, status) => {
    if (typeof content === 'string' && /<head>/i.test(content)) {
      content = content.replace(/<html(\s[^>]*)?>/i, (tag) => {
        if (/\bclass=/.test(tag)) return tag;
        return tag.replace(/>$/, ' class="dark">');
      }).replace(/<head>/i, '<head>' + themeHead);
    }
    return html(content, status);
  };
  await next();
}
