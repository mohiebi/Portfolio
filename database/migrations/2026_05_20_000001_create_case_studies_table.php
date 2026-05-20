<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_studies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('company')->nullable();
            $table->string('role')->nullable();
            $table->string('period')->nullable();
            $table->string('location')->nullable();
            $table->string('tag')->nullable();
            $table->text('summary');
            $table->string('accent')->default('from-emerald-400/30 to-teal-500/10');
            $table->string('cover')->default('web');
            $table->text('problem')->nullable();
            $table->json('approach')->nullable();
            $table->json('impact')->nullable();
            $table->json('stack')->nullable();
            $table->json('highlights')->nullable();
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });

        DB::table('case_studies')->insert($this->initialCaseStudies());
    }

    public function down(): void
    {
        Schema::dropIfExists('case_studies');
    }

    private function initialCaseStudies(): array
    {
        $now = now();

        return collect([
            [
                'slug' => 'mintme-web3-platform',
                'title' => 'Scaling a Web3 trading platform with on-chain pipelines',
                'company' => 'Mintme.com',
                'role' => 'Full-Stack Developer',
                'period' => 'Jun 2024 - Dec 2025',
                'location' => 'Belize City, Belize',
                'tag' => 'Web3 / Symfony / Vue.js',
                'summary' => 'Delivered 90+ development tasks across Symfony and Vue.js applications, contributed 1500+ GitLab commits, built a Node.js blockchain data pipeline, and shipped multi-chain wallet integrations.',
                'accent' => 'from-amber-400/30 to-orange-500/10',
                'cover' => 'web3',
                'problem' => 'MintMe needed faster feature throughput on a large Symfony and Vue.js codebase while expanding Web3 capabilities across multiple blockchains. On-chain events had to be reliably consumed and forwarded to backend services, and wallet flows needed to support multiple chains without fragmenting the UX.',
                'approach' => [
                    'Delivered 50+ new features and 40+ production bug fixes across Symfony services and Vue.js components.',
                    'Built a Node.js blockchain data pipeline that watches on-chain events, filters and normalizes them, and forwards structured payloads to Symfony middleware.',
                    'Developed Web3 wallet integration features supporting MetaMask, Solflare, and multiple blockchain networks.',
                    'Designed and implemented wallet connection logic covering 8+ authentication and transaction scenarios across different chains.',
                    'Investigated and resolved production-level issues, improving platform stability and reliability.',
                    'Increased JavaScript unit test coverage by 50% through improved testing practices and refactoring efforts.',
                ],
                'impact' => [
                    ['label' => 'Tasks shipped', 'value' => '90+'],
                    ['label' => 'GitLab commits', 'value' => '1500+'],
                    ['label' => 'JS unit coverage', 'value' => '+50%'],
                    ['label' => 'Wallet flows', 'value' => '8+'],
                ],
                'stack' => ['Symfony', 'Vue.js', 'Node.js', 'Web3.js', 'MetaMask', 'Solflare', 'MySQL', 'Docker'],
                'highlights' => [
                    'On-chain to off-chain event pipeline with structured payload contracts.',
                    'Multi-chain wallet UX with shared connection abstractions.',
                    'Production-level troubleshooting that improved platform stability and reliability.',
                ],
                'sort_order' => 10,
            ],
            [
                'slug' => 'abc-hosting-legacy-modernization',
                'title' => 'Modernizing a legacy PHP hosting platform',
                'company' => 'ABC Hosting Ltd.',
                'role' => 'Full-Stack Developer',
                'period' => 'Nov 2025 - Present',
                'location' => 'Belize City, Belize',
                'tag' => 'PHP / Vue.js / Docker',
                'summary' => 'Re-architected a legacy PHP application, containerized it with Docker, migrated the UI to Vue.js, and rolled out multilingual and multi-currency support with location-based detection.',
                'accent' => 'from-sky-400/30 to-indigo-500/10',
                'cover' => 'modernize',
                'problem' => 'A legacy PHP application needed a more scalable, maintainable architecture, a consistent Docker-based environment, a modern Vue.js frontend, and a localized experience for international users.',
                'approach' => [
                    'Re-structured and modernized the legacy PHP application architecture to improve scalability, deployment consistency, and maintainability.',
                    'Containerized the entire environment with Docker for consistent local and production deployments.',
                    'Migrated the frontend from the legacy UI to a modern component-based interface using Vue.js.',
                    'Implemented i18n and multi-currency support with location-based currency detection.',
                ],
                'impact' => [
                    ['label' => 'Deployment consistency', 'value' => 'Dockerized'],
                    ['label' => 'Frontend rewrite', 'value' => 'Vue.js'],
                    ['label' => 'Locales supported', 'value' => 'Multi'],
                    ['label' => 'Currency detection', 'value' => 'Geo-based'],
                ],
                'stack' => ['PHP', 'Vue.js', 'Docker', 'MySQL', 'REST APIs', 'Tailwind CSS'],
                'highlights' => [
                    'Lift and reshape of a legacy monolith without breaking production.',
                    'Localized user experience with multilingual and multi-currency support.',
                    'Faster onboarding for new engineers thanks to a containerized environment.',
                ],
                'sort_order' => 20,
            ],
            [
                'slug' => 'proace-ai-crm',
                'title' => 'AI-powered assistance inside a Laravel CRM',
                'company' => 'ProAce CRM Project',
                'role' => 'AI Integration Developer',
                'period' => 'Jun 2025 - Mar 2026',
                'location' => 'Canada / Remote',
                'tag' => 'Laravel / AI / CRM',
                'summary' => 'Integrated AI-powered features into a Laravel-based CRM platform, including AI Assist, technical support automation, and user chat functionality.',
                'accent' => 'from-emerald-400/30 to-teal-500/10',
                'cover' => 'ai',
                'problem' => 'The Laravel CRM needed AI-powered assistance, technical support automation, and chat functionality so users could access smarter in-app help without leaving the platform.',
                'approach' => [
                    'Integrated AI Assist, technical support automation, and user chat functionality into the Laravel CRM.',
                    'Implemented backend logic for AI-assisted responses, chat interactions, and CRM-specific automation features.',
                    'Collaborated on improving the platform AI capabilities to help users access smarter in-app assistance.',
                ],
                'impact' => [
                    ['label' => 'AI features shipped', 'value' => '3'],
                    ['label' => 'Stack', 'value' => 'Laravel'],
                    ['label' => 'Surface', 'value' => 'In-app chat'],
                    ['label' => 'Focus', 'value' => 'Automation'],
                ],
                'stack' => ['Laravel', 'PHP', 'AI APIs', 'REST APIs', 'MySQL'],
                'highlights' => [
                    'Context-aware AI Assist embedded in CRM workflows.',
                    'Automated technical-support flows reducing manual triage.',
                    'Clean backend boundaries between CRM data and AI calls.',
                ],
                'sort_order' => 30,
            ],
            [
                'slug' => 'htdc-web-platform',
                'title' => 'Websites and content pipelines for a health-tourism center',
                'company' => 'Heath Tourism Development Center (HTDC)',
                'role' => 'Web Developer',
                'period' => 'May 2022 - Sep 2023',
                'location' => 'Muscat, Oman',
                'tag' => 'PHP / JavaScript / Content',
                'summary' => 'Developed and maintained company websites using PHP, JavaScript, HTML, and CSS, and supported online e-commerce content through course preparation and translation.',
                'accent' => 'from-rose-400/30 to-fuchsia-500/10',
                'cover' => 'web',
                'problem' => 'HTDC needed maintained company websites to improve online visibility and user experience, plus prepared and translated educational and management course materials for online e-commerce.',
                'approach' => [
                    'Developed and maintained company websites using PHP, JavaScript, HTML, and CSS.',
                    'Improved online visibility and user experience across company web surfaces.',
                    'Prepared and translated educational and management-related course materials for online e-commerce.',
                ],
                'impact' => [
                    ['label' => 'Sites maintained', 'value' => 'Multiple'],
                    ['label' => 'Content', 'value' => 'Bilingual'],
                    ['label' => 'Channel', 'value' => 'E-commerce'],
                    ['label' => 'Focus', 'value' => 'Visibility'],
                ],
                'stack' => ['PHP', 'JavaScript', 'HTML', 'CSS'],
                'highlights' => [
                    'Hands-on full lifecycle: build, maintain, iterate.',
                    'Bilingual content workflow for international learners.',
                    'Practical foundation for later backend specialization.',
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
