/* =========================
   Heatmap Loading
   ========================= */

import { CONFIG } from './config.js';

/* =========================
   Theme Detection Helper
   ========================= */
function getHeatmapTheme() {
  // Check current website theme and map to appropriate heatmap theme
  if (document.body.classList.contains('white-theme')) {
    return 'light';
  }
  // For dark-theme and glass-theme (or default), use dark heatmap theme
  return 'dark';
}

/* =========================
   Library Readiness Check
   ========================= */
function waitForLibraries(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkLibraries = () => {
      if (typeof CalHeatmap !== 'undefined' && 
          typeof CalendarLabel !== 'undefined' && 
          typeof Tooltip !== 'undefined') {
        resolve();
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for libraries to load'));
      } else {
        setTimeout(checkLibraries, 100);
      }
    };
    checkLibraries();
  });
}

/* =========================
   Heatmap Loading with Retry
   ========================= */
export async function loadHeatmapWithRetry(maxRetries = 5, initialDelay = 1000, maxDelay = 10000) {
  try {
    // Wait for external libraries to be ready
    await waitForLibraries();
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        await loadHeatmap();
        
        // Success - log the attempt if it took more than one try
        if (attempt > 0) {
          console.log(`GitHub data loaded successfully on attempt ${attempt + 1}`);
        }
        return; // success → stop retrying
      } catch (err) {
        const isLastAttempt = attempt === maxRetries - 1;
        console.warn(`Heatmap load failed (attempt ${attempt + 1}/${maxRetries})`, err);
        
        if (!isLastAttempt) {
          // Determine if this error should trigger a retry
          const shouldRetry = isRetriableError(err);
          
          if (shouldRetry) {
            // Exponential backoff with jitter to avoid thundering herd
            const backoffDelay = Math.min(
              initialDelay * Math.pow(2, attempt) + Math.random() * 1000,
              maxDelay
            );
            
            console.log(`Retrying in ${Math.round(backoffDelay)}ms...`);
            await new Promise(res => setTimeout(res, backoffDelay));
          } else {
            console.warn('Error is not retriable, stopping retry attempts');
            break;
          }
        }
      }
    }
    
    // All retries exhausted
    console.warn('All retry attempts exhausted, showing fallback');
    showHeatmapFallback();
    
  } catch (err) {
    console.warn('Heatmap initialization failed:', err.message);
    // Show user-friendly fallback message
    showHeatmapFallback();
  }
}

/* =========================
   Error Analysis for Retry Logic
   ========================= */
function isRetriableError(error) {
  const errorMessage = error.message?.toLowerCase() || '';
  const errorString = error.toString().toLowerCase();
  
  // Don't retry for authentication errors or other client errors first
  const nonRetriableStatuses = ['400', '401', '403', '404', '405', '406', '409', '410', '422'];
  for (const status of nonRetriableStatuses) {
    if (errorMessage.includes(status) || errorString.includes(status)) {
      return false;
    }
  }
  
  // Network-related errors that should be retried
  const networkErrors = [
    'failed to fetch',
    'network error',
    'timeout',
    'connection',
    'net::err_',
    'dns',
    'unable to connect'
  ];
  
  // HTTP status codes that should be retried
  const retriableStatuses = [
    '429', // Too Many Requests (rate limiting)
    '500', // Internal Server Error
    '502', // Bad Gateway
    '503', // Service Unavailable
    '504', // Gateway Timeout
    '520', // Unknown Error (Cloudflare)
    '521', // Web Server Is Down (Cloudflare)
    '522', // Connection Timed Out (Cloudflare)
    '523', // Origin Is Unreachable (Cloudflare)
    '524'  // A Timeout Occurred (Cloudflare)
  ];
  
  // Check for network-related errors
  for (const networkError of networkErrors) {
    if (errorMessage.includes(networkError) || errorString.includes(networkError)) {
      return true;
    }
  }
  
  // Check for retriable HTTP status codes
  for (const status of retriableStatuses) {
    if (errorMessage.includes(status) || errorString.includes(status)) {
      return true;
    }
  }
  
  // GitHub-specific retriable errors
  if (errorMessage.includes('rate limit') || errorMessage.includes('api rate limit')) {
    return true;
  }
  
  // Default to not retrying for unknown errors to avoid infinite loops
  return false;
}

function showLoadingState() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    container.innerHTML = `
      <div class="loading-container" role="status" aria-live="polite">
        <div class="spinner" aria-label="Loading heatmap">
          <div class="spinner-circle"></div>
        </div>
        <p>Loading GitHub activity...</p>
      </div>
    `;
  }
}

function showUpdatingState() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    // Show updating indicator without completely clearing the existing heatmap
    container.style.opacity = '0.5';
    
    // Add a small update indicator
    const updateIndicator = document.createElement('div');
    updateIndicator.className = 'update-indicator';
    updateIndicator.innerHTML = `
      <div class="update-spinner" aria-label="Updating heatmap">
        <div class="spinner-circle"></div>
      </div>
    `;
    updateIndicator.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      border-radius: 4px;
      padding: 4px 8px;
      z-index: 10;
    `;
    
    // Make container relative if it isn't already
    if (container.style.position !== 'relative') {
      container.style.position = 'relative';
    }
    
    container.appendChild(updateIndicator);
  }
}

function clearUpdatingState() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    container.style.opacity = '1';
    const updateIndicator = container.querySelector('.update-indicator');
    if (updateIndicator) {
      updateIndicator.remove();
    }
  }
}

function showHeatmapFallback() {
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (container) {
    container.innerHTML = `
      <div class="heatmap-fallback" role="alert" aria-live="polite">
        <p>🔗 <a href="https://github.com/m-idriss" target="_blank" rel="noopener noreferrer" 
           aria-label="View GitHub profile for commit activity">
           View GitHub activity
        </a></p>
      </div>
    `;
  }
}

// Store heatmap data and instance for re-rendering
let heatmapData = null;
let heatmapInstance = null;

export async function loadHeatmap(isUpdate = false) {
  try {
    // Show appropriate loading state
    if (isUpdate && heatmapData) {
      showUpdatingState();
    } else {
      showLoadingState();
    }
    
    // Fetch data with retry logic
    const data = await fetchGitHubDataWithRetry();
    const commitActivity = data.commit_activity;
    
    if (!commitActivity || !Array.isArray(commitActivity)) {
      console.warn('No commit activity data available');
      showHeatmapFallback();
      return;
    }

    const commitSource = commitActivity.flatMap(week =>
      week.days.map((value, i) => {
        const date = new Date((week.week + i * 86400) * 1000)
          .toISOString()
          .split("T")[0];
        return { date, value };
      })
    );

    // Store data for re-rendering
    heatmapData = commitSource;
    
    // Clear any updating state before rendering
    if (isUpdate) {
      clearUpdatingState();
    }
    
    // Render the heatmap
    renderHeatmap(commitSource);

  } catch (error) {
    console.error('Error loading heatmap:', error);
    
    // Clear any updating state on error
    if (isUpdate) {
      clearUpdatingState();
    }
    
    showHeatmapFallback();
    throw error; // Re-throw for upper-level retry logic
  }
}

/* =========================
   GitHub Data Fetching with Retry
   ========================= */
async function fetchGitHubDataWithRetry(maxRetries = 3, initialDelay = 500) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`${CONFIG.ENDPOINTS.PROXY}?service=github&type=commits_all`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        
        const error = new Error(`Failed to fetch commit data: ${response.status} - ${errorData.error || response.statusText}`);
        error.status = response.status;
        error.response = errorData;
        throw error;
      }
      
      const data = await response.json();
      
      // Validate that we received meaningful data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format: expected object');
      }
      
      return data;
      
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === maxRetries - 1;
      
      if (!isLastAttempt && isRetriableError(error)) {
        const delay = initialDelay * Math.pow(2, attempt) + Math.random() * 200;
        console.log(`Fetch attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms:`, error.message);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }
  
  throw lastError;
}

function renderHeatmap(commitSource) {
  // Clear loading state and destroy previous instance before rendering heatmap
  const container = document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER);
  if (!container) return;
  
  // Destroy previous heatmap instance if it exists
  if (heatmapInstance) {
    try {
      heatmapInstance.destroy();
    } catch (error) {
      console.warn('Error destroying previous heatmap instance:', error);
    }
    heatmapInstance = null;
  }
  
  // Clear container completely
  container.innerHTML = '';
  
  // Force DOM update to ensure the container is cleared
  container.offsetHeight; // Trigger reflow
  
  try {
    const cal = new CalHeatmap();

    cal.paint({
      itemSelector: CONFIG.SELECTORS.HEATMAP_CONTAINER,
      domain: {
        type: 'month',
        label: { text: 'MMM', textAlign: 'start', position: 'top'}
      },
      subDomain: { type: 'ghDay', radius: 2, width: 9, height: 9, gutter: 1, },
      data: {
        source: commitSource,
        x: d => new Date(d.date).getTime(),
        y: d => d.value
      },
      date: {
        start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
        locale: { weekStart: 1 },
        highlight: [new Date()]
      },
      range: 7,
      scale: {
        color: {
          range: ['rgba(255, 255, 255, 0.2)', 'green'],
          interpolate: 'hsl',
          type: 'linear',
          domain: [0, 30],
        },
      },
      theme: getHeatmapTheme()
    },
    [
      [
        CalendarLabel,
        {
          position: 'left',
          key: 'left',
          text: () => ['Mon', '', '', 'Thu', '', '', 'Sun'],
          textAlign: 'end',
          width: 20,
          padding: [25, 5, 0, 0],
        },
      ],
      [
        Tooltip,
        {
          text: function (date, value, dayjsDate) {
            return (
              (value ? value + ' commits' : 'No commits') +
              ' on ' +
              dayjsDate.format('LL')
            );
          },
        },
      ]
    ]);
    
    // Store the instance for future cleanup
    heatmapInstance = cal;
    
    // Ensure the rendered heatmap is visible
    setTimeout(() => {
      container.style.opacity = '1';
    }, 100);
    
  } catch (error) {
    console.error('Error rendering heatmap:', error);
    showHeatmapFallback();
  }
}

/* =========================
   Re-render Heatmap with Current Theme
   ========================= */
export function updateHeatmapTheme() {
  // Only re-render if we have data and the heatmap container exists
  if (heatmapData && document.getElementById(CONFIG.IDS.HEATMAP_CONTAINER)) {
    renderHeatmap(heatmapData);
  }
}

