/**
 * Mock data for screenshot mode (CI/GitHub Actions)
 * Used when external APIs are not available
 */

export const MOCK_GITHUB_USER = {
  login: 'm-idriss',
  id: 12345678,
  avatar_url: 'https://avatars.githubusercontent.com/u/12345678?v=4',
  html_url: 'https://github.com/m-idriss',
  name: 'Idriss',
  bio: '💡 Building AI-powered SaaS | Full-stack dev | Angular & Quarkus',
  location: 'Earth 🌍',
  public_repos: 28,
  email: 'idriss@3dime.com'
};

export const MOCK_SOCIAL_LINKS = [
  {
    provider: 'github',
    url: 'https://github.com/m-idriss'
  },
  {
    provider: 'linkedin',
    url: 'https://linkedin.com/in/idriss'
  },
  {
    provider: 'twitter',
    url: 'https://twitter.com/m_idriss'
  }
];

export const MOCK_COMMIT_DATA = [
  { date: Date.now() - 86400000 * 60, value: 12 },
  { date: Date.now() - 86400000 * 59, value: 8 },
  { date: Date.now() - 86400000 * 58, value: 15 },
  { date: Date.now() - 86400000 * 57, value: 0 },
  { date: Date.now() - 86400000 * 56, value: 6 },
  { date: Date.now() - 86400000 * 55, value: 10 },
  { date: Date.now() - 86400000 * 54, value: 18 },
  { date: Date.now() - 86400000 * 53, value: 22 },
  { date: Date.now() - 86400000 * 52, value: 14 },
  { date: Date.now() - 86400000 * 51, value: 9 },
  { date: Date.now() - 86400000 * 50, value: 11 },
  { date: Date.now() - 86400000 * 49, value: 5 },
];

export const MOCK_RELEASES = [
  {
    tag_name: 'v2.1.0',
    html_url: 'https://github.com/m-idriss/3dime-angular/releases/tag/v2.1.0',
    name: 'AI Converter v2.1 - Enhanced UI',
    published_at: '2026-03-15T10:30:00Z'
  },
  {
    tag_name: 'v2.0.0',
    html_url: 'https://github.com/m-idriss/3dime-angular/releases/tag/v2.0.0',
    name: 'Major Redesign',
    published_at: '2026-02-28T14:20:00Z'
  }
];

export const MOCK_NOTION_CONTENT = {
  tools: [
    { title: 'Angular 20+', description: 'Modern frontend framework', category: 'Frontend' },
    { title: 'Quarkus', description: 'Lightning-fast Java framework', category: 'Backend' },
    { title: 'Google Cloud Run', description: 'Serverless deployment', category: 'DevOps' },
    { title: 'Firebase', description: 'Real-time database & auth', category: 'Backend' }
  ],
  resources: [
    { title: 'API Documentation', url: 'https://api.3dime.com/api-docs', category: 'Docs' },
    { title: 'Source Code', url: 'https://github.com/m-idriss', category: 'GitHub' },
    { title: 'Blog', url: 'https://3dime.com/blog', category: 'Blog' }
  ]
};
