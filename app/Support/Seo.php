<?php

namespace App\Support;

use App\Models\Article;
use App\Models\CaseStudy;
use App\Models\Service;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class Seo
{
    private const SITE_NAME = 'Mohi';
    private const DEFAULT_DESCRIPTION = 'Backend-focused Full-Stack Engineer with 3+ years delivering production systems across fintech, blockchain, and AI-integrated platforms.';

    public static function page(?Request $request = null): array
    {
        $request ??= request();
        $locale = self::locale($request);
        $path = trim($request->path(), '/');
        $canonicalPath = self::canonicalPath($path);
        $canonical = self::url($canonicalPath, $locale === 'de' ? ['lang' => 'de'] : []);
        $plainTitle = self::plainTitle($request, $locale);
        $description = self::description($request, $locale);
        $image = self::image($request);
        $robots = self::robots($request);

        return [
            'siteName' => self::SITE_NAME,
            'title' => self::formatTitle($plainTitle),
            'plainTitle' => $plainTitle,
            'description' => $description,
            'canonical' => $canonical,
            'alternates' => [
                'en' => self::url($canonicalPath),
                'de' => self::url($canonicalPath, ['lang' => 'de']),
                'x-default' => self::url($canonicalPath),
            ],
            'robots' => $robots,
            'locale' => $locale,
            'ogLocale' => $locale === 'de' ? 'de_DE' : 'en_US',
            'type' => $request->routeIs('articles.public.show') ? 'article' : 'website',
            'image' => $image,
            'imageAlt' => $plainTitle,
            'schema' => self::schema($request, $plainTitle, $description, $canonical, $image, $locale),
        ];
    }

    public static function sitemapUrls(): Collection
    {
        $urls = collect([
            self::sitemapEntry('/', 'daily', '1.0'),
            self::sitemapEntry('/services', 'weekly', '0.9'),
            self::sitemapEntry('/projects', 'weekly', '0.8'),
            self::sitemapEntry('/case-studies', 'weekly', '0.8'),
            self::sitemapEntry('/articles', 'weekly', '0.8'),
            self::sitemapEntry('/recommendations', 'monthly', '0.7'),
            self::sitemapEntry('/taskmanager', 'monthly', '0.5'),
            self::sitemapEntry('/books', 'monthly', '0.5'),
            self::sitemapEntry('/jobs', 'monthly', '0.5'),
            self::sitemapEntry('/listing', 'monthly', '0.5'),
        ]);

        Service::published()->ordered()->get()->each(function (Service $service) use ($urls) {
            $urls->push(self::sitemapEntry("/services/{$service->slug}", 'monthly', '0.8', $service->updated_at));
        });

        CaseStudy::published()->ordered()->get()->each(function (CaseStudy $caseStudy) use ($urls) {
            $urls->push(self::sitemapEntry("/case-studies/{$caseStudy->slug}", 'monthly', '0.8', $caseStudy->updated_at));
        });

        Article::published()->ordered()->get()->each(function (Article $article) use ($urls) {
            $urls->push(self::sitemapEntry("/articles/{$article->slug}", 'weekly', '0.8', $article->updated_at));
        });

        return $urls;
    }

    public static function sitemapXml(): string
    {
        $items = self::sitemapUrls()
            ->map(function (array $entry) {
                $lastmod = $entry['lastmod'] ? "\n    <lastmod>{$entry['lastmod']}</lastmod>" : '';

                return "  <url>\n"
                    .'    <loc>'.self::escape($entry['loc'])."</loc>{$lastmod}\n"
                    .'    <changefreq>'.self::escape($entry['changefreq'])."</changefreq>\n"
                    .'    <priority>'.self::escape($entry['priority'])."</priority>\n"
                    .'  </url>';
            })
            ->implode("\n");

        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            ."<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
            .$items."\n"
            .'</urlset>';
    }

    private static function sitemapEntry(string $path, string $changefreq, string $priority, mixed $lastmod = null): array
    {
        return [
            'loc' => self::url($path),
            'changefreq' => $changefreq,
            'priority' => $priority,
            'lastmod' => $lastmod ? $lastmod->toDateString() : null,
        ];
    }

    private static function plainTitle(Request $request, string $locale): string
    {
        $article = self::routeModel($request, 'article');
        if ($article instanceof Article) {
            return self::localized($article, 'title', $locale).' - '.($locale === 'de' ? 'Artikel' : 'Article');
        }

        $caseStudy = self::routeModel($request, 'caseStudy');
        if ($caseStudy instanceof CaseStudy) {
            return self::localized($caseStudy, 'title', $locale).' - '.($locale === 'de' ? 'Fallstudie' : 'Case Study');
        }

        $service = self::routeModel($request, 'service');
        if ($service instanceof Service) {
            return self::localized($service, 'name', $locale).' - '.($locale === 'de' ? 'Services' : 'Services');
        }

        return match (trim($request->path(), '/')) {
            '' => 'Back-End / Full-Stack Engineer',
            'services' => 'Service Packages',
            'projects' => 'Portfolio Projects',
            'articles' => 'Technical Articles',
            'case-studies' => 'Case Study Library',
            'recommendations', 'recommendations/all' => 'LinkedIn Recommendations',
            'taskmanager' => 'TaskManager Project',
            'books' => 'BookReview Project',
            'jobs' => 'Job Board Project',
            'listing' => 'Real Estate Listings',
            default => self::fallbackTitle($request),
        };
    }

    private static function description(Request $request, string $locale): string
    {
        $article = self::routeModel($request, 'article');
        if ($article instanceof Article) {
            return self::clean(self::localized($article, 'excerpt', $locale));
        }

        $caseStudy = self::routeModel($request, 'caseStudy');
        if ($caseStudy instanceof CaseStudy) {
            return self::clean(self::localized($caseStudy, 'summary', $locale));
        }

        $service = self::routeModel($request, 'service');
        if ($service instanceof Service) {
            return self::clean(self::localized($service, 'benefit', $locale));
        }

        return match (trim($request->path(), '/')) {
            '' => self::DEFAULT_DESCRIPTION,
            'services' => 'Backend-focused business systems, modern websites, workflow automation and AI-powered platforms delivered in weeks, not months.',
            'projects' => 'Portfolio projects by Mohi, including TaskManager, CashPilot, AI Routine Coach, Mahdieh Design, Job Board, BookReview, and Real Estate.',
            'articles' => 'Practical writing about backend systems, Laravel, architecture, production debugging, and full-stack delivery.',
            'case-studies' => 'Selected engineering case studies across backend architecture, Laravel, Symfony, Vue, Node.js, Web3, AI integrations, and production modernization.',
            'recommendations', 'recommendations/all' => 'Full LinkedIn recommendations from people who have worked with Mohi across engineering, product, and delivery.',
            'taskmanager' => 'A focused Laravel and Inertia task manager demo with authenticated user workflows, subtasks, and status tracking.',
            'books' => 'A Laravel BookReview project with searchable books, ratings, review counts, and filterable discovery flows.',
            'jobs' => 'A Laravel job board project with filterable listings, employer dashboards, and applicant workflows.',
            'listing' => 'A real estate marketplace demo with property filters, buyer offers, notifications, and realtor listing tools.',
            default => self::DEFAULT_DESCRIPTION,
        };
    }

    private static function image(Request $request): string
    {
        $article = self::routeModel($request, 'article');
        if ($article instanceof Article && $article->cover_url) {
            return self::url($article->cover_url);
        }

        return self::url('/img/og-preview.webp');
    }

    private static function robots(Request $request): string
    {
        $path = trim($request->path(), '/');
        $private = [
            'dashboard*',
            'profile*',
            'login',
            'register',
            'forgot-password',
            'reset-password*',
            'verify-email*',
            'confirm-password',
            'my-jobs*',
            'my-job-applications*',
            'employer*',
            'realtor*',
            'notification*',
            'jobs/*/apply',
            'books/*/reviews*',
        ];

        if (Str::is($private, $path)) {
            return 'noindex,nofollow';
        }

        $queryKeys = collect($request->query())->keys()->reject(fn (string $key) => $key === 'lang');
        if ($queryKeys->isNotEmpty() && Str::is(['books', 'jobs', 'listing'], $path)) {
            return 'noindex,follow';
        }

        return 'index,follow';
    }

    private static function schema(Request $request, string $plainTitle, string $description, string $canonical, string $image, string $locale): array
    {
        $root = self::url('/');
        $graph = [
            [
                '@type' => 'WebSite',
                '@id' => $root.'#website',
                'url' => $root,
                'name' => self::SITE_NAME,
                'inLanguage' => $locale,
            ],
            [
                '@type' => 'Person',
                '@id' => $root.'#person',
                'name' => 'Mohi',
                'url' => $root,
                'jobTitle' => 'Back-End / Full-Stack Engineer',
                'sameAs' => [
                    'https://www.linkedin.com/in/mohiebi',
                    'https://github.com/mohiebi',
                ],
            ],
        ];

        $breadcrumb = self::breadcrumb($request, $plainTitle);
        if ($breadcrumb) {
            $graph[] = $breadcrumb;
        }

        $article = self::routeModel($request, 'article');
        if ($article instanceof Article) {
            $graph[] = [
                '@type' => 'Article',
                '@id' => $canonical.'#article',
                'headline' => self::localized($article, 'title', $locale),
                'description' => $description,
                'image' => $image,
                'datePublished' => optional($article->published_at)->toDateString(),
                'dateModified' => optional($article->updated_at)->toDateString(),
                'author' => ['@id' => $root.'#person'],
                'publisher' => ['@id' => $root.'#person'],
                'mainEntityOfPage' => $canonical,
                'inLanguage' => $locale,
            ];
        }

        $service = self::routeModel($request, 'service');
        if ($service instanceof Service) {
            $graph[] = [
                '@type' => 'Service',
                '@id' => $canonical.'#service',
                'name' => self::localized($service, 'name', $locale),
                'description' => $description,
                'url' => $canonical,
                'provider' => ['@id' => $root.'#person'],
                'serviceType' => self::localized($service, 'tagline', $locale),
                'inLanguage' => $locale,
            ];
        }

        $caseStudy = self::routeModel($request, 'caseStudy');
        if ($caseStudy instanceof CaseStudy) {
            $graph[] = [
                '@type' => 'CreativeWork',
                '@id' => $canonical.'#case-study',
                'name' => self::localized($caseStudy, 'title', $locale),
                'description' => $description,
                'url' => $canonical,
                'author' => ['@id' => $root.'#person'],
                'about' => array_values(array_filter((array) $caseStudy->stack)),
                'inLanguage' => $locale,
            ];
        }

        if (trim($request->path(), '/') === '') {
            $graph[] = [
                '@type' => 'ProfilePage',
                '@id' => $canonical.'#profile',
                'url' => $canonical,
                'name' => $plainTitle,
                'description' => $description,
                'mainEntity' => ['@id' => $root.'#person'],
                'inLanguage' => $locale,
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@graph' => array_values(array_filter($graph)),
        ];
    }

    private static function breadcrumb(Request $request, string $plainTitle): ?array
    {
        $path = trim(self::canonicalPath(trim($request->path(), '/')), '/');
        if ($path === '') {
            return null;
        }

        $segments = explode('/', $path);
        $items = [
            [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'Home',
                'item' => self::url('/'),
            ],
        ];

        $current = '';
        foreach ($segments as $index => $segment) {
            $current .= '/'.$segment;
            $items[] = [
                '@type' => 'ListItem',
                'position' => $index + 2,
                'name' => $index === count($segments) - 1 ? $plainTitle : Str::headline($segment),
                'item' => self::url($current),
            ];
        }

        return [
            '@type' => 'BreadcrumbList',
            '@id' => self::url('/'.ltrim($path, '/')).'#breadcrumb',
            'itemListElement' => $items,
        ];
    }

    private static function routeModel(Request $request, string $key): ?Model
    {
        $value = $request->route($key);

        return $value instanceof Model ? $value : null;
    }

    private static function localized(Model $model, string $field, string $locale): string
    {
        $translations = $model->getAttribute('translations');
        $translated = is_array($translations) ? data_get($translations, "{$locale}.{$field}") : null;

        return (string) ($translated ?: $model->getAttribute($field) ?: '');
    }

    private static function clean(string $value): string
    {
        return Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags($value)) ?: ''), 155, '');
    }

    private static function fallbackTitle(Request $request): string
    {
        $path = trim($request->path(), '/');
        $first = $path === '' ? 'Portfolio' : explode('/', $path)[0];

        return Str::headline($first);
    }

    private static function formatTitle(string $plainTitle): string
    {
        $plainTitle = trim($plainTitle);

        return $plainTitle ? self::SITE_NAME.' - '.$plainTitle : self::SITE_NAME;
    }

    private static function canonicalPath(string $path): string
    {
        return match ($path) {
            '', '/' => '/',
            'recommendations/all' => '/recommendations',
            default => '/'.ltrim($path, '/'),
        };
    }

    private static function locale(Request $request): string
    {
        return $request->query('lang') === 'de' ? 'de' : 'en';
    }

    private static function url(string $path, array $query = []): string
    {
        $base = rtrim((string) config('app.url'), '/') ?: rtrim(request()->getSchemeAndHttpHost(), '/');
        $url = $base.'/'.ltrim($path, '/');
        $url = rtrim($url, '/') ?: $base;

        if ($path === '/') {
            $url = $base;
        }

        return $query ? $url.'?'.http_build_query($query) : $url;
    }

    private static function escape(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }
}
