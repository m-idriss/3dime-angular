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

const MOCK_COMMIT_BASE_DATE = new Date('2026-01-01').getTime();
const MOCK_COMMIT_VALUES = [
  3, 0, 5, 12, 8, 0, 2, 7, 15, 4, 0, 9, 6, 1, 11, 3, 0, 8, 14, 5,
  2, 0, 7, 10, 3, 6, 0, 4, 9, 2, 0, 13, 5, 1, 7, 0, 3, 11, 8, 2,
  0, 6, 4, 10, 1, 5, 0, 9, 3, 7, 2, 0, 12, 5, 4, 8, 1, 0, 6, 3,
  10, 2, 0, 7, 5, 1, 4, 0, 9, 3, 6, 2, 0, 8, 4, 11, 1, 5, 0, 3,
  7, 2, 0, 6, 4, 10, 1, 5, 0, 9, 3, 7, 2, 0, 8, 4, 11, 1, 5, 0,
  3, 7, 2, 0, 6, 4, 10, 1, 5, 0, 9, 3, 7, 2, 0, 8, 4, 11, 1, 5,
  14, 0, 3, 8, 2, 6, 1, 0, 10, 4, 7, 3, 0, 5, 9, 2, 1, 0, 6, 4,
  11, 3, 0, 7, 5, 2, 0, 8, 4, 10, 1, 5, 0, 9, 3, 7, 2, 0, 6, 4,
  12, 1, 5, 0, 3, 8, 2, 0, 7, 4, 10, 1, 5, 0, 9, 3, 6, 2, 0, 8,
];
export const MOCK_COMMIT_DATA = Array.from({ length: 180 }, (_, i) => ({
  date: MOCK_COMMIT_BASE_DATE + 86400000 * i,
  value: MOCK_COMMIT_VALUES[i] ?? 0,
}));

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

export const MOCK_TECH_STACK = [
  // Frontend
  { name: 'Angular', category: 'Frontend', proficiency: 95, icon: '⚙️' },
  { name: 'TypeScript', category: 'Frontend', proficiency: 92, icon: '📘' },
  { name: 'SCSS/CSS3', category: 'Frontend', proficiency: 88, icon: '🎨' },
  { name: 'RxJS', category: 'Frontend', proficiency: 90, icon: '⚡' },
  { name: 'Angular CDK', category: 'Frontend', proficiency: 85, icon: '📦' },

  // Backend
  { name: 'Java 21', category: 'Backend', proficiency: 94, icon: '☕' },
  { name: 'Quarkus', category: 'Backend', proficiency: 92, icon: '⚡' },
  { name: 'REST APIs', category: 'Backend', proficiency: 95, icon: '🔌' },
  { name: 'Spring Boot', category: 'Backend', proficiency: 88, icon: '🍃' },
  { name: 'Maven', category: 'Backend', proficiency: 90, icon: '📦' },

  // Databases
  { name: 'PostgreSQL', category: 'Database', proficiency: 82, icon: '🐘' },

  // DevOps & Cloud
  { name: 'Google Cloud', category: 'DevOps', proficiency: 89, icon: '☁️' },
  { name: 'Cloud Run', category: 'DevOps', proficiency: 90, icon: '🚀' },
  { name: 'Docker', category: 'DevOps', proficiency: 85, icon: '🐳' },
  { name: 'GitHub Actions', category: 'DevOps', proficiency: 88, icon: '⚙️' },

  // Tools & Other
  { name: 'Git', category: 'Tools', proficiency: 95, icon: '📚' },
  { name: 'AWS', category: 'Cloud', proficiency: 80, icon: '☁️' },
  { name: 'AI/LLMs', category: 'AI', proficiency: 87, icon: '🤖' }
];

export const MOCK_EXPERIENCE = [
  {
    title: 'Full-Stack Engineer',
    company: '3dime.com',
    period: '2025 - Present',
    description: 'Building AI-powered image-to-calendar SaaS with Angular & Quarkus',
    skills: ['Angular', 'TypeScript', 'Quarkus', 'Google Cloud']
  },
  {
    title: 'Senior Frontend Developer',
    company: 'PhotoCalia',
    period: '2024 - 2025',
    description: 'Led frontend architecture and performance optimization',
    skills: ['Angular', 'RxJS', 'SCSS', 'Testing', 'PWA']
  },
  {
    title: 'Backend Developer',
    company: 'Cloud Tech Solutions',
    period: '2023 - 2024',
    description: 'Developed scalable REST APIs using Quarkus and Spring Boot',
    skills: ['Java', 'Quarkus', 'Databases', 'Docker', 'AWS']
  }
];

export const MOCK_EDUCATION = [
  {
    degree: 'Computer Science',
    institution: 'Tech University',
    year: '2022',
    details: 'Focus on full-stack development and cloud architecture'
  },
  {
    degree: 'Advanced Java Development',
    institution: 'Oracle Academy',
    year: '2021',
    details: 'Enterprise Java applications and design patterns'
  }
];

export const MOCK_HOBBIES = [
  { hobby: 'Open Source Contribution', emoji: '🤝', description: 'Active contributor to Angular and Quarkus ecosystems' },
  { hobby: 'AI/ML Exploration', emoji: '🤖', description: 'Experimenting with LLMs and AI integration' },
  { hobby: 'Technical Writing', emoji: '✍️', description: 'Writing blog posts about full-stack development' },
  { hobby: 'Hiking & Travel', emoji: '🏔️', description: 'Exploring new places and remote work locations' },
  { hobby: 'Music Production', emoji: '🎵', description: 'Creating electronic music in spare time' }
];

export const MOCK_NOTION_CONTENT = {
  tools: [
    { title: 'Angular 20+', description: 'Modern frontend framework', category: 'Frontend' },
    { title: 'Quarkus', description: 'Lightning-fast Java framework', category: 'Backend' },
    { title: 'Google Cloud Run', description: 'Serverless deployment', category: 'DevOps' },
    { title: 'Docker', description: 'Container orchestration', category: 'DevOps' },
    { title: 'TypeScript', description: 'Type-safe JavaScript', category: 'Frontend' },
    { title: 'PostgreSQL', description: 'Relational database', category: 'Backend' },
    { title: 'RxJS', description: 'Reactive programming library', category: 'Frontend' }
  ],
  resources: [
    { title: 'API Documentation', url: 'https://api.3dime.com/api-docs', category: 'Docs' },
    { title: 'Source Code', url: 'https://github.com/m-idriss', category: 'GitHub' },
    { title: 'Blog', url: 'https://3dime.com/blog', category: 'Blog' },
    { title: 'LinkedIn Profile', url: 'https://linkedin.com/in/idriss', category: 'Social' },
    { title: 'Portfolio', url: 'https://3dime.com', category: 'Portfolio' }
  ]
};
