import { useState, useEffect } from 'preact/hooks';
import { Link, usePage } from '../../resources/js/bir-inertia';

export function Navbar({ version }: { version?: string }) {
  const [dark, setDark] = useState(true);
  const page = usePage();
  const currentUrl = page?.url || '/';

  useEffect(() => {
    const saved = localStorage.getItem('bir-theme');
    const isDark = saved ? saved === 'dark' : true;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('bir-theme', next ? 'dark' : 'light');
  };

  const navLinkClass = (active: boolean) =>
    `transition text-xs font-medium ${
      active
        ? 'text-zinc-950 dark:text-white'
        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-[#07080A]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-7 h-7 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-xs tracking-tighter shadow-xs">
              B
            </span>
            <span className="text-lg font-extrabold tracking-tight text-zinc-950 dark:text-white">
              Bir<span className="text-emerald-500">JS</span>
            </span>
            {version && (
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                v{version}
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/docs/installation" className={navLinkClass(currentUrl.startsWith('/docs') && currentUrl !== '/docs/inertia' && currentUrl !== '/docs/benchmarks')}>
              Documentation
            </Link>
            <Link href="/docs/inertia" className={navLinkClass(currentUrl === '/docs/inertia')}>
              Inertia + TSX
            </Link>
            <Link href="/docs/database" className={navLinkClass(currentUrl === '/docs/database')}>
              ORM
            </Link>
            <Link href="/docs/benchmarks" className={navLinkClass(currentUrl === '/docs/benchmarks')}>
              Benchmarks
            </Link>
            <a
              href="https://github.com/ferdisahin/BirFramework"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition inline-flex items-center gap-1"
            >
              <span>GitHub</span>
              <svg className="w-3 h-3 opacity-60" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 11L11 5M11 5H6M11 5V10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            {dark ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <Link
            href="/docs/installation"
            className="px-3.5 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-[#07080A] py-12 text-xs text-zinc-500 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 text-zinc-950 dark:text-white font-bold text-sm">
            <span className="w-5 h-5 rounded bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-black text-[10px]">
              B
            </span>
            <span>BirJS</span>
          </div>
          <p className="mt-3 max-w-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Full-stack TypeScript framework combining Laravel ergonomics with Unified Preact + Inertia + SSR and sub-millisecond Node.js performance.
          </p>
        </div>

        <div>
          <div className="font-semibold text-zinc-900 dark:text-zinc-200 mb-3">Documentation</div>
          <ul className="space-y-2">
            <li><Link href="/docs/overview" className="hover:text-zinc-950 dark:hover:text-white transition">Overview</Link></li>
            <li><Link href="/docs/installation" className="hover:text-zinc-950 dark:hover:text-white transition">Installation</Link></li>
            <li><Link href="/docs/inertia" className="hover:text-zinc-950 dark:hover:text-white transition">Inertia + TSX</Link></li>
            <li><Link href="/docs/database" className="hover:text-zinc-950 dark:hover:text-white transition">Database & ORM</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-semibold text-zinc-900 dark:text-zinc-200 mb-3">Resources</div>
          <ul className="space-y-2">
            <li><Link href="/docs/benchmarks" className="hover:text-zinc-950 dark:hover:text-white transition">Benchmarks</Link></li>
            <li><Link href="/docs/cli" className="hover:text-zinc-950 dark:hover:text-white transition">CLI Reference</Link></li>
            <li>
              <a href="https://github.com/ferdisahin/BirFramework" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-950 dark:hover:text-white transition">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-zinc-200/80 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
        <span>Built with BirFramework + Preact + Inertia.</span>
        <span>MIT License</span>
      </div>
    </footer>
  );
}

export function AppLayout({ children, version }: { children?: any; version?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#07080A] text-zinc-950 dark:text-zinc-100 antialiased">
      <Navbar version={version} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
