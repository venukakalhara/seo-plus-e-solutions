export const site = {
  name: 'SEO PLUS',
  description: 'Thoughtful websites, search strategy and digital solutions. Build a stronger digital presence with SEO PLUS E-Solutions.',
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, ''),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '94779713652').replace(/\D/g, ''),
};

export const articles = [
  { slug: 'a-better-website-brief', category: 'WEB STRATEGY', title: 'A better website starts with better questions.', summary: 'A practical starting point for your next digital project.', paragraphs: ['Before choosing colours or technology, decide what your website should help people do. A clear primary action gives every page a purpose.', 'Write down who your visitors are, what they need to know, and what might stop them taking the next step. Use those answers to shape navigation and content.', 'Bring your existing brand assets, content, examples and constraints into the brief. Agree on scope and success measures before development starts.'] },
  { slug: 'seo-foundations', category: 'SEARCH & CONTENT', title: 'Build your search foundations before chasing rankings.', summary: 'Useful content, clear structure and a technically sound website.', paragraphs: ['Start with the questions your customers actually ask. Create helpful pages that answer those questions clearly, with descriptive headings and page titles.', 'Make important pages easy to reach through meaningful internal links. Check that search engines can access the pages you want discovered.', 'Search performance takes time and depends on many factors. Review useful signals such as relevant enquiries and content engagement rather than promising a particular ranking.'] },
  { slug: 'automate-the-right-things', category: 'BUSINESS AUTOMATION', title: 'Less repetitive work. More room to grow.', summary: 'How to spot the workflows worth simplifying first.', paragraphs: ['Map a recurring task from start to finish. Look for repeated data entry, manual reminders and information moving between disconnected tools.', 'Choose one small workflow with clear inputs, a defined outcome and an owner. Keep a manual fallback and decide how errors will be handled.', 'Measure time saved and check output quality before expanding. Useful automation supports the people doing the work.'] },
];
