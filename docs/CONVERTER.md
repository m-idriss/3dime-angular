# Calendar Converter

## Overview

The Calendar Converter is a feature that allows users to upload images (JPG, PNG) or PDF files containing calendar information and convert them to ICS (iCalendar) format using AI-powered extraction.

## Features

- **📤 File Upload**: Drag-and-drop interface for images and PDF files
- **🧠 Smart Parsing**: Automatic detection of dates, times, and event information using OpenAI GPT-4 Vision
- **📅 ICS Generation**: Creates downloadable calendar files with proper RFC 5545 formatting
- **🔐 Firebase Integration**: Secure cloud function processing
- **📱 Responsive Design**: Mobile-optimized interface with modern glassmorphism UI

## Architecture

### Frontend (Angular)

**Component**: `src/app/components/converter/`
- Drag-and-drop file upload
- File validation (type, size)
- Progress indicators
- Error handling
- ICS file download

**Service**: `src/app/services/converter.ts`
- HTTP communication with Firebase function
- File-to-base64 conversion
- ICS file download helper

### Backend (Firebase Function)

**Function**: `functions/src/proxies/converter.ts`
- Accepts POST requests with image/PDF data
- Calls OpenAI GPT-4 Vision API for event extraction
- Returns ICS content
- Handles errors and timeouts

## Usage

### User Workflow

1. Navigate to the converter section on the homepage
2. Upload one or more images or PDF files:
   - Drag and drop files into the upload area, OR
   - Click "Browse Files" to select files
3. Review the uploaded files
4. Click "Convert to ICS"
5. Wait for processing (AI extraction takes 10-30 seconds)
6. Download the generated ICS file
7. Import the ICS file into your calendar application

### Supported File Types

- **Images**: JPG, JPEG, PNG
- **Documents**: PDF
- **Max file size**: 10MB per file
- **Multiple files**: Yes, upload multiple files for batch processing

### Calendar Applications

The generated ICS files are compatible with:
- Google Calendar
- Apple Calendar
- Microsoft Outlook
- Any RFC 5545 compliant calendar application

## Setup

### Prerequisites

1. Firebase project with Functions enabled
2. OpenAI API account with access to GPT-4 Vision

### Configuration

1. Set up Firebase secrets:
   ```bash
   firebase functions:secrets:set OPENAI_API_KEY
   ```

2. Optional: Customize prompts (see `.env.example`)

3. Deploy the function:
   ```bash
   cd functions
   npm run build
   firebase deploy --only functions:converterFunction
   ```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key with GPT-4 Vision access |
| `BASE_TEXT_MESSAGE` | No | Custom extraction prompt |
| `PROMPT` | No | Custom system prompt |

## API Reference

### Endpoint

```
POST /converterFunction
```

### Request Body

```typescript
{
  files: Array<{
    dataUrl: string;  // Base64 encoded file data URL
    name: string;     // Original filename
    type: string;     // MIME type
  }>;
  timeZone?: string;     // Optional: defaults to UTC
  currentDate?: string;  // Optional: defaults to today (YYYY-MM-DD)
}
```

### Response

```typescript
{
  icsContent: string;  // RFC 5545 compliant ICS content
  success: boolean;
  error?: string;      // Only present if success is false
}
```

### Error Responses

- `400`: Missing or invalid files
- `405`: Method not allowed (must be POST)
- `500`: Internal server error or OpenAI API failure

## Technical Details

### AI Processing

The converter uses OpenAI's GPT-4 Vision model (`gpt-4o`) with:
- **Temperature**: 0.1 (low randomness for consistent output)
- **Max tokens**: 4096
- **Detail level**: High (for accurate OCR)

### Prompt Engineering

The system uses two prompts:

1. **System Prompt**: Defines the AI's role as a calendar extraction expert
2. **User Message**: Provides context (timezone, current date) and extraction instructions

### ICS Format

Generated ICS files include:
- `BEGIN:VCALENDAR` / `END:VCALENDAR` wrapper
- `VERSION:2.0` specification
- `PRODID` identifier
- For each event:
  - `UID`: Unique identifier
  - `DTSTAMP`: Timestamp of creation
  - `DTSTART`: Event start date/time
  - `DTEND`: Event end date/time
  - `SUMMARY`: Event title
  - `DESCRIPTION`: Event details (if available)
  - `LOCATION`: Event location (if available)
  - `TZID`: Timezone identifier (if applicable)

## Development

### Running Locally

1. Start the Angular development server:
   ```bash
   npm start
   ```

2. The converter is available at `http://localhost:4200/`

### Testing

The converter requires manual testing with real calendar images/PDFs since it depends on external AI services.

**Test files to try**:
- Calendar screenshots from phone/computer
- PDF event flyers
- Email screenshots with event details
- Social media event posts

### Troubleshooting

**Issue**: "Failed to process images with AI"
- Check OpenAI API key is set correctly
- Verify API key has GPT-4 Vision access
- Check OpenAI account has sufficient credits

**Issue**: "No ICS content generated"
- Image quality may be too low
- Calendar information may not be clearly visible
- Try with a clearer image

**Issue**: Files not uploading
- Check file size (max 10MB)
- Verify file type (JPG, PNG, or PDF only)

## Styling

The converter uses the app's global design system:
- Glassmorphism effects
- Space-themed colors
- Responsive layout
- Accessible controls

SCSS variables used:
- `--glass-bg`: Background with transparency
- `--glass-border`: Border color
- `--accent-color`: Primary action color
- `--text-primary`: Main text color
- `--text-secondary`: Secondary text color

## Security

- File validation on client-side (type, size)
- CORS protection on Firebase function
- Base64 encoding for file transmission
- No file storage (processing is stateless)
- OpenAI API key stored as Firebase secret

## Future Enhancements

- [ ] Support for more file formats (Word, Excel)
- [ ] Preview extracted events before download
- [ ] Edit events before generating ICS
- [ ] Bulk processing with progress tracking
- [ ] Support for recurring events
- [ ] Multiple language support
- [ ] OCR fallback if AI extraction fails

## References

- [RFC 5545 - iCalendar Specification](https://tools.ietf.org/html/rfc5545)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [ICS Format Guide](https://icalendar.org/)
