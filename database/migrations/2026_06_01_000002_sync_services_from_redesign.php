<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('services')->upsert(
            $this->services(),
            ['slug'],
            [
                'name',
                'badge',
                'tagline',
                'promise',
                'investment',
                'timeline',
                'outcome',
                'best_for',
                'benefit',
                'cover',
                'accent',
                'problem',
                'what_you_get',
                'why_it_matters',
                'before',
                'after',
                'deliverables',
                'ai_capabilities',
                'bonuses',
                'guarantees',
                'is_published',
                'sort_order',
                'updated_at',
            ]
        );
    }

    public function down(): void
    {
        // Keep user-edited services intact when rolling back this content sync.
    }

    private function services(): array
    {
        $now = now();

        return collect([
            [
                'slug' => 'launch-sprint',
                'name' => 'Launch Sprint',
                'badge' => null,
                'tagline' => 'Entry offer',
                'promise' => 'Launch a modern business presence - fast.',
                'investment' => '$3K - $6K',
                'timeline' => '7-14 days',
                'outcome' => 'Modern credibility and lead capture',
                'best_for' => 'Local businesses, consultants, clinics, agencies, law firms, personal brands and real estate teams.',
                'benefit' => 'A modern, high-converting website that builds trust and turns visitors into qualified leads - without waiting months for an agency.',
                'cover' => 'launch',
                'accent' => 'from-emerald-400/25 to-sky-500/10',
                'problem' => 'An outdated website quietly costs you customers. Weak credibility, a poor mobile experience and no structured way to capture leads mean visitors leave before they ever reach out.',
                'what_you_get' => 'A fast, modern, mobile-first website with clear lead-capture paths, an admin you can manage yourself, and the SEO and analytics foundation to start measuring growth from day one.',
                'why_it_matters' => 'Your website is the first impression most buyers get. A credible, fast and conversion-focused presence directly increases trust and the number of leads you capture.',
                'before' => [
                    'Outdated website',
                    'Weak credibility',
                    'Poor mobile experience',
                    'Low trust',
                    'No structured lead capture',
                ],
                'after' => [
                    'Modern digital presence',
                    'Better conversion',
                    'Strong brand trust',
                    'Fast mobile experience',
                    'Clear lead capture path',
                ],
                'deliverables' => [
                    'Modern responsive website',
                    'Up to 5-7 core pages',
                    'CMS / admin access',
                    'Contact and lead capture forms',
                    'Basic SEO foundation',
                    'Analytics setup',
                    'Performance optimization',
                    'Deployment and launch support',
                    'Mobile optimization',
                    'Security basics (SSL & domain support)',
                ],
                'ai_capabilities' => [
                    'AI-assisted page copy suggestions',
                    'AI-assisted SEO metadata drafts',
                    'Optional smart form response suggestions',
                ],
                'bonuses' => [
                    ['name' => 'SEO Foundation Pack', 'value' => '$500', 'why' => 'Metadata, sitemap, indexing setup and performance structure.'],
                    ['name' => 'Loom Training Videos', 'value' => '$300', 'why' => 'Step-by-step walkthroughs showing you how to manage pages and content.'],
                    ['name' => '14-Day Post-Launch Support', 'value' => '$500', 'why' => 'Bug fixes, small adjustments and stability checks.'],
                    ['name' => 'Analytics Setup', 'value' => '$300', 'why' => 'Basic traffic and conversion tracking setup.'],
                ],
                'guarantees' => [
                    ['name' => 'Delivery Guarantee', 'detail' => 'If delivery slips because of execution on my side, I keep working at no additional cost until launch.'],
                    ['name' => 'Communication Guarantee', 'detail' => 'You receive a clear progress update every 48 hours.'],
                    ['name' => 'Revision Guarantee', 'detail' => 'Initial direction revisions are included before development continues.'],
                ],
                'sort_order' => 10,
            ],
            [
                'slug' => 'operations-system-sprint',
                'name' => 'Operations System Sprint',
                'badge' => 'Most popular',
                'tagline' => 'Main offer',
                'promise' => 'Replace manual workflows with scalable business systems.',
                'investment' => '$8K - $18K',
                'timeline' => '2-4 weeks',
                'outcome' => 'Centralized operations and AI-enabled workflows',
                'best_for' => 'Growing companies, agencies, logistics businesses, clinics, recruitment firms, SaaS MVPs and ecommerce operators.',
                'benefit' => 'Centralized operations, automated workflows and a better customer experience - built on a scalable backend that grows with you.',
                'cover' => 'operations',
                'accent' => 'from-emerald-400/30 to-teal-500/10',
                'problem' => 'Disconnected tools, manual follow-ups and no centralized dashboard slow your team down and let leads, customers and tasks slip through the cracks. Every manual step is time and money lost.',
                'what_you_get' => 'A custom Laravel or NestJS backend with dashboards, customer portals, lead tracking, integrations and workflow automation - plus practical AI built into the processes your team uses daily.',
                'why_it_matters' => 'When operations are centralized and automated, your team spends less time on repetitive admin and more on growth. The system is designed to pay for itself through operational leverage.',
                'before' => [
                    'Disconnected tools',
                    'Manual follow-ups',
                    'No centralized dashboard',
                    'Slow operations',
                    'No automation',
                    'Lead handling mistakes',
                ],
                'after' => [
                    'Centralized operations',
                    'Automated workflows',
                    'Customer portal or admin dashboard',
                    'AI-assisted processes',
                    'Cleaner reporting',
                    'Scalable backend foundation',
                ],
                'deliverables' => [
                    'Custom Laravel or NestJS backend',
                    'Authentication and user roles',
                    'Admin dashboards',
                    'Customer portals',
                    'Booking or inquiry management',
                    'CRM-lite workflows',
                    'Lead tracking',
                    'API integrations',
                    'Workflow automation',
                    'Analytics and reporting',
                    'Production deployment setup',
                    'Secure and scalable backend architecture',
                ],
                'ai_capabilities' => [
                    'AI support assistant',
                    'AI lead qualification',
                    'AI workflow automation',
                    'AI email or content drafting',
                    'AI document / search tools',
                    'AI-generated workflow summaries',
                ],
                'bonuses' => [
                    ['name' => 'Automation Opportunity Audit', 'value' => '$1,000+', 'why' => 'Identify repetitive tasks and high-leverage automation opportunities before the build.'],
                    ['name' => '90-Day Optimization Roadmap', 'value' => '$1,000', 'why' => 'A prioritized growth roadmap for improving operations after launch.'],
                    ['name' => '30-Day Priority Support', 'value' => '$1,000', 'why' => 'Priority fixes, adjustments and stabilization after launch.'],
                    ['name' => 'Admin Training System', 'value' => '$500', 'why' => 'Documentation and Loom walkthroughs for your team.'],
                    ['name' => 'Launch Optimization Session', 'value' => '$500', 'why' => 'Post-launch review of UX, workflows and growth opportunities.'],
                ],
                'guarantees' => [
                    ['name' => 'Operational Guarantee', 'detail' => 'Core workflows must be fully operational before the project is considered complete.'],
                    ['name' => 'Timeline Guarantee', 'detail' => 'If the timeline slips because of execution on my side, I keep working at no additional cost.'],
                    ['name' => 'System Stability Guarantee', 'detail' => 'Critical bugs discovered within 30 days are fixed at no additional cost.'],
                    ['name' => 'Transparency Guarantee', 'detail' => 'Clear milestone-based delivery with consistent progress reporting.'],
                ],
                'sort_order' => 20,
            ],
            [
                'slug' => 'ai-operations-platform',
                'name' => 'AI Operations Platform',
                'badge' => null,
                'tagline' => 'Premium anchor',
                'promise' => 'AI-enabled internal platforms for scaling businesses.',
                'investment' => '$20K - $50K+',
                'timeline' => '1-3 months',
                'outcome' => 'Custom AI-enabled operational infrastructure',
                'best_for' => 'Funded startups, SaaS companies, operations-heavy teams, businesses replacing internal systems, and teams that need AI-enabled infrastructure.',
                'benefit' => 'A unified, scalable, AI-powered platform that replaces fragmented tools and becomes the operational backbone of your business.',
                'cover' => 'ai',
                'accent' => 'from-emerald-400/30 to-indigo-500/10',
                'problem' => 'Fragmented systems, scaling problems and too many SaaS tools trap your data and create high manual overhead. Without internal AI infrastructure, growth keeps getting more expensive.',
                'what_you_get' => 'A multi-user platform with advanced permissions, internal dashboards, a workflow automation engine, payment and billing integrations, an API ecosystem and internal AI tools - fully documented and handed off to your team.',
                'why_it_matters' => 'A purpose-built platform turns operations into a competitive advantage. It scales without rebuilding, unlocks operational intelligence and prepares your business for long-term growth.',
                'before' => [
                    'Fragmented systems',
                    'Scaling problems',
                    'High manual overhead',
                    'Too many SaaS tools',
                    'Data trapped in separate systems',
                    'No internal AI infrastructure',
                ],
                'after' => [
                    'Unified AI-enabled platform',
                    'Scalable architecture',
                    'Advanced permissions',
                    'AI-powered internal tools',
                    'Operational intelligence',
                    'Future-ready infrastructure',
                ],
                'deliverables' => [
                    'Multi-user architecture',
                    'Advanced roles and permissions',
                    'Internal dashboards',
                    'Workflow automation engine',
                    'Payment and billing integrations',
                    'API ecosystem',
                    'Advanced analytics',
                    'Monitoring and logging',
                    'Dev / staging / production environments',
                    'Architecture documentation',
                    'Team handoff',
                    'Scalable backend structure',
                ],
                'ai_capabilities' => [
                    'Internal AI assistants',
                    'Knowledge base and AI search',
                    'AI reporting and insight generation',
                    'AI document processing',
                    'Custom AI workflows',
                    'AI decision-support tools',
                ],
                'bonuses' => [
                    ['name' => 'AI Strategy Workshop', 'value' => '$2,000', 'why' => 'Deep-dive session to map AI opportunities and platform goals.'],
                    ['name' => '60-Day Priority Support', 'value' => '$3,000', 'why' => 'Extended stabilization and dedicated support after launch.'],
                    ['name' => 'Scalability Roadmap', 'value' => '$2,000', 'why' => 'Technical and business roadmap for future growth.'],
                    ['name' => 'Architecture Documentation', 'value' => '$1,500', 'why' => 'Complete technical documentation for maintainability and future teams.'],
                    ['name' => 'Team Training and Handoff', 'value' => '$1,000+', 'why' => 'Onboarding sessions to empower your team.'],
                ],
                'guarantees' => [
                    ['name' => 'Scalability Guarantee', 'detail' => 'The platform architecture is designed to support future growth without rebuilding from scratch.'],
                    ['name' => 'Delivery Commitment', 'detail' => 'Structured milestone-based delivery with weekly progress reporting.'],
                    ['name' => 'Security Guarantee', 'detail' => 'Security best practices are implemented throughout the platform.'],
                    ['name' => 'Stability Guarantee', 'detail' => 'Critical bugs within the agreed support window are fixed at no additional cost.'],
                ],
                'sort_order' => 30,
            ],
        ])->map(function (array $service) use ($now) {
            foreach (['before', 'after', 'deliverables', 'ai_capabilities', 'bonuses', 'guarantees'] as $field) {
                $service[$field] = json_encode($service[$field]);
            }

            return [
                ...$service,
                'is_published' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        })->all();
    }
};
