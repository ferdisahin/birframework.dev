import * as Turbo from '@hotwired/turbo';

// 1. Sidebar Active Link Highlighter for Docs
function updateActiveDocLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/docs/installation';
  const links = document.querySelectorAll('#docs-nav a');
  links.forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '');
    if (href === currentPath || (currentPath === '/docs' && href === '/docs/installation')) {
      a.classList.add('bg-zinc-100', 'text-zinc-900', 'dark:bg-zinc-900', 'dark:text-white', 'font-medium', 'border-l-2', 'border-emerald-500', 'dark:border-emerald-400', 'pl-2.5');
      a.classList.remove('text-zinc-600', 'dark:text-zinc-400');
    } else {
      a.classList.remove('bg-zinc-100', 'text-zinc-900', 'dark:bg-zinc-900', 'dark:text-white', 'font-medium', 'border-l-2', 'border-emerald-500', 'dark:border-emerald-400', 'pl-2.5');
      a.classList.add('text-zinc-600', 'dark:text-zinc-400');
    }
  });
}

// Turbo navigation lifecycle
document.addEventListener('turbo:load', () => {
  updateActiveDocLink();
});

document.addEventListener('turbo:render', () => {
  updateActiveDocLink();
});

window.addEventListener('popstate', () => {
  updateActiveDocLink();
});

// 2. Click Handlers (Copy Button, Theme Toggle, Hash Smooth Scroll)
document.addEventListener('click', (e) => {
  // Copy Button
  const copyBtn = e.target.closest('[data-copy]');
  if (copyBtn) {
    const selector = copyBtn.getAttribute('data-copy');
    const target = document.querySelector(selector);
    if (target) {
      navigator.clipboard.writeText(target.innerText.trim());
      const original = copyBtn.innerHTML;
      copyBtn.innerHTML = '<span class="text-emerald-500 dark:text-emerald-400 font-medium text-[11px]">Copied</span>';
      setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
    }
  }

  // Theme Toggle
  const themeBtn = e.target.closest('#theme-toggle');
  if (themeBtn) {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bir-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bir-theme', 'dark');
    }
  }

  // Smooth scroll for same-page anchor links e.g. /#benchmarks
  const anchor = e.target.closest('a');
  if (anchor) {
    const href = anchor.getAttribute('href') || '';
    if (href.startsWith('#') || (href.startsWith('/#') && (window.location.pathname === '/' || window.location.pathname === ''))) {
      const hash = href.startsWith('/#') ? href.slice(1) : href;
      try {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          e.preventDefault();
          window.history.pushState(null, '', href);
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      } catch {}
    }
  }
});

// 3. Documentation Search Filter
document.addEventListener('input', (e) => {
  if (e.target.id !== 'docs-filter') return;
  const q = e.target.value.toLowerCase().trim();
  const items = document.querySelectorAll('#docs-nav li');
  items.forEach(li => {
    const text = li.innerText.toLowerCase();
    li.style.display = text.includes(q) ? '' : 'none';
  });
});
