<?php

namespace App\Support;

/**
 * The allowed answer keys for every choice question on the project brief.
 *
 * Labels shown to the client live in resources/js/lib/brief.ts. Only the two
 * maps used in the notification sent to the site owner keep a readable label here.
 */
final class BriefOptions
{
    public const SPAM_FIELD = 'nickname';

    public const MAX_GOALS = 3;

    public const MAX_STYLES = 3;

    public const MAX_LIKED_SITES = 3;

    public const MAX_ATTACHMENTS = 5;

    public const MAX_ATTACHMENT_KB = 10240;

    public const ATTACHMENT_TYPES = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'];

    public const DEFAULT_LOCALE = 'en';

    /**
     * Languages the brief form is available in, with the English name shown to the owner.
     *
     * @var array<string, string>
     */
    public const LOCALES = [
        'en' => 'English',
        'fa' => 'Persian',
        'tr' => 'Turkish',
        'de' => 'German',
    ];

    /** @var array<string, string> */
    public const PROJECT_TYPES = [
        'new_site' => 'New website',
        'redesign' => 'Redesign of an existing site',
        'landing_page' => 'Landing page',
        'web_app' => 'Web app / dashboard',
        'design_only' => 'UI/UX design only',
        'unsure' => 'Not sure yet',
    ];

    /** @var array<string, string> */
    public const BUDGETS = [
        'under_3k' => 'Under $3K',
        '3k_6k' => '$3K - $6K',
        '6k_10k' => '$6K - $10K',
        '10k_20k' => '$10K - $20K',
        '20k_50k' => '$20K - $50K',
        '50k_plus' => '$50K+',
        'unsure' => 'Not sure yet',
    ];

    /** @var list<string> */
    public const GOALS = [
        'leads',
        'sell_online',
        'bookings',
        'credibility',
        'explain',
        'recruit',
        'replace_outdated',
        'internal_tool',
    ];

    /** @var list<string> */
    public const PAGES = [
        'home',
        'about',
        'services',
        'portfolio',
        'pricing',
        'blog',
        'shop',
        'booking',
        'faq',
        'careers',
        'contact',
        'legal',
    ];

    /** @var list<string> */
    public const FEATURES = [
        'forms',
        'booking',
        'payments',
        'accounts',
        'cms',
        'newsletter',
        'search',
        'analytics_seo',
        'crm',
        'chat_ai',
        'maps',
    ];

    /** @var list<string> */
    public const LANGUAGES = ['en', 'de', 'fa', 'tr', 'other'];

    /** @var list<string> */
    public const CONTENT_READINESS = ['ready', 'partial', 'need_help', 'unsure'];

    /** @var list<string> */
    public const DOMAIN_STATUS = ['both', 'domain_only', 'neither', 'unsure'];

    /** @var list<string> */
    public const BRAND_ASSETS = ['logo', 'palette', 'fonts', 'guidelines', 'imagery', 'none'];

    /** @var list<string> */
    public const STYLES = [
        'minimal',
        'bold',
        'premium',
        'friendly',
        'corporate',
        'tech',
        'editorial',
        'warm',
    ];

    /** @var list<string> */
    public const COLOUR_MODES = ['light', 'dark', 'either'];

    /** @var list<string> */
    public const TYPOGRAPHY = ['sans', 'serif', 'mix', 'none'];

    /** @var list<string> */
    public const TIMELINES = ['asap', '1_2_months', '3_6_months', 'flexible'];

    /** @var list<string> */
    public const SUPPORT = ['yes', 'maybe', 'no'];

    /** @var list<string> */
    public const CONTACT_METHODS = ['email', 'phone', 'video'];

    /**
     * @return list<string>
     */
    public static function locales(): array
    {
        return array_keys(self::LOCALES);
    }

    /**
     * @return list<string>
     */
    public static function projectTypes(): array
    {
        return array_keys(self::PROJECT_TYPES);
    }

    /**
     * @return list<string>
     */
    public static function budgets(): array
    {
        return array_keys(self::BUDGETS);
    }
}
