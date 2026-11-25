import { useState, useEffect } from 'preact/hooks';
import { Link } from '../../resources/js/bir-inertia';

export function Navbar({ version }: { version?: string }) {
  const [dark, setDark] = useState(true);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">
              Bir<span className="text-emerald-500">JS</span>
            </span>
            {version && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                v{version}
              </span>
            )}
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <Link href="/docs/installation" className="hover:text-zinc-950 dark:hover:text-white transition">
              Docs
            </Link>
            <Link href="/docs/inertia" className="hover:text-zinc-950 dark:hover:text-white transition">
              Inertia + TSX
            </Link>
            <Link href="/docs/benchmarks" className="hover:text-zinc-950 dark:hover:text-white transition">
              Benchmarks
            </Link>
            <a
              href="https://github.com/ferdisahin/BirFramework"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-950 dark:hover:text-white transition"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
          <Link
            href="/docs/installation"
            className="px-3.5 py-1.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-xs font-semibold hover:opacity-90 transition"
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
    <footer className="border-t border-zinc-200 dark:border-zinc-900 py-10 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <strong className="text-zinc-900 dark:text-zinc-200">BirJS</strong> — Full-stack TypeScript framework with Unified Preact + Inertia + SSR.
        </div>
        <div className="flex items-center gap-5">
          <Link href="/docs/overview" className="hover:text-zinc-900 dark:hover:text-white">Overview</Link>
          <Link href="/docs/installation" className="hover:text-zinc-900 dark:hover:text-white">Docs</Link>
          <a href="https://github.com/ferdisahin/BirFramework" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children, version }: { children?: any; version?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-950 dark:text-zinc-100 antialiased">
      <Navbar version={version} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
