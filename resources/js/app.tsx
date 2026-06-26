import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route, type Config } from 'ziggy-js';
import { currentLocale, LanguageProvider, translateText } from './i18n';

createInertiaApp({
    title: (title) => {
        if (!title) return 'Mohi';

        const localizedTitle = translateText(title, currentLocale());
        const pageTitle = localizedTitle
            .replace(/^Mohi\s*[-—]\s*/i, '')
            .replace(/\s*[-—]\s*Mohi$/i, '');

        return `Mohi - ${pageTitle}`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const ziggyConfig = (props.initialPage.props as { ziggy?: Config }).ziggy;
        // Make route() available globally for all pages, injecting the Ziggy config from Inertia shared props
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).route = (name: any, params?: any, absolute?: boolean) =>
            route(name, params, absolute, ziggyConfig);
        createRoot(el).render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>,
        );
    },
    progress: {
        color: '#63d69a',
    },
});
