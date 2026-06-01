<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $recommendations = [
            [
                'name' => 'Artur Makowka',
                'role' => 'Founder',
                'company' => 'ABC Hosting LTD',
                'relationship' => 'Artur managed Mohammadhosein directly',
                'project' => 'MintMe',
                'recommended_at' => '2026-05-19',
                'sort_order' => 10,
                'body' => <<<'TEXT'
I worked with Mohammad Hosein (Mohi) at MintMe / ABC Hosting and found him to be a reliable and responsible team member.

Mohi took ownership of his work, communicated well with colleagues, and made an effort to clarify issues early so the team could avoid unnecessary conflicts and move in the right direction.

He is hardworking, open to feedback, and always willing to learn new things when needed. I believe he would be a valuable addition to any team.
TEXT,
            ],
            [
                'name' => 'Andrew Khopta',
                'role' => 'Full-stack developer',
                'company' => 'ABC Hosting LTD',
                'relationship' => 'Was senior to Mohammadhosein but did not manage Mohammadhosein directly',
                'project' => 'MintMe',
                'recommended_at' => '2026-05-26',
                'sort_order' => 20,
                'body' => <<<'TEXT'
I worked with Mohammed at MintMe, mostly on frontend and backend tasks around the same project.

Mohammed was a reliable teammate and someone I could trust with his part of the work. He was comfortable working with PHP, Symfony, Vue.js, and related web development tasks, and he usually approached problems in a practical way instead of overcomplicating things.

What I liked about working with him was that he communicated clearly, asked questions when something was unclear, and was open to feedback. He was also calm under pressure, which is always valuable in real project work.

Overall, I had a good experience working with Mohammed and would recommend him as a dependable developer and teammate.
TEXT,
            ],
            [
                'name' => 'Denis Levadnyuk',
                'role' => 'Full-stack developer',
                'company' => 'ABC Hosting LTD',
                'relationship' => 'Was senior to Mohammadhosein but did not manage Mohammadhosein directly',
                'project' => 'MintMe',
                'recommended_at' => '2026-05-20',
                'sort_order' => 30,
                'body' => <<<'TEXT'
I had the pleasure of working with Mohi at MintMe, where we collaborated on different backend and frontend tasks.

Mohi is a reliable PHP full-stack developer with solid experience in Symfony, Vue.js, and modern web development. He approaches tasks responsibly, communicates clearly, and is always ready to help the team find practical solutions.

What I appreciated most was his calm attitude, willingness to learn, and consistent focus on delivering quality work. I would gladly recommend Mohi to any team looking for a dependable and skilled developer.
TEXT,
            ],
            [
                'name' => 'Younes Himmi',
                'role' => 'Full-stack developer',
                'company' => 'ABC Hosting LTD',
                'relationship' => 'Was senior to Mohammadhosein but did not manage Mohammadhosein directly',
                'project' => 'MintMe',
                'recommended_at' => '2026-05-17',
                'sort_order' => 40,
                'body' => <<<'TEXT'
I really enjoyed working with Mohammed at MintMe. He knows his stuff technically and always delivers good work. He's easy to communicate with and genuinely cares about supporting the rest of the team.
TEXT,
            ],
            [
                'name' => 'Mohamed Tarek',
                'role' => 'Full-stack developer',
                'company' => 'ABC Hosting LTD',
                'relationship' => 'Worked with Mohammadhosein on the same team',
                'project' => 'MintMe',
                'recommended_at' => '2026-05-18',
                'sort_order' => 50,
                'body' => <<<'TEXT'
Mohammed brought focus, reliability, and a problem-solving mindset that made a real difference throughout the project. Any team would be lucky to have him.
TEXT,
            ],
            [
                'name' => 'Mahmoud Mohamed',
                'role' => 'Full-stack developer',
                'company' => 'ABC Hosting LTD',
                'relationship' => 'Worked with Mohammadhosein on the same team',
                'project' => 'MintMe',
                'recommended_at' => '2026-05-16',
                'sort_order' => 60,
                'body' => <<<'TEXT'
I had the pleasure of working with Mohammed at MintMe, where we collaborated on the same project across multiple backend and frontend tasks.

Mohammed is a strong full-stack developer with solid experience in PHP, Symfony, Node.js, and Vue.js. He consistently delivered clean, reliable solutions and showed great understanding of scalable application architecture, API integrations, and problem-solving in complex scenarios.

Beyond his technical skills, Mohammed was collaborative, proactive, and easy to work with. He communicated clearly with the team, handled challenges professionally, and always focused on delivering high-quality results.

I truly enjoyed working together and would confidently recommend Mohammed to any team looking for a skilled and dependable engineer.
TEXT,
            ],
            [
                'name' => 'Lucia Lugo',
                'role' => 'Human Resource',
                'company' => 'ABC Hosting LTD',
                'relationship' => 'Worked with Mohammadhosein but on different teams',
                'project' => 'MintMe',
                'recommended_at' => '2026-05-19',
                'sort_order' => 70,
                'body' => <<<'TEXT'
Mohi was always professional, cooperative, and pleasant to work with. He communicated well with the team, handled his responsibilities seriously, and showed a strong willingness to learn and grow when facing new challenges. He maintained a positive attitude throughout our collaboration and adapted well to different situations and team needs.
TEXT,
            ],
        ];

        foreach ($recommendations as $recommendation) {
            DB::table('recommendations')->updateOrInsert(
                [
                    'name' => $recommendation['name'],
                    'recommended_at' => $recommendation['recommended_at'],
                ],
                [
                    ...$recommendation,
                    'image_path' => null,
                    'linkedin_url' => null,
                    'is_published' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
            );
        }
    }

    public function down(): void
    {
        // Keep user-edited recommendation content and future image additions intact.
    }
};
