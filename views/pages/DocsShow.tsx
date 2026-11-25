import { Head, Link } from '../../resources/js/bir-inertia';
import { DocsLayout } from '../layouts/DocsLayout';

interface DocsShowProps {
  title: string;
  slug: string;
  htmlContent: string;
  prevSlug: string;
  prevTitle: string;
  nextSlug: string;
  nextTitle: string;
}

export default function DocsShow({
  title,
  htmlContent,
  prevSlug,
  prevTitle,
  nextSlug,
  nextTitle,
}: DocsShowProps) {
  return (
    <div>
      <Head title={`${title} — BirJS Docs`} />

      <article
        class="prose-bir"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <div class="border-t border-zinc-200 dark:border-zinc-900 pt-8 mt-12 flex items-center justify-between text-xs">
        {prevSlug ? (
          <Link
            href={`/docs/${prevSlug}`}
            class="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition flex items-center gap-1.5 group font-medium"
          >
            <span class="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">&larr;</span>
            <span>{prevTitle}</span>
          </Link>
        ) : (
          <div />
        )}

        {nextSlug ? (
          <Link
            href={`/docs/${nextSlug}`}
            class="text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white font-medium transition flex items-center gap-1.5 group"
          >
            <span>{nextTitle}</span>
            <span class="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">&rarr;</span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}

DocsShow.layout = (page: any) => <DocsLayout>{page}</DocsLayout>;
