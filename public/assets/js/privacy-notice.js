/* =========================
   3DIME - Privacy Notice Component
   
   Simple, unobtrusive privacy notice for analytics transparency.
   Follows GDPR principles and respects user preferences.
   
   @module privacy-notice
   @version 1.0
   @author Idriss Mohamady
   @since 2024
   ========================= */

/**
 * Privacy Notice Manager
 * Handles the display and interaction with privacy notices
 */
class PrivacyNotice {
  constructor() {
    this.noticeShown = localStorage.getItem('privacy-notice-shown') === 'true';
    this.init();
  }

  /**
   * Initialize privacy notice if needed
   */
  init() {
    // Only show notice in production and if not already acknowledged
    if (this.shouldShowNotice()) {
      this.createNotice();
    }
  }

  /**
   * Determine if privacy notice should be shown
   * @returns {boolean}
   */
  shouldShowNotice() {
    // Don't show on localhost
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      return false;
    }
    
    // Don't show if already acknowledged
    if (this.noticeShown) {
      return false;
    }
    
    // Don't show if DNT is enabled
    if (navigator.doNotTrack === '1') {
      return false;
    }
    
    return true;
  }

  /**
   * Create and display privacy notice
   */
  createNotice() {
    const notice = document.createElement('div');
    notice.className = 'privacy-notice';
    notice.setAttribute('role', 'banner');
    notice.setAttribute('aria-live', 'polite');
    
    notice.innerHTML = `
      <div class="privacy-notice-content">
        <p>
          <strong>Privacy-friendly analytics</strong><br>
          We collect anonymous usage data to improve your experience. 
          No cookies, no tracking, no personal data.
        </p>
        <div class="privacy-notice-actions">
          <button class="privacy-notice-accept" aria-label="Accept privacy-friendly analytics">
            ✓ Got it
          </button>
          <button class="privacy-notice-decline" aria-label="Opt out of analytics">
            ✗ Opt out
          </button>
        </div>
      </div>
    `;
    
    // Add styles
    this.addStyles();
    
    // Add event listeners
    const acceptBtn = notice.querySelector('.privacy-notice-accept');
    const declineBtn = notice.querySelector('.privacy-notice-decline');
    
    acceptBtn.addEventListener('click', () => this.acceptNotice(notice));
    declineBtn.addEventListener('click', () => this.declineNotice(notice));
    
    // Add to page
    document.body.appendChild(notice);
    
    // Show with animation
    setTimeout(() => notice.classList.add('privacy-notice-visible'), 100);
  }

  /**
   * Handle notice acceptance
   * @param {HTMLElement} notice - Notice element
   */
  acceptNotice(notice) {
    localStorage.setItem('privacy-notice-shown', 'true');
    this.hideNotice(notice);
  }

  /**
   * Handle notice decline (opt out)
   * @param {HTMLElement} notice - Notice element
   */
  declineNotice(notice) {
    localStorage.setItem('privacy-notice-shown', 'true');
    localStorage.setItem('analytics-opt-out', 'true');
    this.hideNotice(notice);
    
    // Inform user
    console.log('✅ You have opted out of analytics. Your privacy is respected.');
  }

  /**
   * Hide notice with animation
   * @param {HTMLElement} notice - Notice element
   */
  hideNotice(notice) {
    notice.classList.add('privacy-notice-hiding');
    setTimeout(() => {
      if (notice.parentNode) {
        notice.parentNode.removeChild(notice);
      }
    }, 300);
  }

  /**
   * Add CSS styles for privacy notice
   */
  addStyles() {
    if (document.getElementById('privacy-notice-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'privacy-notice-styles';
    styles.textContent = `
      .privacy-notice {
        position: fixed;
        bottom: 20px;
        right: 20px;
        max-width: 320px;
        background: var(--glass-bg, rgba(255, 255, 255, 0.95));
        backdrop-filter: blur(12px);
        border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
        border-radius: var(--radius-lg, 12px);
        padding: var(--space-lg, 16px);
        box-shadow: var(--shadow-card, 0 8px 32px rgba(0, 0, 0, 0.1));
        z-index: 9999;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s var(--ease, cubic-bezier(0.4, 0, 0.2, 1));
      }
      
      .privacy-notice-visible {
        transform: translateY(0);
        opacity: 1;
      }
      
      .privacy-notice-hiding {
        transform: translateY(100px);
        opacity: 0;
      }
      
      .privacy-notice-content p {
        margin: 0 0 var(--space-md, 12px);
        font-size: var(--font-size-sm, 0.875rem);
        line-height: 1.5;
        color: var(--text-primary, #1a1a1a);
      }
      
      .privacy-notice-actions {
        display: flex;
        gap: var(--space-sm, 8px);
        justify-content: flex-end;
      }
      
      .privacy-notice-accept,
      .privacy-notice-decline {
        padding: var(--space-sm, 8px) var(--space-md, 12px);
        border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.2));
        border-radius: var(--radius-md, 8px);
        background: var(--glass-bg, rgba(255, 255, 255, 0.1));
        color: var(--text-primary, #1a1a1a);
        font-size: var(--font-size-sm, 0.875rem);
        cursor: pointer;
        transition: all 0.2s var(--ease, cubic-bezier(0.4, 0, 0.2, 1));
      }
      
      .privacy-notice-accept:hover,
      .privacy-notice-decline:hover {
        background: var(--glass-bg-hover, rgba(255, 255, 255, 0.2));
        transform: translateY(-1px);
      }
      
      .privacy-notice-accept {
        background: var(--accent-color, #3b82f6);
        color: white;
        border-color: var(--accent-color, #3b82f6);
      }
      
      @media (max-width: 480px) {
        .privacy-notice {
          left: 20px;
          right: 20px;
          max-width: none;
          bottom: 20px;
        }
        
        .privacy-notice-actions {
          flex-direction: column;
        }
        
        .privacy-notice-accept,
        .privacy-notice-decline {
          width: 100%;
          text-align: center;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .privacy-notice {
          transition: opacity 0.3s ease;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }
}

/**
 * Initialize privacy notice
 * @returns {PrivacyNotice} Privacy notice instance
 */
export function initPrivacyNotice() {
  try {
    return new PrivacyNotice();
  } catch (error) {
    console.error('Failed to initialize PrivacyNotice:', error);
    return null;
  }
}