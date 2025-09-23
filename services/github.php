<?php
// GitHub API service

function fetchGithubData($type = 'user', $repo = null) {
    // Check if required constants are defined
    if (!defined('GITHUB_USERNAME') || !defined('GITHUB_REPO')) {
        throw new Exception('GitHub configuration missing. Please check config.php file.', 500);
    }

    $username = GITHUB_USERNAME;
    if ($repo === null) {
        $repo = GITHUB_REPO;
    }

    // Validate repo parameter
    if (isset($repo) && !preg_match('/^[A-Za-z0-9._-]+$/', $repo)) {
        throw new Exception('Invalid repository name');
    }

    // Determine API endpoint based on type
    if ($type === 'repo') {
        $apiUrl = "https://api.github.com/repos/$username/$repo";
    } elseif ($type === 'commits') {
        $apiUrl = "https://api.github.com/repos/$username/$repo/stats/commit_activity";
    } elseif ($type === 'list') {
        $apiUrl = "https://api.github.com/users/$username/repos";
    } else {
        $apiUrl = "https://api.github.com/users/$username";
    }

    // Attempt the API call with retry logic
    return executeGitHubApiCallWithRetry($apiUrl, $type);
}

function executeGitHubApiCallWithRetry($apiUrl, $type, $maxRetries = 3, $baseDelay = 1) {
    $lastException = null;

    for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
        try {
            $result = executeGitHubApiCall($apiUrl, $type);
            
            // For commit activity, validate that we got meaningful data
            if ($type === 'commits') {
                if (!is_array($result['commit_activity']) || empty($result['commit_activity'])) {
                    // GitHub sometimes returns 202 with empty data while stats are being computed
                    if ($attempt < $maxRetries - 1) {
                        $delay = $baseDelay * pow(2, $attempt) + (rand(0, 1000) / 1000);
                        error_log("GitHub stats not ready, waiting {$delay}s before retry " . ($attempt + 1) . "/$maxRetries");
                        sleep($delay);
                        continue;
                    }
                }
            }
            return $result;
        } catch (Exception $e) {
            $lastException = $e;
            $code = $e->getCode();
            $isLastAttempt = ($attempt === $maxRetries - 1);
            
            // Determine if this error should trigger a retry
            $shouldRetry = isRetriableGitHubError($code, $e->getMessage());
            if (!$isLastAttempt && $shouldRetry) {
                // Exponential backoff with jitter
                $delay = $baseDelay * pow(2, $attempt) + (rand(0, 1000) / 1000);
                error_log("GitHub API call failed (attempt " . ($attempt + 1) . "/$maxRetries): " . $e->getMessage() . ". Retrying in {$delay}s");
                sleep($delay);
            } else {
                break;
            }
        }
    }
    
    // All retries exhausted or non-retriable error
    throw $lastException;
}

function isRetriableGitHubError($httpCode, $message) {
    // Don't retry client errors (4xx except 429)
    if ($httpCode >= 400 && $httpCode < 500 && $httpCode !== 429) {
        return false;
    }
    
    // Rate limiting should definitely be retried
    if ($httpCode === 429) {
        return true;
    }
    
    // Server errors are generally retriable
    if ($httpCode >= 500 && $httpCode < 600) {
        return true;
    }
    
    // GitHub-specific cases that should be retried
    $retriableMessages = ['timeout','connection','network','temporarily unavailable','service unavailable','rate limit'];
    $lowerMessage = strtolower($message);
    foreach ($retriableMessages as $pattern) {
        if (strpos($lowerMessage, $pattern) !== false) {
            return true;
        }
    }
    
    // Default to not retrying for unknown errors
    return false;
}

function executeGitHubApiCall($apiUrl, $type) {
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_USERAGENT, '3dime-proxy-script');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_MAXREDIRS, 3);

    // Add authentication if GitHub token is available
    $hasToken = defined('GITHUB_TOKEN') && !empty(GITHUB_TOKEN);
    if ($hasToken) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: token ' . GITHUB_TOKEN,
            'Accept: application/vnd.github.v3+json',
            'User-Agent: 3dime-proxy-script'
        ]);
    } else {
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/vnd.github.v3+json',
            'User-Agent: 3dime-proxy-script'
        ]);
    }

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception('Failed to fetch data: ' . $error);
    }
    curl_close($ch);

    $data = json_decode($response, true);

    // Handle 403 errors: distinguish rate limit from auth errors
    if ($httpCode === 403) {
        $errorMessage = is_array($data) && isset($data['message']) ? strtolower($data['message']) : '';
        if (strpos($errorMessage, 'rate limit') !== false || strpos($errorMessage, 'api rate limit exceeded') !== false) {
            $tokenHint = $hasToken ? '' : ' Consider adding a GitHub token to config.php for higher rate limits.';
            throw new Exception('Rate limit exceeded: ' . ($data['message'] ?? 'GitHub API rate limit reached') . $tokenHint, 429);
        } elseif (strpos($errorMessage, 'bad credentials') !== false) {
            throw new Exception('Authentication failed: ' . ($data['message'] ?? 'Bad credentials'), 401);
        } else {
            $tokenHint = $hasToken ? '' : ' This may be due to rate limiting. Consider adding a GitHub token to config.php.';
            throw new Exception('Forbidden: ' . ($data['message'] ?? 'Access forbidden') . $tokenHint, 403);
        }
    }

    // Handle 202 response for commit activity (stats being computed)
    if ($httpCode === 202 && $type === 'commits') {
        throw new Exception('GitHub stats are being computed, please try again in a few moments', 202);
    }

    if ($httpCode !== 200) {
        $message = is_array($data) && isset($data['message']) ? $data['message'] : '';
        throw new Exception('GitHub API error: ' . $message, $httpCode);
    }

    if ($data === null) {
        throw new Exception('Invalid JSON response');
    }

    // Prepare response based on type
    if ($type === 'repo') {
        return [
            'repo_id' => $data['id'] ?? 0,
            'name' => $data['name'] ?? '',
            'full_name' => $data['full_name'] ?? '',
            'stars' => $data['stargazers_count'] ?? 0,
            'forks' => $data['forks_count'] ?? 0,
            'watchers' => $data['watchers_count'] ?? 0,
            'issues' => $data['open_issues_count'] ?? 0,
            'size' => $data['size'] ?? 0,
            'language' => $data['language'] ?? '',
            'created_at' => $data['created_at'] ?? '',
            'updated_at' => $data['updated_at'] ?? ''
        ];
    } elseif ($type === 'commits') {
        return ['commit_activity' => $data];
    } elseif ($type === 'list') {
        return $data;
    } else {
        return [
            'user_id' => $data['id'] ?? 0,
            'repos' => $data['public_repos'] ?? 0,
            'followers' => $data['followers'] ?? 0,
            'following' => $data['following'] ?? 0
        ];
    }
}

function getAllCommitActivityAsJson() {
    // Uncomment to fetch all repos dynamically
    // $repos = fetchGithubData('list');

    // For simplicity and to avoid hitting rate limits, we hardcode
    // the main repos here. Add more repos as needed.
    $repos = [
        ['name' => '3dime-angular'],
        ['name' => '3dime'],
        ['name' => 'converter']
    ];
    $aggregated = [];

    foreach ($repos as $repo) {
        $repoName = $repo['name'];
        try {
            $data = fetchGithubData('commits', $repoName);
            foreach ($data['commit_activity'] as $week) {
                $ts = $week['week'];
                if (!isset($aggregated[$ts])) {
                    $aggregated[$ts] = [
                        'week'  => $ts,
                        'total' => 0,
                        'days'  => array_fill(0, 7, 0)
                    ];
                }
                $aggregated[$ts]['total'] += $week['total'];
                foreach ($week['days'] as $i => $dayCount) {
                    $aggregated[$ts]['days'][$i] += $dayCount;
                }
            }
        } catch (Exception $e) {
            error_log("Error on $repoName: " . $e->getMessage());
        }
    }

    ksort($aggregated);

    return [
        'commit_activity' => array_values($aggregated)
    ];
}
?>