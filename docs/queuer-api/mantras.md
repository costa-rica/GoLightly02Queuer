# Mantras

## POST /mantras/new

Creates a new mantra by orchestrating text-to-speech generation and audio concatenation. Accepts either a CSV filename or a mantra array defining the audio elements to create.

Authentication is not required.

### Parameters

Request body (JSON):

- userId (required): Positive integer identifying the user creating the mantra
- filenameCsv (optional): String filename of CSV file in PATH_QUEUER/user_request_csv_files directory
- mantraArray (optional): Array of mantra element objects (see structure below)

Note: Either filenameCsv or mantraArray must be provided, but not both.

#### Mantra Array Element Structure

Each element in mantraArray must contain:

- id (required): Unique identifier for the element (string or number)
- One of the following (mutually exclusive with sound_file):
  - text (optional): Text to convert to speech via ElevenLabs
  - voice_id (optional): ElevenLabs voice ID (string, used with text)
  - speed (optional): Speech speed (number, used with text)
  - pause_duration (optional): Duration of silence in seconds (number)
- sound_file (optional): Filename of pre-existing MP3 in PATH_MP3_SOUND_FILES directory (cannot be used with text, voice_id, speed, or pause_duration)

### Sample Request (with mantraArray)

```bash
curl --location 'http://localhost:3000/mantras/new' \
--header 'Content-Type: application/json' \
--data-raw '{
  "userId": 1,
  "mantraArray": [
    {
      "id": 1,
      "text": "Welcome to your meditation session",
      "voice_id": "nPczCjzI2devNBz1zQrb",
      "speed": 0.85
    },
    {
      "id": 2,
      "pause_duration": 3
    },
    {
      "id": 3,
      "sound_file": "ocean-waves.mp3"
    },
    {
      "id": 4,
      "text": "Take a deep breath and relax"
    }
  ]
}'
```

### Sample Request (with filenameCsv)

```bash
curl --location 'http://localhost:3000/mantras/new' \
--header 'Content-Type: application/json' \
--data-raw '{
  "userId": 1,
  "filenameCsv": "meditation_20260203.csv"
}'
```

### Sample Response

```json
{
  "success": true,
  "queueId": 42,
  "finalFilePath": "/path/to/output/20260203/output_20260203_153045.mp3",
  "message": "Mantra created successfully"
}
```

### Error Responses

#### Missing userId (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "userId is required",
    "status": 400
  }
}
```

#### Invalid userId (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "userId must be a positive number",
    "status": 400
  }
}
```

#### Missing both filenameCsv and mantraArray (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Either filenameCsv or mantraArray must be provided",
    "status": 400
  }
}
```

#### Providing both filenameCsv and mantraArray (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cannot provide both filenameCsv and mantraArray",
    "status": 400
  }
}
```

#### Empty mantraArray (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "mantraArray cannot be empty",
    "status": 400
  }
}
```

#### Invalid mantraArray element (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "mantraArray validation failed",
    "status": 400,
    "details": [
      {
        "index": 0,
        "message": "Element is missing required field: id"
      },
      {
        "index": 2,
        "message": "sound_file cannot be used with text, voice_id, speed, or pause_duration in the same element"
      }
    ]
  }
}
```

#### CSV file not found (400)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "CSV file not found: meditation_20260203.csv",
    "status": 400
  }
}
```

#### Workflow failure (500)

```json
{
  "success": false,
  "queueId": 42,
  "error": {
    "code": "WORKFLOW_FAILED",
    "message": "ElevenLabs process failed with exit code: 1",
    "status": 500
  }
}
```

### Processing Pipeline

The endpoint triggers a multi-stage asynchronous workflow:

1. Request validation and input parsing
2. Queue record creation with status "queued"
3. Status update to "started"
4. ElevenLabs text-to-speech generation (status: "elevenlabs")
5. ElevenLabsFiles database records creation
6. AudioConcatenator file merging (status: "concatenator")
7. Mantra database record creation
8. ContractUsersMantras and ContractMantrasElevenLabsFiles linking
9. Queue status update to "done"

The queueId returned in the response can be used to track the job status in the Queue table.
