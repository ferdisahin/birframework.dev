import { useState, useMemo, useRef, useLayoutEffect } from 'preact/hooks';
import { Link, usePage } from '../../resources/js/bir-inertia';
import { Navbar, Footer } from './AppLayout';

interface DocItem {
  slug: string;
  title: string;
  category: string;
}

let savedSidebarScrollTop = 0;

export function DocsLayout({ children }: { children?: any }) {
  const page = usePage<{ slug?: string; pages?: DocItem[]; title?: string }>();
  const [filter, setFilter] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const asideRef = useRef<HTMLElement>(null);

  const currentSlug = page.props?.slug || '';
  const allPages = page.props?.pages || [];

  useLayoutEffect(() => {
    const el = asideRef.current;
    if (!el) return;
    if (savedSidebarScrollTop > 0 && el.scrollTop !== savedSidebarScrollTop) {
      el.scrollTop = savedSidebarScrollTop;
    }
  }, [currentSlug]);

  const grouped = useMemo(() => {
    const q = filter.trim().toLowerCase();
    const filtered = q
      ? allPages.filter((p) => p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
      : allPages;

    const map = new Map<string, DocItem[]>();
    for (const item of filtered) {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category)!.push(item);
    }
    return Array.from(map.entries());
  }, [allPages, filter]);

  return (
    <div class="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#07080A] text-zinc-950 dark:text-zinc-100 antialiased">
      <Navbar />

      <div class="md:hidden border-b border-zinc-200 dark:border-zinc-800/80 px-6 py-3 flex items-center justify-between bg-white dark:bg-[#0B0D11]">
        <span class="text-xs font-medium text-zinc-600 dark:text-zinc-400">
          {page.props?.title || 'Documentation'}
        </span>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          class="text-xs font-semibold px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
        >
          {mobileOpen ? 'Close Menu' : 'Menu'}
        </button>
      </div>

      <div class="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col md:flex-row gap-10">
        {/* Persistent Sidebar — preserves scroll position across doc pages */}
        <aside
          ref={asideRef}
          onScroll={(e) => {
            savedSidebarScrollTop = (e.currentTarget as HTMLElement).scrollTop;
          }}
          class={`${mobileOpen ? 'block' : 'hidden'} md:block w-full md:w-64 shrink-0 md:self-start md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-4 border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-zinc-800/80`}
        >
          <div class="mb-6">
            <input
              type="text"
              value={filter}
              onInput={(e) => setFilter((e.target as HTMLInputElement).value)}
              placeholder="Filter docs..."
              class="w-full bg-white dark:bg-[#0E1116] border border-zinc-200 dark:border-zinc-800 focus:border-zinc-500 dark:focus:border-zinc-500 px-3 py-2 rounded-lg text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition"
            />
          </div>

          <nav class="space-y-6 text-xs">
            {grouped.map(([category, items]) => (
              <div key={category}>
                <h2 class="font-semibold text-zinc-500 dark:text-zinc-400 mb-2 tracking-wide text-[11px]">
                  {category}
                </h2>
                <ul class="space-y-0.5">
                  {items.map((item) => {
                    const active = item.slug === currentSlug;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/docs/${item.slug}`}
                          onClick={() => setMobileOpen(false)}
                          class={`block py-1.5 px-2.5 rounded-md transition ${
                            active
                              ? 'bg-zinc-200/70 dark:bg-zinc-800/80 text-zinc-950 dark:text-white font-semibold border-l-2 border-zinc-950 dark:border-white'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/70 hover:text-zinc-950 dark:hover:text-white'
                          }`}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        <main class="flex-1 min-w-0 py-8 md:py-10">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
