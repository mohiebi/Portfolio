<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('case_studies')->upsert(
            $this->caseStudies(),
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
                'problem',
                'approach',
                'impact',
                'stack',
                'highlights',
                'is_published',
                'sort_order',
                'updated_at',
            ]
        );
    }

    public function down(): void
    {
        // Keep user-edited case studies intact when rolling back this content sync.
    }

    private function caseStudies(): array
    {
        $now = now();

        return collect([
            [
                'slug' => 'abc-hosting-legacy-modernization',
                'title' => 'Modernizing a legacy PHP hosting platform into Vue.js and Docker',
                'company' => 'ABC Hosting Ltd.',
                'role' => 'Full-Stack Developer',
                'period' => 'Nov 2025 - Present',
                'location' => 'Belize City, Belize',
                'tag' => 'PHP / Vue.js / Docker',
                'summary' => 'Migrated a monolithic legacy UI to component-based Vue.js, reduced page load time by 85%, Dockerized the full stack, and shipped multilingual and multi-currency support for 7 countries.',
                'accent' => 'from-sky-400/30 to-indigo-500/10',
                'cover' => 'modernize',
                'problem' => 'ABC Hosting was carrying years of UI debt in a legacy PHP application. The team needed faster frontend delivery, more predictable environments, and an internationalized buying experience without destabilizing the existing platform.',
                'approach' => [
                    'Migrated a monolithic legacy UI to a component-based Vue.js architecture, reducing page load time by 85% and unblocking frontend delivery.',
                    'Containerized the full application stack with Docker, cutting setup time from 2.5 hours to under 15 minutes.',
                    'Reduced environment-specific bugs by making local and deployment environments consistent.',
                    'Implemented multilingual and multi-currency support with automatic location-based currency detection.',
                    'Expanded product reach to 7 countries through localized pricing and language support.',
                ],
                'impact' => [
                    ['label' => 'Page load time', 'value' => '-85%'],
                    ['label' => 'Setup time', 'value' => '<15m'],
                    ['label' => 'Markets supported', 'value' => '7'],
                    ['label' => 'Frontend', 'value' => 'Vue.js'],
                ],
                'stack' => ['PHP', 'Vue.js', 'Docker', 'MySQL', 'REST APIs', 'Tailwind CSS'],
                'highlights' => [
                    'Reduced years of UI debt with a maintainable Vue.js component architecture.',
                    'Cut developer setup from 2.5 hours to under 15 minutes with Docker.',
                    'Localized the purchase experience across 7 countries with multilingual and multi-currency support.',
                ],
                'sort_order' => 10,
            ],
            [
                'slug' => 'mintme-web3-platform',
                'title' => 'Scaling a Web3 trading platform with real-time blockchain pipelines',
                'company' => 'Mintme.com',
                'role' => 'Full-Stack Developer',
                'period' => 'Jun 2024 - Dec 2025',
                'location' => 'Belize City, Belize',
                'tag' => 'Web3 / Symfony / Vue.js',
                'summary' => 'Delivered 100+ production tasks across Symfony and Vue.js, increased JavaScript unit coverage by 70%, built a Node.js blockchain pipeline for 1,000+ daily transactions, and shipped multi-chain wallet integrations.',
                'accent' => 'from-amber-400/30 to-orange-500/10',
                'cover' => 'web3',
                'problem' => 'MintMe needed reliable delivery across a production Symfony and Vue.js platform while expanding Web3 capabilities. Real-time blockchain events had to be ingested, filtered, and passed into backend services for downstream transaction processing.',
                'approach' => [
                    'Delivered 100+ production tasks, including 60+ features and 40+ bug fixes, across a Symfony and Vue.js platform.',
                    'Contributed 1,500+ GitLab commits while maintaining clean architecture and CI/CD-compatible code.',
                    'Increased JavaScript unit test coverage by 70% by introducing structured testing practices and refactoring untested legacy modules.',
                    'Built a Node.js blockchain data pipeline that ingested on-chain events in real time, filtered and structured payloads, and delivered them to Symfony middleware.',
                    'Enabled downstream processing for 1,000+ daily transactions through the blockchain event pipeline.',
                    'Engineered wallet integration for MetaMask, Solflare, and 6+ blockchain networks.',
                    'Covered 3+ authentication and transaction scenarios, including edge cases across different chain states.',
                ],
                'impact' => [
                    ['label' => 'Production tasks', 'value' => '100+'],
                    ['label' => 'Daily transactions', 'value' => '1,000+'],
                    ['label' => 'JS test coverage', 'value' => '+70%'],
                    ['label' => 'GitLab commits', 'value' => '1,500+'],
                ],
                'stack' => ['Symfony', 'Vue.js', 'Node.js', 'Web3.js', 'MetaMask', 'Solflare', 'MySQL', 'Docker'],
                'highlights' => [
                    'Real-time on-chain event ingestion feeding structured payloads into Symfony middleware.',
                    'Multi-chain wallet support across MetaMask, Solflare, and 6+ blockchain networks.',
                    'Testing improvements that helped reduce regressions in a complex Symfony/Vue.js codebase.',
                ],
                'sort_order' => 20,
            ],
            [
                'slug' => 'proace-ai-crm',
                'title' => 'AI-powered chat and support automation inside a Laravel CRM',
                'company' => 'ProAce CRM Project',
                'role' => 'AI Integration Developer',
                'period' => 'Jun 2025 - Mar 2026',
                'location' => 'Canada / Remote',
                'tag' => 'Laravel / AI / CRM',
                'summary' => 'Integrated AI-powered chat and support automation into a Laravel CRM, reducing manual support responses by 70% and delivering 30+ AI-powered endpoints for the frontend.',
                'accent' => 'from-emerald-400/30 to-teal-500/10',
                'cover' => 'ai',
                'problem' => 'The CRM needed real-time AI-assisted user interactions and support automation so users could get contextual help inside the product while reducing manual support workload.',
                'approach' => [
                    'Integrated AI-powered chat and technical support automation into a Laravel-based CRM.',
                    'Reduced manual support responses by 70% by enabling real-time AI-assisted interactions.',
                    'Implemented backend logic for AI Assist, technical support automation, and in-app chat.',
                    'Delivered 30+ AI-powered endpoints consumed by the CRM frontend.',
                    'Collaborated on CRM-specific automation flows that kept AI assistance inside existing user workflows.',
                ],
                'impact' => [
                    ['label' => 'Manual responses', 'value' => '-70%'],
                    ['label' => 'AI endpoints', 'value' => '30+'],
                    ['label' => 'AI surfaces', 'value' => '3'],
                    ['label' => 'Backend', 'value' => 'Laravel'],
                ],
                'stack' => ['Laravel', 'PHP', 'AI APIs', 'REST APIs', 'MySQL'],
                'highlights' => [
                    'AI Assist, support automation, and chat brought directly into CRM workflows.',
                    '30+ backend endpoints powering AI interactions in the frontend.',
                    'Support automation that reduced manual responses by 70%.',
                ],
                'sort_order' => 30,
            ],
            [
                'slug' => 'htdc-web-platform',
                'title' => 'Websites and e-commerce content for a health-tourism center',
                'company' => 'Health Tourism Development Center (HTDC)',
                'role' => 'Web Developer',
                'period' => 'May 2022 - Sep 2023',
                'location' => 'Muscat, Oman',
                'tag' => 'PHP / JavaScript / Content',
                'summary' => 'Built and maintained company websites with PHP, JavaScript, HTML, and CSS, improving organic traffic by 65%, supporting 7 service pages, and expanding the online course catalog by 5 modules.',
                'accent' => 'from-rose-400/30 to-fuchsia-500/10',
                'cover' => 'web',
                'problem' => 'HTDC needed a stronger digital presence for its service pages and a more complete e-commerce learning catalog supported by prepared and translated educational materials.',
                'approach' => [
                    'Built and maintained company websites using PHP, JavaScript, HTML, and CSS.',
                    'Improved organic traffic by 65% while supporting the center digital presence across 7 service pages.',
                    'Prepared and translated educational course materials for e-commerce delivery.',
                    'Expanded the available online catalog by 5 modules.',
                ],
                'impact' => [
                    ['label' => 'Organic traffic', 'value' => '+65%'],
                    ['label' => 'Service pages', 'value' => '7'],
                    ['label' => 'Catalog modules', 'value' => '+5'],
                    ['label' => 'Channel', 'value' => 'E-commerce'],
                ],
                'stack' => ['PHP', 'JavaScript', 'HTML', 'CSS'],
                'highlights' => [
                    'Website maintenance and iteration across 7 service pages.',
                    'Organic traffic improvements through stronger web presence and UX work.',
                    'Translated course-material workflow for e-commerce delivery.',
                ],
                'sort_order' => 40,
            ],
        ])->map(function (array $caseStudy) use ($now) {
            foreach (['approach', 'impact', 'stack', 'highlights'] as $field) {
                $caseStudy[$field] = json_encode($caseStudy[$field]);
            }

            return [
                ...$caseStudy,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        })->all();
    }
};
