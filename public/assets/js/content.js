/* =========================
   Content Loading and Rendering
   ========================= */

import { CONFIG } from './config.js';
import { loadHeatmapWithRetry } from './heatmap.js';
import { setupLogoReload, setupBurgerMenu, setupBackToTop } from './ui.js';

/* =========================
   Security Utilities
   ========================= */
function sanitizeUrl(url) {
  try {
    const urlObj = new URL(url);
    // Only allow http, https, and mailto protocols
    if (!['http:', 'https:', 'mailto:'].includes(urlObj.protocol)) {
      console.warn('Invalid protocol:', urlObj.protocol);
      return '#';
    }
    return urlObj.toString();
  } catch (error) {
    console.warn('Invalid URL:', url);
    return '#';
  }
}

function sanitizeText(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export async function loadContent() {
  let ldData;
  try {
    // Try to load from external .jsonld file first
    try {
      const response = await fetch('./structured-data.jsonld');
      if (response.ok) {
        ldData = await response.json();
      } else {
        throw new Error(`Failed to fetch .jsonld file: ${response.status}`);
      }
    } catch (fetchError) {
      console.warn('Failed to load external .jsonld file, falling back to embedded JSON-LD:', fetchError);
      
      // Fallback to embedded JSON-LD structured data
      const ldJsonScript = document.querySelector('script[type="application/ld+json"]');
      if (!ldJsonScript) {
        throw new Error('Neither external .jsonld file nor embedded JSON-LD found');
      }
      ldData = JSON.parse(ldJsonScript.textContent);
    }
  } catch (error) {
    // Display a user-friendly error message or fallback content
    const main = document.querySelector(CONFIG.SELECTORS.CARDS_CONTAINER);
    main.innerHTML = '<div class="error-message">Failed to load content. Please try again later.</div>';
    console.error('Error loading content:', error);
    return;
  }

  const main = document.querySelector(CONFIG.SELECTORS.CARDS_CONTAINER);
  main.innerHTML = ''; // Clear existing content before loading new content

  // Create first column with profile, about, and tech stack
  const firstColumn = document.createElement('div');
  firstColumn.classList.add('group-column');

  // Profile section
  const profileSection = createProfileSection(ldData);
  firstColumn.appendChild(profileSection);

  // About section  
  const aboutSection = createAboutSection(ldData);
  firstColumn.appendChild(aboutSection);

  // Tech stack section
  const techSection = createTechStackSection(ldData);
  firstColumn.appendChild(techSection);

  main.appendChild(firstColumn);

  // Create second column with GitHub heatmap, experience, and education
  const secondColumn = document.createElement('div');
  secondColumn.classList.add('group-column');

  // GitHub heatmap section
  const heatmapSection = createHeatmapSection();
  secondColumn.appendChild(heatmapSection);

  // Experience section
  const experienceSection = createExperienceSection(ldData);
  secondColumn.appendChild(experienceSection);

  // Education section
  const educationSection = createEducationSection(ldData);
  secondColumn.appendChild(educationSection);

  main.appendChild(secondColumn);

  // Create third column with stuff, hobbies, and contact
  const thirdColumn = document.createElement('div');
  thirdColumn.classList.add('group-column');

  // Stuff section
  const stuffSection = createStuffSection(ldData);
  thirdColumn.appendChild(stuffSection);

  // Hobbies section
  const hobbiesSection = createHobbiesSection(ldData);
  thirdColumn.appendChild(hobbiesSection);

  // Contact section
  const contactSection = createContactSection(ldData);
  thirdColumn.appendChild(contactSection);

  main.appendChild(thirdColumn);

  // Load heatmap if container exists
  const heatmapContainer = document.getElementById(CONFIG.SELECTORS.HEATMAP_CONTAINER.slice(1));
  if (heatmapContainer) {
    loadHeatmapWithRetry();
  }
  
  setupLogoReload();
  setupBurgerMenu();
  setupBackToTop();
}

function createProfileSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'profile');
  container.id = 'profile-section';

  let html = `<header class="profile-header">`;
  html += `<img src="assets/logo.png" alt="Logo" class="logo">`;
  
  // Add simplified burger menu (without language toggle)
  html += `
    <div class="burger-menu">
      <button class="burger-button" id="burger-btn" aria-label="Profile options">
        <i class="fas fa-ellipsis-v"></i>
      </button>
      <div class="profile-dropdown" id="profile-dropdown" role="menu" aria-labelledby="burger-btn">
        <button class="dropdown-item theme-toggle" id="theme-toggle" role="menuitem" aria-label="Cycle theme mode">
          <i class="fas fa-moon" aria-hidden="true"></i>
          <span>Dark Theme</span>
        </button>

        <div class="dropdown-separator" role="separator"></div>
        <button class="dropdown-item video-bg-toggle" id="video-bg-toggle" role="menuitem" aria-label="Cycle background mode">
          <i class="fas fa-circle" aria-hidden="true"></i>
          <span>Dark Background</span>
        </button>

        <div class="dropdown-separator" role="separator"></div>
        <button class="dropdown-item font-size-toggle" id="font-size-toggle" role="menuitem" aria-label="Change font size">
          <i class="fas fa-text-height" aria-hidden="true"></i>
          <span>Font Size: Normal</span>
        </button>
      </div>
    </div>
  `;
  
  html += `</header>`;
  html += `<h2>✨ ${sanitizeText(ldData.givenName)} ✨</h2>`;

  // Create social links from sameAs array
  html += `<div class="socials">`;
  
  const socialConfig = [
    { url: 'github.com', iconClass: 'fa-brands fa-github', name: 'GitHub' },
    { url: 'linkedin.com', iconClass: 'fa-brands fa-linkedin', name: 'LinkedIn' },
    { url: 'x.com', iconClass: 'fa-brands fa-x-twitter', name: 'Twitter' },
    { url: 'facebook.com', iconClass: 'fa-brands fa-facebook-square', name: 'Facebook' },
    { url: 'instagram.com', iconClass: 'fa-brands fa-instagram', name: 'Instagram' }
  ];

  ldData.sameAs.forEach(url => {
    const config = socialConfig.find(c => url.includes(c.url));
    if (config) {
      html += `<a href="${sanitizeUrl(url)}" target="_blank" rel="noopener noreferrer">`;
      html += `<i class="fa ${config.iconClass}" aria-hidden="true"></i>`;
      html += `</a>`;
    }
  });

  html += `</div>`;
  
  container.innerHTML = html;
  return container;
}

function createAboutSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'about');

  let html = `<h2>About Me</h2>`;
  html += `<p>${sanitizeText(ldData.description)}</p>`;
  
  container.innerHTML = html;
  return container;
}

function createTechStackSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'technologies');

  let html = `<h2>Tech Stack</h2>`;
  html += `<p>Some of the technologies I worked with.</p>`;

  html += ldData.knowsAbout.map(tech => {
    return `<a href="${sanitizeUrl(tech.url)}" target="_blank" rel="noopener noreferrer" class="chip-little link">${sanitizeText(tech.name)}</a>`;
  }).join('');
  
  container.innerHTML = html;
  return container;
}

function createHeatmapSection() {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'heatmap');

  let html = `<h2>Github Activity</h2>`;
  html += `<div id="heatmap-container" class="heatmap-container">
    <div class="loading-container" role="status" aria-live="polite">
      <div class="spinner" aria-label="Loading heatmap">
        <div class="spinner-circle"></div>
      </div>
      <p>Loading GitHub activity...</p>
    </div>
  </div>`;

  container.innerHTML = html;
  return container;
}

function createExperienceSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'experience');

  let html = `<h2>Experience & Projects</h2>`;
  html += `<p>Companies and projects I've contributed to.</p>`;

  html += ldData.workExperience.map(item => {
    return `<a href="${sanitizeUrl(item.url)}" target="_blank" rel="noopener noreferrer" class="link">${sanitizeText(item.name)}</a>`;
  }).join('');
  
  container.innerHTML = html;
  return container;
}

function createEducationSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'education');

  let html = `<h2>Education & Training</h2>`;
  html += `<p>From Energy learning to IT retraining.</p>`;

  html += ldData.alumniOf.map(item => {
    return `<a href="${sanitizeUrl(item.url)}" target="_blank" rel="noopener noreferrer" class="link">${sanitizeText(item.name)}</a>`;
  }).join('');
  
  container.innerHTML = html;
  return container;
}

function createStuffSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'stuff');

  let html = `<h2>Stuff</h2>`;
  html += `<p>Stuff I use and recommend.</p>`;

  html += ldData.owns.map(item => {
    return `<a href="${sanitizeUrl(item.url)}" target="_blank" rel="noopener noreferrer" class="link">${sanitizeText(item.name)}</a>`;
  }).join('');
  
  container.innerHTML = html;
  return container;
}

function createHobbiesSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'hobbies');

  let html = `<h2>Hobbies & Interests</h2>`;
  html += `<p>Things I enjoy watching/doing.</p>`;

  html += ldData.hobbies.map(item => {
    return `<a href="${sanitizeUrl(item.url)}" target="_blank" rel="noopener noreferrer" class="chip-little link">${sanitizeText(item.name)}</a>`;
  }).join('');
  
  container.innerHTML = html;
  return container;
}

function createContactSection(ldData) {
  const container = document.createElement('section');
  container.classList.add('container');
  container.setAttribute('aria-label', 'contact');

  // Safely encode in both attribute and text contexts
  const safeEmailHref = 'mailto:' + encodeURIComponent(ldData.email);
  const safeEmailText = sanitizeText(ldData.email);
  let html = `<a href="${safeEmailHref}" class="link">${safeEmailText}</a>`;
  
  container.innerHTML = html;
  return container;
}