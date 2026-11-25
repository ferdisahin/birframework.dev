import { useState, useMemo } from 'preact/hooks';
import { Link, usePage } from '../../resources/js/bir-inertia';
import { Navbar, Footer } from './AppLayout';

interface DocItem {
  slug: string;
  title: string;
  category: string;
}

export function DocsLayout({ children }: { children?: any }) {
  const page = usePage<{ slug?: string; pages?: DocItem[] }>();
  const [filter, setFilter] = useState('');

  const currentSlug = page.props?.slug || '';
  const allPages = page.props?.pages || [];

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
    <div class="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-950 dark:text-zinc-100 antialiased">
      <Navbar />

      <div class="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col md:flex-row gap-10">
        {/* Persistent Sidebar — never unmounts or resets scroll across doc pages */}
        <aside class="w-full md:w-64 shrink-0 md:sticky md:top-16 md:h-[calc(100vh-4rem)] overflow-y-auto py-8 pr-4 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-900">
          <div class="mb-6">
            <input
              type="text"
              value={filter}
              onInput={(e) => setFilter((e.target as HTMLInputElement).value)}
              placeholder="Filter documentation..."
              class="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:border-emerald-500 px-3 py-1.5 rounded-md text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none transition"
            />
          </div>

          <nav class="space-y-6 text-xs">
            {grouped.map(([category, items]) => (
              <div key={category}>
                <h2 class="font-semibold text-zinc-500 dark:text-zinc-400 mb-2 uppercase tracking-wider text-[11px]">
                  {category}
                </h2>
                <ul class="space-y-1">
                  {items.map((item) => {
                    const active = item.slug === currentSlug;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={`/docs/${item.slug}`}
                          class={`block py-1.5 px-2.5 rounded transition ${
                            active
                              ? 'bg-zinc-100 dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold border-l-2 border-emerald-500'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
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
