import { createContext, h, render, hydrate } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';

export interface PageData<T = Record<string, any>> {
  component: string;
  props: T;
  url: string;
}

const PageContext = createContext<PageData>({ component: '', props: {}, url: '/' });

export function usePage<T = Record<string, any>>(): PageData<T> {
  return useContext(PageContext) as PageData<T>;
}

export interface VisitOptions {
  method?: string;
  data?: any;
  replace?: boolean;
  preserveScroll?: boolean;
  preserveState?: boolean;
}

type RouterEvent = 'start' | 'finish';
const routerListeners: Record<RouterEvent, Set<() => void>> = {
  start: new Set(),
  finish: new Set(),
};

function emitRouterEvent(event: RouterEvent) {
  for (const cb of routerListeners[event]) cb();
}

let activeVisit: ((url: string, options?: VisitOptions) => Promise<void>) | null = null;

export const router = {
  visit(url: string, options?: VisitOptions) {
    if (activeVisit) return activeVisit(url, options);
    window.location.href = url;
    return Promise.resolve();
  },
  get(url: string, options?: Omit<VisitOptions, 'method'>) {
    return this.visit(url, { ...options, method: 'GET' });
  },
  post(url: string, data?: any, options?: Omit<VisitOptions, 'method' | 'data'>) {
    return this.visit(url, { ...options, method: 'POST', data });
  },
  put(url: string, data?: any, options?: Omit<VisitOptions, 'method' | 'data'>) {
    return this.visit(url, { ...options, method: 'PUT', data });
  },
  patch(url: string, data?: any, options?: Omit<VisitOptions, 'method' | 'data'>) {
    return this.visit(url, { ...options, method: 'PATCH', data });
  },
  delete(url: string, options?: Omit<VisitOptions, 'method'>) {
    return this.visit(url, { ...options, method: 'DELETE' });
  },
  on(event: RouterEvent, cb: () => void) {
    routerListeners[event].add(cb);
    return () => {
      routerListeners[event].delete(cb);
    };
  },
};

export function useNavigation() {
  const [navigating, setNavigating] = useState(false);
  useEffect(() => {
    const offStart = router.on('start', () => setNavigating(true));
    const offFinish = router.on('finish', () => setNavigating(false));
    return () => {
      offStart();
      offFinish();
    };
  }, []);
  return { navigating };
}

function upsertHeadMeta(attr: 'name' | 'property', key: string, content?: string) {
  if (typeof document === 'undefined' || !content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function Head({
  title,
  description,
  canonical,
}: {
  title?: string;
  description?: string;
  canonical?: string;
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (title) {
      document.title = title;
      upsertHeadMeta('property', 'og:title', title);
    }
    if (description) {
      upsertHeadMeta('name', 'description', description);
      upsertHeadMeta('property', 'og:description', description);
    }
    if (canonical) {
      let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonical);
    }
  }, [title, description, canonical]);
  return null;
}

export function Link({
  href,
  method,
  data,
  replace,
  preserveScroll,
  preserveState,
  className,
  onClick: userOnClick,
  children,
  ...rest
}: any) {
  const handleClick = (e: MouseEvent) => {
    userOnClick?.(e);
    if (e.defaultPrevented) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    router.visit(href, { method, data, replace, preserveScroll, preserveState });
  };
  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}

function scrollToFragment(hash: string): boolean {
  if (!hash) return false;
  let name: string;
  try {
    name = decodeURIComponent(hash.slice(1));
  } catch {
    return false;
  }
  const element = document.getElementById(name);
  if (!element) return false;
  element.scrollIntoView({ block: 'start', behavior: 'smooth' });
  return true;
}

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [data, setDataState] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [processing, setProcessing] = useState(false);
  const [wasSuccessful, setWasSuccessful] = useState(false);

  const setData = (keyOrUpdater: keyof T | Partial<T> | ((prev: T) => T), value?: any) => {
    if (typeof keyOrUpdater === 'function') {
      setDataState(keyOrUpdater);
    } else if (typeof keyOrUpdater === 'object' && keyOrUpdater !== null) {
      setDataState((prev) => ({ ...prev, ...keyOrUpdater }));
    } else {
      setDataState((prev) => ({ ...prev, [keyOrUpdater]: value }));
    }
  };

  const reset = (...fields: (keyof T)[]) => {
    if (fields.length === 0) {
      setDataState(initialValues);
      return;
    }
    setDataState((prev) => {
      const next = { ...prev };
      for (const f of fields) next[f] = initialValues[f];
      return next;
    });
  };

  const submit = async (
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    options?: {
      preserveScroll?: boolean;
      preserveState?: boolean;
      onSuccess?: () => void;
      onError?: (errs: any) => void;
    }
  ) => {
    setProcessing(true);
    setWasSuccessful(false);
    setErrors({});
    try {
      await router.visit(url, {
        method,
        data,
        preserveScroll: options?.preserveScroll,
        preserveState: options?.preserveState,
      });
      setWasSuccessful(true);
      options?.onSuccess?.();
    } catch (err: any) {
      const fieldErrors = err?.errors || {};
      setErrors(fieldErrors);
      options?.onError?.(fieldErrors);
    } finally {
      setProcessing(false);
    }
  };

  return {
    data,
    setData,
    errors,
    processing,
    wasSuccessful,
    reset,
    post: (url: string, opts?: any) => submit('POST', url, opts),
    put: (url: string, opts?: any) => submit('PUT', url, opts),
    patch: (url: string, opts?: any) => submit('PATCH', url, opts),
    delete: (url: string, opts?: any) => submit('DELETE', url, opts),
  };
}

export async function createBirApp({
  resolve,
}: {
  resolve: (name: string) => Promise<any>;
}) {
  const el = document.getElementById('app');
  if (!el) return;

  const rawPage = el.getAttribute('data-page');
  if (!rawPage) return;

  const initialPage: PageData = JSON.parse(rawPage);
  const initialMod = await resolve(initialPage.component);
  const InitialComponent = initialMod.default;

  function AppShell() {
    const [page, setPage] = useState<PageData>(initialPage);
    const currentPage = useRef(initialPage);
    const [Component, setComponent] = useState<any>(() => InitialComponent);
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
      activeVisit = async (url: string, options: VisitOptions = {}) => {
        setNavigating(true);
        emitRouterEvent('start');
        try {
          const method = (options.method || 'GET').toUpperCase();
          const headers: Record<string, string> = {
            'X-Bir-Inertia': 'true',
            Accept: 'application/json',
          };
          const init: RequestInit = { method, headers };
          if (options.data !== undefined && method !== 'GET') {
            const hasFile =
              typeof FormData !== 'undefined' &&
              (options.data instanceof FormData ||
                (typeof options.data === 'object' &&
                  Object.values(options.data).some((v) => v instanceof File || v instanceof Blob)));

            if (hasFile) {
              const fd = options.data instanceof FormData ? options.data : new FormData();
              if (!(options.data instanceof FormData)) {
                for (const [k, v] of Object.entries(options.data)) {
                  if (v !== undefined && v !== null) fd.append(k, v as any);
                }
              }
              init.body = fd;
            } else {
              headers['Content-Type'] = 'application/json';
              init.body = JSON.stringify(options.data);
            }
          }

          const res = await fetch(url, init);
          if (res.status === 422) {
            const errPayload = await res.json().catch(() => ({}));
            throw errPayload;
          }
          if (res.status === 409) {
            const redirectLoc = res.headers.get('X-Bir-Inertia-Location');
            if (redirectLoc) window.location.href = redirectLoc;
            return;
          }
          if (!res.ok) {
            window.location.href = url;
            return;
          }

          const nextPage: PageData = await res.json();
          const mod = await resolve(nextPage.component);
          currentPage.current = nextPage;
          setComponent(() => mod.default);
          setPage(nextPage);

          const hash = new URL(url, window.location.href).hash;
          const destination = new URL(nextPage.url, window.location.href);
          if (hash) destination.hash = hash;
          if (options.replace) {
            window.history.replaceState(nextPage, '', destination.href);
          } else {
            window.history.pushState(nextPage, '', destination.href);
          }
          if (!options.preserveScroll) {
            if (hash) {
              requestAnimationFrame(() => {
                if (!scrollToFragment(hash)) window.scrollTo({ top: 0 });
              });
            } else {
              window.scrollTo({ top: 0 });
            }
          }
        } finally {
          setNavigating(false);
          emitRouterEvent('finish');
        }
      };

      const onPopState = async (event: PopStateEvent) => {
        const current = new URL(currentPage.current.url, window.location.href);
        const samePage = current.pathname === window.location.pathname && current.search === window.location.search;
        if (samePage && !event.state?.component) {
          window.history.replaceState(currentPage.current, '');
          if (window.location.hash) scrollToFragment(window.location.hash);
          return;
        }
        if (event.state?.component) {
          const mod = await resolve(event.state.component);
          currentPage.current = event.state;
          setComponent(() => mod.default);
          setPage(event.state);
          if (window.location.hash) requestAnimationFrame(() => scrollToFragment(window.location.hash));
        } else {
          await activeVisit?.(window.location.href, { replace: true });
        }
      };

      // Keep the browser URL: the server never receives its fragment.
      window.history.replaceState(initialPage, '');
      if (window.location.hash) requestAnimationFrame(() => scrollToFragment(window.location.hash));
      const onInternalLink = (event: MouseEvent) => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
        if (!(anchor instanceof HTMLAnchorElement) || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self') || anchor.hasAttribute('data-native')) return;
        const destination = new URL(anchor.href);
        if (destination.origin !== window.location.origin || destination.pathname.startsWith('/api/')) return;
        const samePage = destination.pathname === window.location.pathname && destination.search === window.location.search;
        if (samePage && destination.hash) {
          if (!scrollToFragment(destination.hash)) return;
          event.preventDefault();
          if (window.location.hash !== destination.hash) window.history.pushState(currentPage.current, '', destination.href);
          return;
        }
        event.preventDefault();
        void activeVisit?.(destination.href);
      };
      document.addEventListener('click', onInternalLink);
      window.addEventListener('popstate', onPopState);
      return () => {
        window.removeEventListener('popstate', onPopState);
        document.removeEventListener('click', onInternalLink);
      };
    }, []);

    const pageElement = h(Component, page.props);
    const rendered =
      typeof Component?.layout === 'function'
        ? Component.layout(pageElement, page.props)
        : Array.isArray(Component?.layout)
          ? Component.layout.reduceRight((acc: any, Layout: any) => h(Layout, page.props, acc), pageElement)
          : pageElement;

    return (
      <PageContext.Provider value={page}>
        {rendered}
        {navigating && (
          <div
            id="bir-progress-bar"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: '#71717a',
              zIndex: 9999,
            }}
          />
        )}
      </PageContext.Provider>
    );
  }

  if (el.innerHTML.trim().length > 0) {
    hydrate(<AppShell />, el);
  } else {
    render(<AppShell />, el);
  }
}
