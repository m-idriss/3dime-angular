/* =========================
   3DIME - Performance Monitoring Module
   
   Lightweight Core Web Vitals tracking for performance monitoring.
   Tracks essential metrics without external dependencies or privacy concerns.
   
   @module performance
   @version 1.0
   @author Idriss Mohamady
   @since 2024
   ========================= */

/**
 * Core Web Vitals monitoring class
 * Tracks LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift)
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      lcp: null,
      fid: null,
      cls: null,
      navigationTiming: {}
    };
    
    this.init();
  }

  /**
   * Initialize performance monitoring
   * @returns {void}
   */
  init() {
    // Only monitor performance in production or when explicitly enabled
    if (this.shouldMonitor()) {
      this.observeLCP();
      this.observeFID();
      this.observeCLS();
      this.captureNavigationTiming();
      
      // Log results when page is about to unload
      window.addEventListener('beforeunload', () => this.logMetrics());
    }
  }

  /**
   * Check if performance monitoring should be enabled
   * @returns {boolean}
   */
  shouldMonitor() {
    // Enable in production or when debug mode is active
    return location.hostname !== 'localhost' || 
           sessionStorage.getItem('debug-performance') === 'true';
  }

  /**
   * Observe Largest Contentful Paint (LCP)
   * Target: < 2.5 seconds
   */
  observeLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = Math.round(lastEntry.startTime);
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // Silently handle unsupported browsers
      }
    }
  }

  /**
   * Observe First Input Delay (FID)
   * Target: < 100 milliseconds
   */
  observeFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = Math.round(entry.processingStart - entry.startTime);
        });
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Silently handle unsupported browsers
      }
    }
  }

  /**
   * Observe Cumulative Layout Shift (CLS)
   * Target: < 0.1
   */
  observeCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.cls = Math.round(clsValue * 1000) / 1000;
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Silently handle unsupported browsers
      }
    }
  }

  /**
   * Capture Navigation Timing metrics
   */
  captureNavigationTiming() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const navigationStart = timing.navigationStart;

      this.metrics.navigationTiming = {
        domContentLoaded: timing.domContentLoadedEventEnd - navigationStart,
        fullyLoaded: timing.loadEventEnd - navigationStart,
        firstByte: timing.responseStart - navigationStart
      };
    }
  }

  /**
   * Log performance metrics (development only)
   */
  logMetrics() {
    if (sessionStorage.getItem('debug-performance') === 'true') {
      console.group('🚀 3dime Performance Metrics');
      console.log('LCP (Largest Contentful Paint):', this.formatMetric(this.metrics.lcp, 'ms', 2500));
      console.log('FID (First Input Delay):', this.formatMetric(this.metrics.fid, 'ms', 100));
      console.log('CLS (Cumulative Layout Shift):', this.formatMetric(this.metrics.cls, '', 0.1));
      console.log('Dom Content Loaded:', this.formatMetric(this.metrics.navigationTiming.domContentLoaded, 'ms'));
      console.log('Fully Loaded:', this.formatMetric(this.metrics.navigationTiming.fullyLoaded, 'ms'));
      console.groupEnd();
    }
  }

  /**
   * Format metric with status indicator
   * @param {number} value - Metric value
   * @param {string} unit - Unit of measurement
   * @param {number} threshold - Performance threshold (optional)
   * @returns {string} Formatted metric string
   */
  formatMetric(value, unit, threshold = null) {
    if (value === null || value === undefined) return 'Not available';
    
    let status = '';
    if (threshold !== null) {
      status = value <= threshold ? ' ✅' : ' ⚠️';
    }
    
    return `${value}${unit}${status}`;
  }

  /**
   * Get current performance metrics
   * @returns {Object} Current metrics object
   */
  getMetrics() {
    return { ...this.metrics };
  }
}

/**
 * Initialize performance monitoring
 * @returns {PerformanceMonitor} Performance monitor instance
 */
export function initPerformanceMonitoring() {
  return new PerformanceMonitor();
}

/**
 * Enable debug mode for performance monitoring
 * Call this in browser console: enablePerformanceDebug()
 */
window.enablePerformanceDebug = function() {
  sessionStorage.setItem('debug-performance', 'true');
  console.log('🚀 Performance debugging enabled. Refresh the page to see metrics.');
};