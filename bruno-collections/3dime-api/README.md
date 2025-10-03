# 3dime API Bruno Collection

This directory contains Bruno API collection for testing the 3dime-angular API endpoints.

## What is Bruno?

Bruno is a fast and Git-friendly opensource API client. It stores collections directly in folders on your filesystem using a plain text markup language called Bru.

- **Website**: https://www.usebruno.com/
- **GitHub**: https://github.com/usebruno/bruno

## Installation

### Desktop App (Recommended)

1. Download Bruno from https://www.usebruno.com/downloads
2. Install the application for your operating system
3. Open Bruno and select "Open Collection"
4. Navigate to `bruno-collections/3dime-api` in this repository

### CLI (Optional)

```bash
npm install -g @usebruno/cli
```

## Collection Structure

```
bruno-collections/
└── 3dime-api/
    ├── bruno.json                  # Collection configuration
    ├── GitHub User Profile.bru     # GitHub API test
    └── README.md                   # This file
```

## Available Requests

### GitHub User Profile

Tests the GitHub API endpoint to retrieve user profile information.

**Endpoint**: `https://api.github.com/users/m-idriss`  
**Method**: GET  
**Tests**:
- ✓ Status code is 200
- ✓ Response has login field
- ✓ Login value is "m-idriss"
- ✓ Response is valid JSON

## Running Tests

### Using Bruno Desktop App

1. Open the collection in Bruno
2. Select "GitHub User Profile" request
3. Click "Send" button
4. View the response and test results in the "Tests" tab

### Using Bruno CLI

```bash
# Run all tests in the collection
bru run bruno-collections/3dime-api

# Run specific request
bru run bruno-collections/3dime-api --filename "GitHub User Profile.bru"
```

## Adding New Requests

1. Create a new `.bru` file in the `3dime-api` directory
2. Use the following template:

```
meta {
  name: Request Name
  type: http
  seq: 2
}

get {
  url: https://api.example.com/endpoint
  body: none
  auth: none
}

headers {
  Accept: application/json
}

tests {
  test("Status code is 200", function() {
    expect(res.getStatus()).to.equal(200);
  });
}
```

## Future Additions

Planned requests to add:
- Firebase Functions proxy endpoints
- GitHub commits API
- GitHub social accounts API
- Notion API integration

## Documentation

For more information about the API endpoints being tested, see:
- [API Documentation](../../docs/API.md)
- [Services Documentation](../../docs/SERVICES.md)

## Contributing

When adding new API tests:
1. Follow the existing naming convention
2. Include comprehensive tests
3. Add documentation in the `docs` section
4. Update this README with the new request information
