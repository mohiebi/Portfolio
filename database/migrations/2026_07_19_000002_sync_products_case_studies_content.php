<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('case_studies')->upsert(
            $this->newCaseStudies(),
            ['slug'],
            [
                'title',
                'company',
                'role',
                'period',
                'location',
                'tag',
                'summary',
                'accent',
                'cover',
                'featured_image_path',
                'project_url',
                'repository_url',
                'problem',
                'approach',
                'impact',
                'stack',
                'highlights',
                'translations',
                'is_published',
                'sort_order',
                'updated_at',
            ]
        );

        foreach ($this->sortOrders() as $slug => $sortOrder) {
            DB::table('case_studies')->where('slug', $slug)->update([
                'sort_order' => $sortOrder,
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        // Keep administrator-edited case studies intact when rolling back this content sync.
    }

    private function sortOrders(): array
    {
        return [
            'mahdieh-design-portfolio-cms' => 10,
            'abc-hosting-legacy-modernization' => 20,
            'mintme-web3-platform' => 30,
            'proace-ai-crm' => 40,
            'htdc-web-platform' => 50,
            'real-estate-marketplace' => 60,
        ];
    }

    private function newCaseStudies(): array
    {
        $now = now();

        return collect([
            [
                'slug' => 'mahdieh-design-portfolio-cms',
                'title' => 'Building a multilingual portfolio CMS and CRM for a brand identity designer',
                'company' => 'Mahdieh Design',
                'role' => 'Full-Stack Developer / Technical Partner',
                'period' => 'Apr-May 2026',
                'location' => 'Remote',
                'tag' => 'Laravel / Inertia / Multilingual CMS',
                'summary' => 'Built a full multilingual portfolio platform and admin CRM around Mahdieh Design existing identity, logo, theme, and portfolio material, extending it into services, packages, project media, briefs, translation automation, analytics, SEO, deployment, DNS, and maintenance.',
                'accent' => 'from-rose-400/30 to-orange-500/10',
                'cover' => 'web',
                'featured_image_path' => 'img/case-studies/mahdieh-design-dashboard.png',
                'project_url' => 'https://mahdiehdesign.com',
                'repository_url' => null,
                'problem' => 'Mahdieh Design needed more than a static portfolio. The existing brand identity and portfolio material needed to become a maintainable multilingual website with services, packages, project publishing, brief collection, media management, analytics, SEO, and a workflow the designer could operate without developer help.',
                'approach' => [
                    'Used Mahdieh existing portfolio, logo, visual theme, and brand material as the creative foundation, then extended the UI and product structure around it.',
                    'Built the Laravel, Inertia, React, Tailwind, and MySQL application with a custom admin dashboard for projects, posts, services, packages, recommendations, brief questions, and submissions.',
                    'Implemented bilingual English and German public pages, plus selected three-language flows for briefs and authentication with Persian font support.',
                    'Added Azure Translator automation to fill missing multilingual public content and brief-question fields from source content.',
                    'Created project media workflows for uploading images and videos, plus technical SEO, sitemap generation, production deployment, domain setup, DNS, and ongoing maintenance.',
                ],
                'impact' => [
                    ['label' => 'Languages', 'value' => '3'],
                    ['label' => 'Managed projects', 'value' => '32'],
                    ['label' => 'Published projects', 'value' => '24'],
                    ['label' => 'Translation', 'value' => 'Azure'],
                ],
                'stack' => ['Laravel', 'Inertia', 'React', 'Tailwind CSS', 'MySQL', 'Azure Translator', 'SEO', 'DNS'],
                'highlights' => [
                    'A custom portfolio CMS and CRM shaped around a real designer workflow, not a template.',
                    'Multilingual content operations covering English, German, and selected Persian-language flows.',
                    'Analytics dashboard showing visits and engagement across projects and packages.',
                    'End-to-end ownership from application build to sitemap, domain, DNS, deployment, and maintenance.',
                ],
                'sort_order' => 10,
                'translations' => [
                    'de' => [
                        'title' => 'Aufbau eines mehrsprachigen Portfolio-CMS und CRM fur eine Brand-Identity-Designerin',
                        'company' => 'Mahdieh Design',
                        'role' => 'Full-Stack-Entwickler / Technischer Partner',
                        'period' => 'Apr-Mai 2026',
                        'location' => 'Remote',
                        'tag' => 'Laravel / Inertia / Mehrsprachiges CMS',
                        'summary' => 'Ich entwickelte eine vollstandige mehrsprachige Portfolio-Plattform und ein Admin-CRM auf Basis der bestehenden Identitat, des Logos, des visuellen Themas und des Portfolio-Materials von Mahdieh Design, erweitert um Services, Pakete, Projektmedien, Briefings, Ubersetzungsautomatisierung, Analytics, SEO, Deployment, DNS und Wartung.',
                        'problem' => 'Mahdieh Design brauchte mehr als ein statisches Portfolio. Die bestehende Markenidentitat und das Portfolio-Material sollten zu einer wartbaren mehrsprachigen Website werden, mit Services, Paketen, Projektveroffentlichung, Brief-Erfassung, Medienverwaltung, Analytics, SEO und einem Workflow, den die Designerin selbst bedienen kann.',
                        'approach' => [
                            'Ich nutzte Mahdiehs bestehendes Portfolio, Logo, visuelles Thema und Markenmaterial als kreative Grundlage und erweiterte daraus UI und Produktstruktur.',
                            'Ich entwickelte die Laravel-, Inertia-, React-, Tailwind- und MySQL-Anwendung mit einem individuellen Admin-Dashboard fur Projekte, Beitrage, Services, Pakete, Empfehlungen, Brief-Fragen und Einsendungen.',
                            'Ich implementierte englische und deutsche offentliche Seiten sowie ausgewahlte dreisprachige Ablaufe fur Briefings und Authentifizierung mit persischer Typografie.',
                            'Ich integrierte Azure Translator, um fehlende mehrsprachige offentliche Inhalte und Brief-Fragen automatisch aus Quellinhalten zu erzeugen.',
                            'Ich baute Workflows fur Bild- und Video-Uploads pro Projekt sowie technisches SEO, Sitemap, Produktionsdeployment, Domain, DNS und laufende Wartung.',
                        ],
                        'impact' => [
                            ['label' => 'Sprachen', 'value' => '3'],
                            ['label' => 'Verwaltete Projekte', 'value' => '32'],
                            ['label' => 'Veroffentlichte Projekte', 'value' => '24'],
                            ['label' => 'Ubersetzung', 'value' => 'Azure'],
                        ],
                        'stack' => ['Laravel', 'Inertia', 'React', 'Tailwind CSS', 'MySQL', 'Azure Translator', 'SEO', 'DNS'],
                        'highlights' => [
                            'Ein individuelles Portfolio-CMS und CRM fur den echten Arbeitsablauf einer Designerin, nicht als Template.',
                            'Mehrsprachige Content-Prozesse fur Englisch, Deutsch und ausgewahlte persischsprachige Ablaufe.',
                            'Analytics-Dashboard mit Besuchen und Engagement fur Projekte und Pakete.',
                            'End-to-end Verantwortung von Anwendung bis Sitemap, Domain, DNS, Deployment und Wartung.',
                        ],
                    ],
                ],
            ],
            [
                'slug' => 'real-estate-marketplace',
                'title' => 'Building my first end-to-end marketplace with Laravel, Inertia, and Vue',
                'company' => 'Personal Project',
                'role' => 'Full-Stack Developer',
                'period' => 'Jan-Mar 2025',
                'location' => 'Personal build',
                'tag' => 'Laravel / Inertia / Vue Marketplace',
                'summary' => 'Built a real-estate marketplace as a personal but production-minded project: my first independently built full-stack Vue application, with browsing, filtering, authentication, realtor workflows, image uploads, buyer offers, notifications, authorization, and tested marketplace states.',
                'accent' => 'from-teal-400/30 to-sky-500/10',
                'cover' => 'web',
                'featured_image_path' => 'img/case-studies/real-estate-marketplace.svg',
                'project_url' => null,
                'repository_url' => 'https://github.com/mohiebi/Laravel-Vue-RealEstate',
                'problem' => 'I wanted to build a complete marketplace on my own with Laravel, Inertia, and Vue, not just a small demo. The goal was to cover the real product surface: property discovery, authenticated buyer intent, realtor management, media handling, policies, notifications, and state changes when offers are accepted.',
                'approach' => [
                    'Built listing browse and detail flows with filters for price, beds, baths, and area.',
                    'Implemented authentication-backed buyer offers, database notifications, and offer acceptance logic that marks a property as sold and rejects competing offers.',
                    'Created realtor listing management with create, edit, soft delete, restore, and image upload workflows.',
                    'Used policies and authorization checks to protect ownership-sensitive realtor and offer actions.',
                    'Added queues and PHPUnit coverage while learning to carry a full-stack Vue project from UI to persistence on my own.',
                ],
                'impact' => [
                    ['label' => 'Solo Vue build', 'value' => 'First'],
                    ['label' => 'User journeys', 'value' => '3'],
                    ['label' => 'Listing filters', 'value' => '4'],
                    ['label' => 'Source', 'value' => 'Public'],
                ],
                'stack' => ['Laravel 12', 'Inertia 2', 'Vue 3', 'TypeScript', 'Tailwind CSS 4', 'Eloquent', 'MySQL/MariaDB', 'PHPUnit'],
                'highlights' => [
                    'A complete buyer-to-realtor marketplace flow rather than a static portfolio sample.',
                    'Offer acceptance updates marketplace state by selling the listing and rejecting competing offers.',
                    'A public repository that shows the learning arc behind the first solo Vue full-stack build.',
                ],
                'sort_order' => 60,
                'translations' => [
                    'de' => [
                        'title' => 'Aufbau meines ersten End-to-end-Marktplatzes mit Laravel, Inertia und Vue',
                        'company' => 'Personliches Projekt',
                        'role' => 'Full-Stack-Entwickler',
                        'period' => 'Jan-Mar 2025',
                        'location' => 'Personlicher Build',
                        'tag' => 'Laravel / Inertia / Vue-Marktplatz',
                        'summary' => 'Ich entwickelte einen Immobilien-Marktplatz als personliches, aber produktionsnah gedachtes Projekt: meine erste eigenstandig gebaute Full-Stack-Vue-Anwendung mit Suche, Filtern, Authentifizierung, Makler-Workflows, Bild-Uploads, Kauferangeboten, Benachrichtigungen, Autorisierung und getesteten Marktplatz-Zustanden.',
                        'problem' => 'Ich wollte eigenstandig einen vollstandigen Marktplatz mit Laravel, Inertia und Vue bauen, nicht nur eine kleine Demo. Ziel war die echte Produktflache: Immobiliensuche, authentifizierte Kauferabsicht, Maklerverwaltung, Medienhandling, Policies, Benachrichtigungen und Zustandswechsel nach akzeptierten Angeboten.',
                        'approach' => [
                            'Ich baute Browse- und Detailansichten fur Listings mit Filtern fur Preis, Schlafzimmer, Bader und Flache.',
                            'Ich implementierte authentifizierte Kauferangebote, Datenbankbenachrichtigungen und Annahmelogik, die eine Immobilie als verkauft markiert und konkurrierende Angebote ablehnt.',
                            'Ich erstellte Makler-Workflows fur Erstellung, Bearbeitung, Soft Delete, Wiederherstellung und Bild-Uploads.',
                            'Ich nutzte Policies und Autorisierungsprufungen, um eigentumerbezogene Makler- und Angebotsaktionen zu schutzen.',
                            'Ich erweiterte das Projekt um Queues und PHPUnit-Tests und lernte, ein Full-Stack-Vue-Projekt eigenstandig von UI bis Persistenz zu tragen.',
                        ],
                        'impact' => [
                            ['label' => 'Solo-Vue-Build', 'value' => 'Erster'],
                            ['label' => 'User Journeys', 'value' => '3'],
                            ['label' => 'Listing-Filter', 'value' => '4'],
                            ['label' => 'Source', 'value' => 'Offentlich'],
                        ],
                        'stack' => ['Laravel 12', 'Inertia 2', 'Vue 3', 'TypeScript', 'Tailwind CSS 4', 'Eloquent', 'MySQL/MariaDB', 'PHPUnit'],
                        'highlights' => [
                            'Ein kompletter Kaufer-bis-Makler-Marktplatzfluss statt eines statischen Portfolio-Beispiels.',
                            'Die Annahme eines Angebots aktualisiert den Marktplatzstatus, verkauft das Listing und lehnt konkurrierende Angebote ab.',
                            'Ein offentliches Repository zeigt den Lernweg hinter dem ersten eigenstandigen Full-Stack-Vue-Build.',
                        ],
                    ],
                ],
            ],
        ])->map(function (array $caseStudy) use ($now) {
            $base = [
                'title' => null,
                'company' => null,
                'role' => null,
                'period' => null,
                'location' => null,
                'tag' => null,
                'summary' => null,
                'accent' => null,
                'cover' => null,
                'featured_image_path' => null,
                'project_url' => null,
                'repository_url' => null,
                'problem' => null,
                'approach' => null,
                'impact' => null,
                'stack' => null,
                'highlights' => null,
                'translations' => null,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            $caseStudy = [...$base, ...$caseStudy];

            foreach (['approach', 'impact', 'stack', 'highlights', 'translations'] as $field) {
                if (is_array($caseStudy[$field])) {
                    $caseStudy[$field] = json_encode($caseStudy[$field]);
                }
            }

            return $caseStudy;
        })->all();
    }
};
