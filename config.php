<?php
// Configuration file for 3dime social hub
// This is a default configuration. Copy config.php.example and customize for production use.

// GitHub API Configuration (REQUIRED for heatmap functionality)
// Get token from: https://github.com/settings/tokens
// Scopes needed: public_repo (for public repositories)
define('GITHUB_TOKEN', getenv('GITHUB_TOKEN') ?: '');
define('GITHUB_USERNAME', 'm-idriss');
define('GITHUB_REPO', '3dime');
?>