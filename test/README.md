# GoLightly01Queuer Tests

## Overview

This directory contains Jest integration tests for the GoLightly01Queuer application. The tests verify the complete workflow from API request through child process execution to final file generation.

## Test Structure

```
test/
├── utils/
│   └── testHelpers.ts          # Shared test utilities
├── elevenlabs.test.ts          # ElevenLabs integration test
├── audioConcatenator.test.ts   # AudioConcatenator integration test
└── e2e.test.ts                 # End-to-end workflow test
```

## Running Tests

```bash
npm test                         # Run all tests
npm test -- elevenlabs          # Run specific test file
npm test -- --verbose           # Run with detailed output
```

## Test Requirements

### ElevenLabs Integration Test (`elevenlabs.test.ts`)

Tests the ElevenLabs workflow in isolation:

1. **Setup**
   - Initialize database connection
   - Get or create test user
   - Prepare test meditationArray with short text

2. **Test Steps**
   - Call `orchestrateMeditationCreation()` with meditationArray containing text
   - Verify queue record created in database
   - Verify ElevenLabs child process runs successfully
   - Verify MP3 files created at expected paths
   - Verify queue status updated appropriately

3. **Cleanup**
   - Delete queue records from database
   - Delete generated CSV files
   - Delete generated MP3 files from ElevenLabs

### AudioConcatenator Integration Test (`audioConcatenator.test.ts`)

Tests the AudioConcatenator workflow:

1. **Setup**
   - Initialize database connection
   - Get or create test user
   - Run ElevenLabs workflow first to get test files
   - Prepare meditationArray with pauses

2. **Test Steps**
   - Call `orchestrateMeditationCreation()` with full workflow
   - Verify ElevenLabs files created
   - Verify AudioConcatenator CSV generated correctly
   - Verify AudioConcatenator child process runs
   - Verify final concatenated MP3 file created
   - Verify queue status updated to "done"

3. **Cleanup**
   - Delete queue records from database
   - Delete all generated CSV files
   - Delete all generated MP3 files
   - Delete temporary silence files

### End-to-End Test (`e2e.test.ts`)

Tests complete workflow with all features:

1. **Setup**
   - Initialize database connection
   - Get or create test user
   - Prepare comprehensive meditationArray with:
     - Multiple text entries
     - Pause durations
     - Optional sound files (if available)

2. **Test Steps**
   - Call `orchestrateMeditationCreation()` with complete workflow
   - Verify all queue status transitions:
     - queued → started → elevenlabs → concatenator → done
   - Verify all intermediate files generated
   - Verify final output file created
   - Test error scenarios (if applicable)

3. **Cleanup**
   - Delete all queue records
   - Delete all generated files
   - Verify no leftover data

## Test Utilities

Located in `test/utils/testHelpers.ts`:

- `cleanupDatabaseRecords(queueIds)` - Delete test queue records
- `cleanupTestFiles(filePaths)` - Delete test files
- `getOrCreateTestUser()` - Get/create test user for tests
- `getSampleMeditationArray()` - Generate sample test data

## Environment Variables

Tests use the same `.env` file as the application. Ensure all required environment variables are set:

- Database paths and credentials
- Child process paths (PATH_TO_ELEVENLABS_SERVICE, PATH_TO_AUDIO_FILE_CONCATENATOR)
- All PATH_QUEUER subdirectories

## Important Notes

1. **Real Child Processes**: Tests spawn actual child processes (ElevenLabs and AudioConcatenator). Ensure these services are built and accessible.

2. **File Cleanup**: All tests must clean up generated files to avoid cluttering the filesystem.

3. **Database Cleanup**: All tests must delete queue records after completion.

4. **Timeouts**: Child process tests may need extended timeouts:

   ```typescript
   jest.setTimeout(60000); // 60 seconds
   ```

5. **Sequential Execution**: Some tests may need to run sequentially if they share resources:
   ```typescript
   describe.serial("Sequential tests", () => {
     // tests here
   });
   ```

## Implementation Status

- [x] Jest configuration setup
- [x] Test utilities created
- [ ] ElevenLabs integration test
- [ ] AudioConcatenator integration test
- [ ] End-to-end test

## Next Steps

1. Implement `elevenlabs.test.ts`
2. Implement `audioConcatenator.test.ts`
3. Implement `e2e.test.ts`
4. Run tests and verify all pass
5. Verify cleanup works properly
