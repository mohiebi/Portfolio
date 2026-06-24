<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['articles', 'case_studies', 'services', 'service_projects', 'recommendations'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->json('translations')->nullable();
            });
        }

        $this->translateServices();
        $this->translateCaseStudies();
        $this->translateServiceProjects();
        $this->translateArticles();
        $this->translateRecommendations();
    }

    public function down(): void
    {
        foreach (['articles', 'case_studies', 'services', 'service_projects', 'recommendations'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropColumn('translations');
            });
        }
    }

    private function translateServices(): void
    {
        $translations = [
            'launch-sprint' => [
                'name' => 'Launch-Sprint',
                'tagline' => 'Einstiegsangebot',
                'promise' => 'Starten Sie schnell mit einem modernen Unternehmensauftritt.',
                'timeline' => '7–14 Tage',
                'outcome' => 'Moderne Glaubwürdigkeit und Lead-Gewinnung',
                'best_for' => 'Lokale Unternehmen, Beratungen, Kliniken, Agenturen, Kanzleien, Personal Brands und Immobilienteams.',
                'benefit' => 'Eine moderne, conversionstarke Website, die Vertrauen schafft und Besucher in qualifizierte Leads verwandelt — ohne monatelang auf eine Agentur zu warten.',
                'problem' => 'Eine veraltete Website kostet unbemerkt Kunden. Geringe Glaubwürdigkeit, eine schlechte mobile Erfahrung und fehlende strukturierte Lead-Erfassung sorgen dafür, dass Besucher abspringen, bevor sie Kontakt aufnehmen.',
                'what_you_get' => 'Eine schnelle, moderne Mobile-First-Website mit klaren Wegen zur Lead-Erfassung, einem selbst verwaltbaren Adminbereich sowie SEO- und Analytics-Grundlagen für messbares Wachstum ab dem ersten Tag.',
                'why_it_matters' => 'Ihre Website ist für die meisten Käufer der erste Eindruck. Ein glaubwürdiger, schneller und conversionorientierter Auftritt steigert direkt das Vertrauen und die Zahl Ihrer Anfragen.',
                'before' => ['Veraltete Website', 'Geringe Glaubwürdigkeit', 'Schlechte mobile Erfahrung', 'Wenig Vertrauen', 'Keine strukturierte Lead-Erfassung'],
                'after' => ['Moderner digitaler Auftritt', 'Bessere Conversion', 'Starkes Markenvertrauen', 'Schnelle mobile Erfahrung', 'Klarer Weg zur Lead-Erfassung'],
                'deliverables' => ['Moderne responsive Website', 'Bis zu 5–7 Kernseiten', 'CMS- / Adminzugang', 'Kontakt- und Lead-Formulare', 'SEO-Grundlage', 'Analytics-Einrichtung', 'Performance-Optimierung', 'Deployment- und Launch-Support', 'Mobile Optimierung', 'Sicherheitsgrundlagen (SSL- und Domain-Support)'],
                'ai_capabilities' => ['KI-gestützte Vorschläge für Seitentexte', 'KI-gestützte Entwürfe für SEO-Metadaten', 'Optionale intelligente Vorschläge für Formularantworten'],
                'bonuses' => [
                    ['name' => 'SEO-Grundlagenpaket', 'value' => '$500', 'why' => 'Metadaten, Sitemap, Indexierung und Performance-Struktur.'],
                    ['name' => 'Loom-Schulungsvideos', 'value' => '$300', 'why' => 'Schritt-für-Schritt-Anleitungen zur Verwaltung von Seiten und Inhalten.'],
                    ['name' => '14 Tage Support nach dem Launch', 'value' => '$500', 'why' => 'Fehlerbehebungen, kleine Anpassungen und Stabilitätsprüfungen.'],
                    ['name' => 'Analytics-Einrichtung', 'value' => '$300', 'why' => 'Grundlegendes Tracking für Traffic und Conversions.'],
                ],
                'guarantees' => [
                    ['name' => 'Liefergarantie', 'detail' => 'Verzögert sich die Lieferung durch meine Umsetzung, arbeite ich ohne Zusatzkosten bis zum Launch weiter.'],
                    ['name' => 'Kommunikationsgarantie', 'detail' => 'Sie erhalten alle 48 Stunden ein klares Fortschrittsupdate.'],
                    ['name' => 'Revisionsgarantie', 'detail' => 'Überarbeitungen der anfänglichen Richtung sind enthalten, bevor die Entwicklung fortgesetzt wird.'],
                ],
            ],
            'operations-system-sprint' => [
                'name' => 'Operations-System-Sprint',
                'badge' => 'Am beliebtesten',
                'tagline' => 'Hauptangebot',
                'promise' => 'Ersetzen Sie manuelle Abläufe durch skalierbare Geschäftssysteme.',
                'timeline' => '2–4 Wochen',
                'outcome' => 'Zentrale Abläufe und KI-gestützte Workflows',
                'best_for' => 'Wachsende Unternehmen, Agenturen, Logistikfirmen, Kliniken, Personalvermittlungen, SaaS-MVPs und E-Commerce-Betreiber.',
                'benefit' => 'Zentrale Abläufe, automatisierte Workflows und eine bessere Kundenerfahrung — auf einem skalierbaren Backend, das mit Ihrem Unternehmen wächst.',
                'problem' => 'Nicht verbundene Tools, manuelle Nachfassaktionen und ein fehlendes zentrales Dashboard bremsen Ihr Team aus. Leads, Kunden und Aufgaben gehen verloren. Jeder manuelle Schritt kostet Zeit und Geld.',
                'what_you_get' => 'Ein individuelles Laravel- oder NestJS-Backend mit Dashboards, Kundenportalen, Lead-Tracking, Integrationen und Workflow-Automatisierung — ergänzt durch praxisnahe KI in den täglichen Prozessen Ihres Teams.',
                'why_it_matters' => 'Wenn Abläufe zentralisiert und automatisiert sind, verbringt Ihr Team weniger Zeit mit wiederkehrender Administration und mehr Zeit mit Wachstum. Das System ist darauf ausgelegt, sich durch operative Hebel selbst zu finanzieren.',
                'before' => ['Nicht verbundene Tools', 'Manuelle Nachfassaktionen', 'Kein zentrales Dashboard', 'Langsame Abläufe', 'Keine Automatisierung', 'Fehler bei der Lead-Bearbeitung'],
                'after' => ['Zentrale Abläufe', 'Automatisierte Workflows', 'Kundenportal oder Admin-Dashboard', 'KI-gestützte Prozesse', 'Übersichtliches Reporting', 'Skalierbare Backend-Grundlage'],
                'deliverables' => ['Individuelles Laravel- oder NestJS-Backend', 'Authentifizierung und Benutzerrollen', 'Admin-Dashboards', 'Kundenportale', 'Buchungs- oder Anfragenverwaltung', 'CRM-Light-Workflows', 'Lead-Tracking', 'API-Integrationen', 'Workflow-Automatisierung', 'Analytics und Reporting', 'Produktions-Deployment', 'Sichere und skalierbare Backend-Architektur'],
                'ai_capabilities' => ['KI-Supportassistent', 'KI-Lead-Qualifizierung', 'KI-Workflow-Automatisierung', 'KI-Entwürfe für E-Mails oder Inhalte', 'KI-Dokumenten- und Suchwerkzeuge', 'KI-generierte Workflow-Zusammenfassungen'],
                'bonuses' => [
                    ['name' => 'Automatisierungs-Audit', 'value' => '$1,000+', 'why' => 'Identifiziert wiederkehrende Aufgaben und besonders wirksame Automatisierungschancen vor der Umsetzung.'],
                    ['name' => '90-Tage-Optimierungsplan', 'value' => '$1,000', 'why' => 'Priorisierte Roadmap zur Verbesserung Ihrer Abläufe nach dem Launch.'],
                    ['name' => '30 Tage Priority-Support', 'value' => '$1,000', 'why' => 'Priorisierte Fehlerbehebungen, Anpassungen und Stabilisierung nach dem Launch.'],
                    ['name' => 'Admin-Schulungssystem', 'value' => '$500', 'why' => 'Dokumentation und Loom-Anleitungen für Ihr Team.'],
                    ['name' => 'Launch-Optimierungssession', 'value' => '$500', 'why' => 'Review von UX, Workflows und Wachstumschancen nach dem Launch.'],
                ],
                'guarantees' => [
                    ['name' => 'Betriebsgarantie', 'detail' => 'Die Kernabläufe müssen vollständig funktionieren, bevor das Projekt als abgeschlossen gilt.'],
                    ['name' => 'Zeitplangarantie', 'detail' => 'Verzögert sich der Zeitplan durch meine Umsetzung, arbeite ich ohne Zusatzkosten weiter.'],
                    ['name' => 'Systemstabilitätsgarantie', 'detail' => 'Kritische Fehler, die innerhalb von 30 Tagen entdeckt werden, behebe ich ohne Zusatzkosten.'],
                    ['name' => 'Transparenzgarantie', 'detail' => 'Klare meilensteinbasierte Lieferung mit kontinuierlichen Fortschrittsberichten.'],
                ],
            ],
            'ai-operations-platform' => [
                'name' => 'KI-Operations-Plattform',
                'tagline' => 'Premium-Angebot',
                'promise' => 'KI-gestützte interne Plattformen für skalierende Unternehmen.',
                'timeline' => '1–3 Monate',
                'outcome' => 'Individuelle KI-gestützte Betriebsinfrastruktur',
                'best_for' => 'Finanzierte Start-ups, SaaS-Unternehmen, prozessintensive Teams, Unternehmen beim Ersatz interner Systeme und Teams mit Bedarf an KI-Infrastruktur.',
                'benefit' => 'Eine einheitliche, skalierbare und KI-gestützte Plattform, die fragmentierte Tools ersetzt und zum operativen Rückgrat Ihres Unternehmens wird.',
                'problem' => 'Fragmentierte Systeme, Skalierungsprobleme und zu viele SaaS-Tools schließen Daten ein und erzeugen hohen manuellen Aufwand. Ohne interne KI-Infrastruktur wird Wachstum immer teurer.',
                'what_you_get' => 'Eine Mehrbenutzerplattform mit erweiterten Berechtigungen, internen Dashboards, Workflow-Automatisierung, Zahlungs- und Abrechnungsintegrationen, API-Ökosystem und internen KI-Werkzeugen — vollständig dokumentiert und an Ihr Team übergeben.',
                'why_it_matters' => 'Eine maßgeschneiderte Plattform macht Abläufe zum Wettbewerbsvorteil. Sie skaliert ohne Neubau, erschließt operative Erkenntnisse und bereitet Ihr Unternehmen auf langfristiges Wachstum vor.',
                'before' => ['Fragmentierte Systeme', 'Skalierungsprobleme', 'Hoher manueller Aufwand', 'Zu viele SaaS-Tools', 'Daten in getrennten Systemen', 'Keine interne KI-Infrastruktur'],
                'after' => ['Einheitliche KI-Plattform', 'Skalierbare Architektur', 'Erweiterte Berechtigungen', 'KI-gestützte interne Werkzeuge', 'Operative Erkenntnisse', 'Zukunftsfähige Infrastruktur'],
                'deliverables' => ['Mehrbenutzer-Architektur', 'Erweiterte Rollen und Berechtigungen', 'Interne Dashboards', 'Workflow-Automatisierungsengine', 'Zahlungs- und Abrechnungsintegrationen', 'API-Ökosystem', 'Erweiterte Analytics', 'Monitoring und Logging', 'Entwicklungs-, Staging- und Produktionsumgebungen', 'Architekturdokumentation', 'Teamübergabe', 'Skalierbare Backend-Struktur'],
                'ai_capabilities' => ['Interne KI-Assistenten', 'Wissensdatenbank und KI-Suche', 'KI-Reporting und Erkenntnisgewinnung', 'KI-Dokumentenverarbeitung', 'Individuelle KI-Workflows', 'KI-Werkzeuge zur Entscheidungsunterstützung'],
                'bonuses' => [
                    ['name' => 'KI-Strategie-Workshop', 'value' => '$2,000', 'why' => 'Intensive Session zur Ermittlung von KI-Chancen und Plattformzielen.'],
                    ['name' => '60 Tage Priority-Support', 'value' => '$3,000', 'why' => 'Erweiterte Stabilisierung und dedizierter Support nach dem Launch.'],
                    ['name' => 'Skalierungs-Roadmap', 'value' => '$2,000', 'why' => 'Technische und geschäftliche Roadmap für zukünftiges Wachstum.'],
                    ['name' => 'Architekturdokumentation', 'value' => '$1,500', 'why' => 'Vollständige technische Dokumentation für Wartbarkeit und zukünftige Teams.'],
                    ['name' => 'Teamschulung und Übergabe', 'value' => '$1,000+', 'why' => 'Onboarding-Sessions, die Ihr Team zur eigenständigen Arbeit befähigen.'],
                ],
                'guarantees' => [
                    ['name' => 'Skalierungsgarantie', 'detail' => 'Die Plattformarchitektur unterstützt zukünftiges Wachstum, ohne von Grund auf neu gebaut zu werden.'],
                    ['name' => 'Lieferzusage', 'detail' => 'Strukturierte meilensteinbasierte Lieferung mit wöchentlichen Fortschrittsberichten.'],
                    ['name' => 'Sicherheitsgarantie', 'detail' => 'Bewährte Sicherheitspraktiken werden in der gesamten Plattform umgesetzt.'],
                    ['name' => 'Stabilitätsgarantie', 'detail' => 'Kritische Fehler innerhalb des vereinbarten Supportfensters werden ohne Zusatzkosten behoben.'],
                ],
            ],
        ];

        foreach ($translations as $slug => $german) {
            DB::table('services')->where('slug', $slug)->update([
                'translations' => json_encode(['de' => $german], JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    private function translateCaseStudies(): void
    {
        $translations = [
            'abc-hosting-legacy-modernization' => [
                'title' => 'Modernisierung einer Legacy-PHP-Hostingplattform mit Vue.js und Docker',
                'role' => 'Full-Stack-Entwickler',
                'period' => 'Nov. 2025 – heute',
                'location' => 'Belize City, Belize',
                'summary' => 'Migration einer monolithischen Legacy-Oberfläche zu komponentenbasiertem Vue.js, 85 % kürzere Ladezeiten, vollständige Dockerisierung und mehrsprachige sowie mehrwährungsfähige Unterstützung für 7 Länder.',
                'problem' => 'ABC Hosting trug jahrelange UI-Schulden in einer Legacy-PHP-Anwendung. Das Team brauchte schnellere Frontend-Entwicklung, verlässlichere Umgebungen und ein internationalisiertes Kauferlebnis, ohne die bestehende Plattform zu destabilisieren.',
                'approach' => ['Migration einer monolithischen Legacy-Oberfläche zu einer komponentenbasierten Vue.js-Architektur mit 85 % kürzerer Ladezeit.', 'Containerisierung des gesamten Anwendungsstacks mit Docker; die Einrichtungszeit sank von 2,5 Stunden auf unter 15 Minuten.', 'Reduzierung umgebungsspezifischer Fehler durch konsistente lokale und Deployment-Umgebungen.', 'Umsetzung von Mehrsprachigkeit und mehreren Währungen mit automatischer standortbasierter Währungserkennung.', 'Erweiterung der Produktreichweite auf 7 Länder durch lokalisierte Preise und Sprachen.'],
                'impact' => [['label' => 'Ladezeit', 'value' => '-85%'], ['label' => 'Einrichtungszeit', 'value' => '<15m'], ['label' => 'Unterstützte Märkte', 'value' => '7'], ['label' => 'Frontend', 'value' => 'Vue.js']],
                'highlights' => ['Abbau jahrelanger UI-Schulden durch eine wartbare Vue.js-Komponentenarchitektur.', 'Verkürzung der Entwickler-Einrichtung von 2,5 Stunden auf unter 15 Minuten mit Docker.', 'Lokalisierung des Kauferlebnisses für 7 Länder mit mehreren Sprachen und Währungen.'],
            ],
            'mintme-web3-platform' => [
                'title' => 'Skalierung einer Web3-Handelsplattform mit Echtzeit-Blockchain-Pipelines',
                'role' => 'Full-Stack-Entwickler',
                'period' => 'Juni 2024 – Dez. 2025',
                'location' => 'Belize City, Belize',
                'summary' => 'Über 100 Produktionsaufgaben in Symfony und Vue.js geliefert, JavaScript-Testabdeckung um 70 % erhöht, eine Node.js-Blockchain-Pipeline für mehr als 1.000 tägliche Transaktionen aufgebaut und Multi-Chain-Wallet-Integrationen umgesetzt.',
                'problem' => 'MintMe benötigte zuverlässige Lieferung auf einer produktiven Symfony- und Vue.js-Plattform und wollte gleichzeitig seine Web3-Funktionen erweitern. Blockchain-Ereignisse mussten in Echtzeit aufgenommen, gefiltert und für die weitere Transaktionsverarbeitung an Backend-Dienste übergeben werden.',
                'approach' => ['Über 100 Produktionsaufgaben geliefert, darunter mehr als 60 Features und 40 Fehlerbehebungen.', 'Mehr als 1.500 GitLab-Commits unter Beibehaltung sauberer Architektur und CI/CD-kompatiblen Codes.', 'JavaScript-Testabdeckung durch strukturierte Tests und Refactoring ungetesteter Legacy-Module um 70 % erhöht.', 'Node.js-Pipeline entwickelt, die On-Chain-Ereignisse in Echtzeit aufnimmt, filtert und strukturierte Payloads an Symfony-Middleware übergibt.', 'Verarbeitung von mehr als 1.000 täglichen Transaktionen über die Blockchain-Event-Pipeline ermöglicht.', 'Wallet-Integration für MetaMask, Solflare und mehr als 6 Blockchain-Netzwerke entwickelt.', 'Mehr als 3 Authentifizierungs- und Transaktionsszenarien einschließlich Edge Cases abgedeckt.'],
                'impact' => [['label' => 'Produktionsaufgaben', 'value' => '100+'], ['label' => 'Tägliche Transaktionen', 'value' => '1.000+'], ['label' => 'JS-Testabdeckung', 'value' => '+70%'], ['label' => 'GitLab-Commits', 'value' => '1.500+']],
                'highlights' => ['Echtzeitaufnahme von On-Chain-Ereignissen mit strukturierten Payloads für Symfony-Middleware.', 'Multi-Chain-Wallet-Unterstützung für MetaMask, Solflare und mehr als 6 Netzwerke.', 'Verbesserte Tests zur Reduzierung von Regressionen in einer komplexen Symfony-/Vue.js-Codebasis.'],
            ],
            'proace-ai-crm' => [
                'title' => 'KI-gestützter Chat und Support-Automatisierung in einem Laravel-CRM',
                'role' => 'Entwickler für KI-Integration',
                'period' => 'Juni 2025 – März 2026',
                'location' => 'Kanada / Remote',
                'summary' => 'KI-gestützten Chat und Support-Automatisierung in ein Laravel-CRM integriert, manuelle Supportantworten um 70 % reduziert und mehr als 30 KI-Endpunkte für das Frontend geliefert.',
                'problem' => 'Das CRM benötigte KI-gestützte Interaktionen in Echtzeit und Support-Automatisierung, damit Nutzer kontextbezogene Hilfe direkt im Produkt erhalten und der manuelle Supportaufwand sinkt.',
                'approach' => ['KI-gestützten Chat und technische Support-Automatisierung in ein Laravel-CRM integriert.', 'Manuelle Supportantworten durch KI-Interaktionen in Echtzeit um 70 % reduziert.', 'Backend-Logik für KI Assist, Support-Automatisierung und In-App-Chat umgesetzt.', 'Mehr als 30 KI-Endpunkte für das CRM-Frontend geliefert.', 'CRM-spezifische Automatisierungsabläufe entwickelt, die KI-Hilfe in bestehende Nutzerworkflows einbetten.'],
                'impact' => [['label' => 'Manuelle Antworten', 'value' => '-70%'], ['label' => 'KI-Endpunkte', 'value' => '30+'], ['label' => 'KI-Bereiche', 'value' => '3'], ['label' => 'Backend', 'value' => 'Laravel']],
                'highlights' => ['KI Assist, Support-Automatisierung und Chat direkt in CRM-Workflows integriert.', 'Mehr als 30 Backend-Endpunkte für KI-Interaktionen im Frontend.', 'Support-Automatisierung reduzierte manuelle Antworten um 70 %.'],
            ],
            'htdc-web-platform' => [
                'title' => 'Websites und E-Commerce-Inhalte für ein Gesundheitstourismus-Zentrum',
                'role' => 'Webentwickler',
                'period' => 'Mai 2022 – Sept. 2023',
                'location' => 'Maskat, Oman',
                'summary' => 'Unternehmenswebsites mit PHP, JavaScript, HTML und CSS entwickelt und gepflegt, organischen Traffic um 65 % gesteigert, 7 Leistungsseiten unterstützt und den Online-Kurskatalog um 5 Module erweitert.',
                'problem' => 'HTDC benötigte eine stärkere digitale Präsenz für seine Leistungsseiten und einen vollständigeren E-Commerce-Lernkatalog mit aufbereiteten und übersetzten Schulungsmaterialien.',
                'approach' => ['Unternehmenswebsites mit PHP, JavaScript, HTML und CSS entwickelt und gepflegt.', 'Organischen Traffic um 65 % gesteigert und die digitale Präsenz auf 7 Leistungsseiten unterstützt.', 'Bildungsmaterialien für die E-Commerce-Auslieferung vorbereitet und übersetzt.', 'Den verfügbaren Online-Katalog um 5 Module erweitert.'],
                'impact' => [['label' => 'Organischer Traffic', 'value' => '+65%'], ['label' => 'Leistungsseiten', 'value' => '7'], ['label' => 'Katalogmodule', 'value' => '+5'], ['label' => 'Kanal', 'value' => 'E-Commerce']],
                'highlights' => ['Website-Pflege und Weiterentwicklung auf 7 Leistungsseiten.', 'Mehr organischer Traffic durch stärkere Webpräsenz und UX-Arbeit.', 'Übersetzungsworkflow für E-Commerce-Kursmaterialien.'],
            ],
        ];

        foreach ($translations as $slug => $german) {
            DB::table('case_studies')->where('slug', $slug)->update([
                'translations' => json_encode(['de' => $german], JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    private function translateServiceProjects(): void
    {
        $translations = [
            'mahdieh-design' => [
                'tag' => 'Beispiel für einen Launch-Sprint',
                'summary' => 'Eine hochwertige öffentliche Website für eine Designmarke — mit klarer visueller Identität, Mobile-First-Präsentation und einem direkten Weg vom Besuch zur Anfrage.',
                'outcome' => 'Kundenorientierte Markenwebsite als fokussierter Sprint umgesetzt.',
            ],
            'cashpilot' => [
                'tag' => 'Beispiel für einen Operations-System-Sprint',
                'summary' => 'Ein Finanz-Operations-Workspace zur Verwaltung von Cashflow, Kategorien und täglichen Finanzentscheidungen mit praxisnahen Dashboards und klareren Transaktionsabläufen.',
                'outcome' => 'Persönliches Finanzsystem mit Dashboard-Workflows.',
            ],
            'ai-routine-coach' => [
                'tag' => 'Beispiel für eine KI-Operations-Plattform',
                'summary' => 'Ein Telegram-basierter KI-Routine-Coach, der persönliche Ziele in tägliche Planung, Anleitung und Gewohnheitsunterstützung innerhalb eines fokussierten Dialog-Workflows übersetzt.',
                'outcome' => 'Praxisnaher KI-Assistent in einem echten Nutzerworkflow.',
            ],
        ];

        foreach ($translations as $slug => $german) {
            DB::table('service_projects')->where('slug', $slug)->update([
                'translations' => json_encode(['de' => $german], JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    private function translateArticles(): void
    {
        $translations = [
            'vibe-coding-is-powerful-but-not-for-everyone-and-that-gap-will-cost-some-founders-dearly' => [
                'title' => 'Vibe Coding ist leistungsfähig — aber nicht für jeden. Diese Lücke kann Gründer teuer zu stehen kommen',
                'excerpt' => "Vibe Coding ist so leistungsfähig, weil Gründer damit schneller denn je arbeiten können. Aus einer einfachen Idee kann an einem Wochenende ein funktionierender Prototyp werden — ohne großes Team oder Budget.\n\nDoch Geschwindigkeit kann Risiken verdecken.\n\nProblematisch wird es, wenn Code veröffentlicht wird, den niemand lesen, prüfen oder absichern kann. Ein glänzendes MVP kann nach außen überzeugend wirken und darunter fehlerhafte Authentifizierung, offengelegte Daten, fragile Architektur und ungetestete Logik verbergen.\n\nKI-gestütztes Programmieren ist nicht das Problem. In den Händen erfahrener Entwickler ist es ein enormer Produktivitätshebel. Bei echten Produkten mit Nutzern, Daten oder Zahlungen bleibt technisches Urteilsvermögen jedoch unverzichtbar.\n\nDie entscheidende Frage ist nicht, ob KI schnelleres Bauen ermöglicht. Sondern ob Sie sich leisten können, was kaputtgeht, wenn niemand das Gebaute versteht.",
                'body' => "# Vibe Coding ist leistungsfähig — aber nicht für jeden\n\nKI-Werkzeuge haben die Distanz zwischen einer Idee und einem funktionierenden Prototyp drastisch verkürzt. Gründer können heute in wenigen Tagen testen, wofür früher ein ganzes Entwicklungsteam nötig war. Das ist ein echter Fortschritt.\n\nGeschwindigkeit ist jedoch nicht dasselbe wie Produktionsreife. Ein MVP kann gut aussehen und trotzdem unsichere Authentifizierung, ungeschützte Daten, unklare Berechtigungen, fehlende Tests oder eine Architektur enthalten, die schon bei den ersten echten Nutzern zusammenbricht.\n\n## Der gefährliche blinde Fleck\n\nDas größte Risiko entsteht, wenn niemand im Team den erzeugten Code zuverlässig lesen und bewerten kann. Dann werden KI-Antworten zu Entscheidungen, obwohl sie eigentlich nur Vorschläge sind. Fehler bleiben unsichtbar, bis Nutzer, Zahlungen oder sensible Daten betroffen sind.\n\nTypische Warnzeichen sind hart codierte Geheimnisse, zu weit gefasste Datenbankzugriffe, fehlende Autorisierungsprüfungen, unvalidierte Eingaben und Funktionen, die nur im idealen Ablauf getestet wurden.\n\n## KI ist ein Verstärker\n\nFür erfahrene Entwickler ist KI ein starker Multiplikator. Sie beschleunigt Gerüste, Tests, Dokumentation, Refactoring und die Untersuchung von Fehlern. Der Entwickler bleibt jedoch für Architektur, Sicherheit, Wartbarkeit und die Bewertung von Zielkonflikten verantwortlich.\n\nOhne diese Erfahrung verstärkt KI nicht nur Geschwindigkeit, sondern auch Fehlentscheidungen. Mehr Code bedeutet dann nicht automatisch mehr Produktwert.\n\n## Wann Vibe Coding sinnvoll ist\n\nFür interne Experimente, Wegwerf-Prototypen und frühe Validierung kann Vibe Coding hervorragend sein. Es hilft, Annahmen schnell zu prüfen und Gespräche mit Nutzern früher zu beginnen.\n\nSobald ein Produkt jedoch echte Konten, Kundendaten, Zahlungen, Rollen oder geschäftskritische Abläufe enthält, braucht es Engineering-Disziplin: Code-Review, Tests, Sicherheitsprüfungen, Monitoring und eine Architektur, die das Team versteht.\n\n## Die richtige Frage für Gründer\n\nFragen Sie nicht nur: Wie schnell können wir das bauen? Fragen Sie auch: Wer versteht es? Wer kann es sicher betreiben? Was passiert bei Fehlern? Und können wir in sechs Monaten noch zuverlässig darauf aufbauen?\n\nKI kann den Weg zum Produkt massiv beschleunigen. Sie ersetzt aber nicht die Verantwortung für das, was veröffentlicht wird. Der beste Ansatz verbindet die Geschwindigkeit von KI mit menschlichem Urteilsvermögen und sauberem Engineering.",
                'category' => 'KI',
            ],
            'why-most-businesses-automate-the-wrong-thing-first-and-what-to-do-instead' => [
                'title' => 'Warum die meisten Unternehmen zuerst das Falsche automatisieren — und was besser funktioniert',
                'excerpt' => "Die meisten Unternehmer wissen, dass sie etwas automatisieren sollten. Schwierig ist die Entscheidung, womit sie beginnen.\n\nAlles gleichzeitig zu automatisieren schafft meist mehr Verwirrung als Fortschritt. Besser ist es, das richtige Problem in der richtigen Reihenfolge zu wählen.\n\nBeginnen Sie mit der täglichen Wiederholung: Aufgaben, die Ihr Team jeden Tag mit denselben Schritten erledigt. Suchen Sie danach den teuren Fehler: langsame Antworten, menschliche Fehler oder verpasste Nachfassaktionen, die Geld kosten. Finden Sie zuletzt den Engpass, der Ihr Wachstum begrenzt.\n\nAutomatisierung ersetzt nicht Ihr Team. Sie entfernt wiederkehrende Arbeit, damit Menschen sich auf Urteilsvermögen, Beziehungen und Wachstum konzentrieren können.",
                'body' => "# Welche Geschäftsprobleme sollten Sie zuerst automatisieren?\n\nViele Unternehmen wissen, dass Automatisierung helfen kann, bleiben aber bei der Priorisierung stecken. Leads werden zu spät bearbeitet, Berichte kosten Stunden, Daten werden zwischen Systemen kopiert und das Onboarding läuft weiterhin manuell. Alles wirkt wichtig.\n\nDie Lösung ist nicht, alles gleichzeitig zu automatisieren. Suchen Sie zuerst nach drei Arten von Problemen und bearbeiten Sie sie in der richtigen Reihenfolge.\n\n## 1. Die tägliche Wiederholung\n\nBeginnen Sie mit Aufgaben, die regelmäßig nach exakt denselben Schritten ablaufen und kein menschliches Urteil benötigen. Beispiele sind tägliche Exporte, wiederkehrende Berichte, das Übertragen von Formularanfragen oder das Aktualisieren von Statuslisten.\n\nDiese Aufgaben sind der schnellste Einstieg. Eine einfache Kette aus Auslöser, Aktion und Ergebnis spart sofort Zeit und zeigt dem Team, dass Automatisierung praktisch funktioniert.\n\n## 2. Der teure Fehler\n\nAls Nächstes sollten Sie Prozesse automatisieren, bei denen langsame Reaktionen oder menschliche Fehler direkt Geld, Leads oder Kunden kosten. Dazu gehören verpasste Nachfassaktionen, lange Antwortzeiten, fehlerhafte Dateneingaben und häufig wiederholte Supportfragen.\n\nHier zahlt sich Automatisierung unmittelbar aus. Automatische Follow-ups können verlorene Leads zurückholen. Ein gut begrenzter KI-Supportassistent kann häufige Fragen in Minuten statt Stunden beantworten. Der Wert liegt nicht nur in gesparter Zeit, sondern in zurückgewonnenem Umsatz.\n\n## 3. Der Engpass\n\nDer dritte Kandidat ist der Prozess, der weiteres Wachstum verhindert. Oft wurde er so lange akzeptiert, dass er normal wirkt: Jede Freigabe läuft über den Gründer, wichtiges Wissen steckt im Kopf einer Person oder jedes neue Kundenkonto erfordert Stunden manueller Einrichtung.\n\nDie Automatisierung dieses Engpasses verändert die Skalierbarkeit des Unternehmens. Mehr Wachstum verlangt dann nicht mehr proportional mehr Personal, Druck und Koordination.\n\n## So wählen Sie die richtige Reihenfolge\n\nStarten Sie mit der täglichen Wiederholung, wenn Ihr Team unter Routinearbeit leidet oder Sie einen schnellen Proof of Concept brauchen.\n\nStarten Sie mit dem teuren Fehler, wenn aktuell Umsatz verloren geht, Antwortzeiten Kunden vertreiben oder die Kosten des Nichtstuns klar messbar sind.\n\nStarten Sie mit dem Engpass, wenn das Unternehmen wachsen will, die Abläufe aber nicht mithalten können oder Schlüsselpersonen ihre Zeit mit wiederholbaren Aufgaben verbringen.\n\n## Fünf hilfreiche Fragen\n\n1. Was erledigt Ihr Team täglich, das Software übernehmen könnte?\n2. Wo gehen Leads, Kunden oder Aufgaben verloren?\n3. Welche Werkzeuge sind schlecht miteinander verbunden?\n4. Wie viele Stunden pro Woche entfallen auf immer gleiche Schritte?\n5. Welcher perfekt automatisierte Prozess würde Ihr Unternehmen am stärksten verändern?\n\nAutomatisierung bedeutet nicht, Menschen zu ersetzen. Sie gibt ihnen Zeit für Aufgaben zurück, die wirklich menschliches Urteilsvermögen, Beziehungen und Kreativität benötigen. Die richtige Automatisierung spart nicht nur Zeit — sie macht das Unternehmen leichter zu führen und schwieriger zu überholen.",
                'category' => 'Automatisierung',
            ],
            'ai-is-changing-software-engineering-faster-than-most-people-expected' => [
                'title' => 'KI verändert Softwareentwicklung schneller, als die meisten erwartet haben',
                'excerpt' => "KI macht Softwareentwickler nicht nur schneller. Sie verändert, was technischer Wert bedeutet.\n\nWenn KI Aufgaben wie Scaffolding, Debugging, Tests, Dokumentation und Refactoring komprimiert, geht es in der Softwareentwicklung weniger um reine Umsetzungsgeschwindigkeit und stärker um Urteilsvermögen.\n\nAm meisten profitieren Entwickler, die architektonisch denken, Zielkonflikte bewerten, Systeme verstehen und KI zu zuverlässigen Lösungen führen können.\n\nSenior-Entwickler werden zu Multiplikatoren. Entwickler auf mittlerem Niveau müssen über Ticket-Umsetzung hinausgehen. Für Einsteiger steigt die Hürde, weil viele typische Anfängeraufgaben leichter automatisierbar werden.\n\nKI beendet Softwareentwicklung nicht. Sie definiert sie neu — rund um Hebelwirkung, Systemdenken und bessere Entscheidungen.",
                'body' => "# KI gestaltet Softwareentwicklung schneller um, als viele Unternehmen erkennen\n\nÜber Jahrzehnte stieg Produktivität in der Softwareentwicklung vor allem durch größere Teams, bessere Frameworks und leistungsfähigere Infrastruktur. KI verändert diese Gleichung grundlegend.\n\nDie wichtigste Wirkung ist nicht vollständig autonome Codegenerierung. Es ist die massive Verstärkung der Hebelwirkung einzelner Entwickler. Aufgaben, die früher Tage benötigten, lassen sich heute in Stunden erledigen. Kleine, erfahrene Teams können mit KI Ergebnisse liefern, für die früher deutlich mehr Personal nötig war.\n\n## Umsetzung ist nicht mehr der einzige Engpass\n\nViele klassische Tätigkeiten werden schneller: Gerüste erstellen, Fehler untersuchen, Dokumentation schreiben, Tests erzeugen, Legacy-Code refaktorieren und unbekannte Codebasen verstehen.\n\nDadurch wird reine Tipp- oder Umsetzungsgeschwindigkeit weniger entscheidend. Der neue Engpass ist technisches Urteilsvermögen: Welche Lösung passt? Welche Risiken entstehen? Was bleibt wartbar, sicher und skalierbar?\n\n## Warum Senior-Entwickler besonders profitieren\n\nKI braucht Richtung, Prüfung und Kontext. Erfahrene Entwickler erkennen Architekturfehler früh, bewerten Skalierungsrisiken, unterscheiden robuste Lösungen von kurzfristigen Patches und führen KI zu besseren Implementierungswegen.\n\nDeshalb werden starke Senior-Entwickler zu Multiplikatoren. Mit modernen Werkzeugen können sie die Wirkung deutlich größerer Teams erreichen, ohne Verantwortung und Qualitätskontrolle abzugeben.\n\n## Der Druck auf Mid-Level-Entwickler\n\nLange reichte es oft aus, Features zuverlässig mit bekannten Frameworks umzusetzen. KI verkleinert jedoch den Unterschied zwischen durchschnittlicher und sehr schneller Implementierung.\n\nWichtiger werden Systemdesign, Abwägung technischer Zielkonflikte, Zuverlässigkeit, Sicherheit, Kommunikation, Produktverständnis und operative Erfahrung. Wer sich ausschließlich über Umsetzung definiert, kann sich schwerer differenzieren.\n\n## Die schwierigere Realität für Einsteiger\n\nViele traditionelle Einstiegsaufgaben — CRUD-Funktionen, einfache Integrationen, grundlegendes Debugging und wiederholbare Geschäftslogik — gehören zu den Bereichen, in denen KI besonders schnell besser wird.\n\nJunior-Entwickler werden weiterhin gebraucht, aber die Einstiegshürde steigt. Fundamentale Informatikkenntnisse, Systemverständnis, Problemlösung, Kommunikation und ein verantwortungsvoller Umgang mit KI werden früher erwartet.\n\n## Vom Code-Schreiber zum Systemdenker\n\nDer zukünftige Wert von Entwicklern liegt stärker darin, Systeme zu entwerfen, Infrastrukturgrenzen zu verstehen, KI sinnvoll in Abläufe einzubetten und technische Entscheidungen mit Geschäftszielen zu verbinden.\n\nWenn der Zugang zu KI-Werkzeugen selbstverständlich wird, entsteht der Wettbewerbsvorteil nicht durch das Werkzeug selbst. Er entsteht durch bessere Entscheidungen, besseres Systemverständnis und gutes Urteilsvermögen unter Unsicherheit.\n\nKI beseitigt Softwareentwicklung nicht. Sie verändert, was einen wirksamen Entwickler ausmacht. Erfolgreich werden diejenigen sein, die technische Expertise, Architekturdenken, Geschäftsverständnis und KI-Hebel zu zuverlässigen Systemen verbinden.",
                'category' => 'KI',
            ],
        ];

        foreach ($translations as $slug => $german) {
            DB::table('articles')->where('slug', $slug)->update([
                'translations' => json_encode(['de' => $german], JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    private function translateRecommendations(): void
    {
        $translations = [
            'Artur Makowka' => [
                'role' => 'Gründer',
                'relationship' => 'Artur war direkter Vorgesetzter von Mohammadhosein',
                'body' => "Ich habe mit Mohammad Hosein (Mohi) bei MintMe / ABC Hosting zusammengearbeitet und ihn als zuverlässiges und verantwortungsbewusstes Teammitglied erlebt.\n\nMohi übernahm Verantwortung für seine Arbeit, kommunizierte gut mit seinen Kollegen und bemühte sich, Unklarheiten frühzeitig zu klären, damit das Team unnötige Konflikte vermeiden und in die richtige Richtung arbeiten konnte.\n\nEr ist fleißig, offen für Feedback und jederzeit bereit, bei Bedarf Neues zu lernen. Ich bin überzeugt, dass er für jedes Team eine wertvolle Verstärkung wäre.",
            ],
            'Andrew Khopta' => [
                'role' => 'Full-Stack-Entwickler',
                'relationship' => 'War Senior-Kollege von Mohammadhosein, jedoch nicht sein direkter Vorgesetzter',
                'body' => "Ich habe mit Mohammed bei MintMe zusammengearbeitet, hauptsächlich an Frontend- und Backend-Aufgaben im selben Projekt.\n\nMohammed war ein zuverlässiger Teamkollege, dem ich seinen Teil der Arbeit anvertrauen konnte. Er arbeitete sicher mit PHP, Symfony, Vue.js und verwandten Webentwicklungsthemen und ging Probleme gewöhnlich pragmatisch an, ohne sie unnötig zu verkomplizieren.\n\nBesonders angenehm war seine klare Kommunikation. Bei Unklarheiten stellte er Fragen und war offen für Feedback. Auch unter Druck blieb er ruhig — eine wertvolle Eigenschaft in echten Projekten.\n\nInsgesamt habe ich sehr gerne mit Mohammed gearbeitet und empfehle ihn als zuverlässigen Entwickler und Teamkollegen.",
            ],
            'Denis Levadnyuk' => [
                'role' => 'Full-Stack-Entwickler',
                'relationship' => 'War Senior-Kollege von Mohammadhosein, jedoch nicht sein direkter Vorgesetzter',
                'body' => "Ich hatte das Vergnügen, mit Mohi bei MintMe an verschiedenen Backend- und Frontend-Aufgaben zusammenzuarbeiten.\n\nMohi ist ein zuverlässiger PHP-Full-Stack-Entwickler mit solider Erfahrung in Symfony, Vue.js und moderner Webentwicklung. Er arbeitet verantwortungsbewusst, kommuniziert klar und unterstützt das Team dabei, praktische Lösungen zu finden.\n\nBesonders schätzte ich seine ruhige Art, seine Lernbereitschaft und seinen beständigen Fokus auf qualitativ hochwertige Ergebnisse. Ich empfehle Mohi gerne jedem Team, das einen kompetenten und verlässlichen Entwickler sucht.",
            ],
            'Younes Himmi' => [
                'role' => 'Full-Stack-Entwickler',
                'relationship' => 'War Senior-Kollege von Mohammadhosein, jedoch nicht sein direkter Vorgesetzter',
                'body' => 'Ich habe sehr gerne mit Mohammed bei MintMe gearbeitet. Er verfügt über starkes technisches Wissen und liefert durchgehend gute Arbeit. Die Kommunikation mit ihm ist unkompliziert und ihm liegt die Unterstützung des Teams wirklich am Herzen.',
            ],
            'Mohamed Tarek' => [
                'role' => 'Full-Stack-Entwickler',
                'relationship' => 'Arbeitete mit Mohammadhosein im selben Team',
                'body' => 'Mohammed brachte Fokus, Zuverlässigkeit und eine lösungsorientierte Denkweise ein, die während des gesamten Projekts einen echten Unterschied machte. Jedes Team kann sich glücklich schätzen, ihn dabeizuhaben.',
            ],
            'Mahmoud Mohamed' => [
                'role' => 'Full-Stack-Entwickler',
                'relationship' => 'Arbeitete mit Mohammadhosein im selben Team',
                'body' => "Ich hatte das Vergnügen, mit Mohammed bei MintMe im selben Projekt an mehreren Backend- und Frontend-Aufgaben zusammenzuarbeiten.\n\nMohammed ist ein starker Full-Stack-Entwickler mit solider Erfahrung in PHP, Symfony, Node.js und Vue.js. Er lieferte zuverlässig saubere Lösungen und zeigte ein sehr gutes Verständnis für skalierbare Anwendungsarchitektur, API-Integrationen und die Lösung komplexer Probleme.\n\nNeben seinen technischen Fähigkeiten war Mohammed kooperativ, proaktiv und angenehm in der Zusammenarbeit. Er kommunizierte klar, ging professionell mit Herausforderungen um und konzentrierte sich stets auf hochwertige Ergebnisse.\n\nIch habe die Zusammenarbeit sehr geschätzt und empfehle Mohammed jedem Team, das einen kompetenten und zuverlässigen Entwickler sucht.",
            ],
            'Lucia Lugo' => [
                'role' => 'Personalwesen',
                'relationship' => 'Arbeitete mit Mohammadhosein in einem anderen Team',
                'body' => 'Mohi war stets professionell, kooperativ und angenehm in der Zusammenarbeit. Er kommunizierte gut mit dem Team, nahm seine Verantwortung ernst und zeigte bei neuen Herausforderungen große Bereitschaft, zu lernen und sich weiterzuentwickeln. Während unserer Zusammenarbeit bewahrte er eine positive Haltung und passte sich gut an unterschiedliche Situationen und Teambedürfnisse an.',
            ],
        ];

        foreach ($translations as $name => $german) {
            DB::table('recommendations')->where('name', $name)->update([
                'translations' => json_encode(['de' => $german], JSON_UNESCAPED_UNICODE),
            ]);
        }
    }
};
