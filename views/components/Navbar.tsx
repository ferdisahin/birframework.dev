import { useEffect, useState } from 'preact/hooks';
import { Link, usePage } from '../../resources/js/bir-inertia';

export function Navbar() {
  const page = usePage<{ version?: string }>();
  const version = page.props?.version || '';
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    document.documentElement.style.colorScheme = next ? 'dark' : 'light';
    document.documentElement.style.backgroundColor = next ? '#07080a' : '#fafafa';
    try { localStorage.setItem('bir-theme', next ? 'dark' : 'light'); } catch {}
  };

  return (
    <header class="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur border-b border-zinc-200 dark:border-zinc-900">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <Link href="/" class="flex items-center gap-2.5 font-bold tracking-tight text-zinc-900 dark:text-white hover:opacity-90 transition">
            <svg class="w-5 h-5 text-zinc-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span class="text-base tracking-tight font-semibold">BirJS</span>
            <span class="text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded-full ml-1 font-medium tabular-nums">
              v{version}
            </span>
          </Link>

          <nav class="hidden md:flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400 font-normal">
            <Link href="/docs/installation" class="hover:text-zinc-900 dark:hover:text-white transition">
              Documentation
            </Link>
            <a href="/#benchmarks" class="hover:text-zinc-900 dark:hover:text-white transition">
              Benchmarks
            </a>
            <a href="/#architecture" class="hover:text-zinc-900 dark:hover:text-white transition">
              Architecture
            </a>
          </nav>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            class="p-1.5 rounded-md text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer"
          >
            <svg class="w-4 h-4 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg class="w-4 h-4 block dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <Link href="/docs/installation" class="hidden sm:inline-flex text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-md transition items-center gap-2 font-medium">
            <span>npx birframework new</span>
            <span class="text-zinc-400 dark:text-zinc-500">&rarr;</span>
          </Link>

          <a
            href="https://github.com/ferdisahin/BirFramework"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-md transition font-medium flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
