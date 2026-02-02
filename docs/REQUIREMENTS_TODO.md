# Mantrify01Queuer - Implementation TODO List

This TODO list breaks down the implementation of Mantrify01Queuer into manageable phases. Check off items as `[x]` when completed. Commit changes to git after completing each phase.

## Phase 1: Project Foundation

- [x] Initialize TypeScript project with Express
  - [x] Run `npm init -y`
  - [x] Install core dependencies: `express`, `dotenv`, `typescript`, `@types/node`, `@types/express`
  - [x] Install dev dependencies: `ts-node`, `nodemon`, `@types/dotenv`
- [x] Create folder structure
  - [x] Create `src/` directory
  - [x] Create `src/types/` directory
  - [x] Create `src/modules/` directory
  - [x] Create `src/routes/` directory
- [x] Configure TypeScript
  - [x] Create `tsconfig.json` with appropriate settings
  - [x] Set output directory to `dist/`
  - [x] Configure module resolution
- [x] Set up package.json scripts
  - [x] Add `build` script: `tsc`
  - [x] Add `start` script: `node dist/index.js`
  - [x] Add `dev` script: `nodemon --exec ts-node src/index.ts`
- [x] Create .env file from requirements
  - [x] Copy all environment variables from docs/REQUIREMENTS.md
  - [x] Add PATH_TO_ELEVENLABS_SERVICE=/Users/nick/Documents/RequesterElevenLabs01
  - [x] Add PATH_TO_AUDIO_FILE_CONCATENATOR=/Users/nick/Documents/AudioFileConcatenator01
  - [x] Verify all paths exist or create them
- [x] Create basic Express app structure in `src/index.ts`
  - [x] Import express and dotenv
  - [x] Load environment variables
  - [x] Create Express app instance
  - [x] Set up basic middleware (json parsing)
  - [x] Add placeholder route
  - [x] Start server on PORT

## Phase 2: Database Integration

- [x] Install Mantrify01Db package
  - [x] Install from /Users/nick/Documents/Mantrify01Db
  - [x] Run: `npm install file:/Users/nick/Documents/Mantrify01Db`
  - [x] Verify package appears in package.json dependencies
- [x] Create database module in `src/modules/database.ts`
  - [x] Import Mantrify01Db
  - [x] Initialize database connection
  - [x] Export database instance and models
- [x] Test database connection
  - [x] Verify connection to Mantrify01Db database
  - [x] Verify Queue table is accessible
  - [x] Test basic CRUD operations on Queue table
- [x] Create Queue model interface in `src/types/index.ts`
  - [x] Define QueueRecord interface matching schema
  - [x] Define QueueStatus type: "queued" | "started" | "elevenlabs" | "concatenator" | "done"

## Phase 3: Logging Setup

- [x] Install Winston: `npm install winston`
- [x] Create logger module in `src/modules/logger.ts`
  - [x] Validate required env variables (NODE_ENV, NAME_APP, PATH_TO_LOGS)
  - [x] Configure Winston transports based on NODE_ENV
  - [x] Development: console only
  - [x] Testing: console AND file
  - [x] Production: file only
  - [x] Set up file rotation with LOG_MAX_SIZE and LOG_MAX_FILES
  - [x] Export singleton logger instance
- [x] Update src/index.ts to use logger
  - [x] Import logger before other modules
  - [x] Replace any console.log with logger.info
  - [x] Implement async IIFE pattern for early exit scenarios
- [x] Test logging in all three modes
  - [x] Test development mode (console only)
  - [x] Test testing mode (console + file)
  - [x] Test production mode (file only)
  - [x] Verify log rotation works

## Phase 4: Core Type Definitions

- [x] Define types in `src/types/index.ts`
  - [x] MantraRequestBody interface (userId required, plus filenameCsv | mantraArray)
  - [x] MantraArrayElement interface (id, text, voice_id, speed, pause_duration, sound_file)
  - [x] ElevenLabsCsvRow interface (id, text, voice_id, speed)
  - [x] AudioConcatenatorCsvRow interface (id, audio_file_name_and_path, pause_duration)
  - [x] QueueRecord interface
  - [x] ChildProcessResult interface

## Phase 5: CSV and File Handler Modules

- [x] Create CSV parser module in `src/modules/csvParser.ts`
  - [x] Install csv-parse: `npm install csv-parse`
  - [x] Create function to read CSV file from filenameCsv
  - [x] Create function to parse mantraArray
  - [x] Return normalized data structure
  - [x] Handle validation and errors
- [x] Create CSV writer module in `src/modules/csvWriter.ts`
  - [x] Install csv-stringify: `npm install csv-stringify`
  - [x] Create function to write ElevenLabs CSV format
  - [x] Create function to write AudioConcatenator CSV format
  - [x] Generate unique filenames with timestamps
  - [x] Save to appropriate PATH_QUEUER subdirectories
- [x] Create file manager module in `src/modules/fileManager.ts`
  - [x] Create function to ensure directories exist
  - [x] Create function to generate unique job filenames
  - [x] Create function to validate file paths
  - [x] Create cleanup functions for temporary files

## Phase 6: Queue Management Module

- [x] Create queue manager in `src/modules/queueManager.ts`
  - [x] Create function to add new job to queue (status: "queued")
  - [x] Create function to update job status
  - [x] Create function to get next queued job
  - [x] Create function to check if queue is processing
  - [x] Implement FIFO queue processing logic
  - [x] Handle concurrent request scenarios
  - [x] Log all queue operations

## Phase 7: Child Process Management

- [x] Create child process spawner in `src/modules/childProcessSpawner.ts`
  - [x] Create generic spawn function with logging
  - [x] Capture stdout and stderr
  - [x] Handle process completion and errors
  - [x] Pass environment variables to child process
  - [x] Return process result with exit code
- [x] Create ElevenLabs handler in `src/modules/elevenLabsHandler.ts`
  - [x] Create function to generate ElevenLabs CSV from parsed data
  - [x] Create function to spawn RequesterElevenLabs01
  - [x] Use PATH_TO_ELEVENLABS_SERVICE env variable for child process location
  - [x] Pass NAME_CHILD_PROCESS_ELEVENLABS as NAME_APP to child
  - [x] Parse stdout for "Audio file created successfully:" lines
  - [x] Extract file paths from output
  - [x] Return array of generated MP3 file paths
  - [x] Handle errors and log appropriately
- [x] Create AudioConcatenator handler in `src/modules/audioConcatenatorHandler.ts`
  - [x] Create function to generate AudioConcatenator CSV
  - [x] Map ElevenLabs output files to concatenator input
  - [x] Handle pause_duration and sound_file fields
  - [x] Create function to spawn AudioFileConcatenator01
  - [x] Use PATH_TO_AUDIO_FILE_CONCATENATOR env variable for child process location
  - [x] Pass NAME_CHILD_PROCESS_AUDIO_FILE_CONCATENATOR as NAME_APP to child
  - [x] Parse stdout for final output file path
  - [x] Return final MP3 file path
  - [x] Handle errors and log appropriately

## Phase 8: Workflow Orchestrator

- [x] Create workflow orchestrator in `src/modules/workflowOrchestrator.ts`
  - [x] Create main orchestration function
  - [x] Step 1: Parse input (filenameCsv or mantraArray)
  - [x] Step 2: Create and save queue record (status: "queued")
  - [x] Step 3: Update status to "started"
  - [x] Step 4: Generate ElevenLabs CSV
  - [x] Step 5: Update status to "elevenlabs"
  - [x] Step 6: Spawn ElevenLabs child process and wait
  - [x] Step 7: Parse ElevenLabs output files
  - [x] Step 8: Update status to "concatenator"
  - [x] Step 9: Generate AudioConcatenator CSV
  - [x] Step 10: Spawn AudioConcatenator child process and wait
  - [x] Step 11: Get final output file path
  - [x] Step 12: Update status to "done"
  - [x] Step 13: Return final file path
  - [x] Handle errors at each step and update queue status
  - [x] Log completion with final file path

## Phase 9: API Routes

- [x] Create mantras router in `src/routes/mantras.ts`
  - [x] Import express Router
  - [x] Create POST /new endpoint
  - [x] Validate request body (filenameCsv XOR mantraArray, plus userId)
  - [x] Extract userId from request body
  - [x] Call workflow orchestrator
  - [x] Return success response with job details
  - [x] Handle and format errors per ERROR_REQUIREMENTS.md
- [x] Integrate router in src/index.ts
  - [x] Import mantras router
  - [x] Mount router at /mantras path
  - [x] Test route is accessible

## Phase 10: Error Handling

- [x] Create error handler middleware in `src/modules/errorHandler.ts`
  - [x] Create standard error response format
  - [x] Include: code, message, details, status
  - [x] Sanitize details in production mode
  - [x] Never expose stack traces, DB errors, or sensitive data in production
- [x] Create custom error classes in `src/modules/errors.ts`
  - [x] ValidationError (400)
  - [x] FileNotFoundError (404)
  - [x] ChildProcessError (500)
  - [x] QueueError (500)
  - [x] DatabaseError (500)
- [x] Add error middleware to src/index.ts
  - [x] Import error handler
  - [x] Add as last middleware
  - [x] Test error responses match requirements
- [x] Update all modules to throw custom errors
  - [x] Replace generic errors with custom error classes
  - [x] Add appropriate error codes
  - [x] Include helpful error messages

## Phase 11: Request Validation

- [x] Create validation module in `src/modules/validator.ts`
  - [x] Validate POST /mantras/new body structure
  - [x] Ensure filenameCsv XOR mantraArray (not both)
  - [x] Validate filenameCsv points to existing file
  - [x] Validate mantraArray structure if present
  - [x] Validate CSV row format (id, text, voice_id, speed, pause_duration, sound_file)
  - [x] Validate field types and constraints
  - [x] Return detailed validation errors
- [x] Integrate validation in mantras route
  - [x] Call validation before workflow
  - [x] Return 400 errors for validation failures

## Phase 12: Jest Integration Tests

- [x] Set up Jest testing framework
  - [x] Install Jest and dependencies: `npm install --save-dev jest @types/jest ts-jest`
  - [x] Create Jest configuration: `npx ts-jest config:init`
  - [x] Configure jest.config.js for TypeScript
  - [x] Add test script to package.json: `"test": "jest"`
  - [x] Create test/ directory at project root
- [x] Create test utilities in `test/utils/`
  - [x] Create database cleanup helper (delete queue records)
  - [x] Create file cleanup helper (delete CSV and MP3 files)
  - [x] Create test data generators (sample mantraArray data)
  - [x] Create shared test configuration
- [ ] Create ElevenLabs integration test in `test/elevenlabs.test.ts`
  - [ ] Set up test with database connection
  - [ ] Create test mantraArray with short text (e.g., "Test mantra one")
  - [ ] Include userId in test request body
  - [ ] Call workflow orchestrator with mantraArray
  - [ ] Verify queue record created in database
  - [ ] Verify ElevenLabs child process runs successfully
  - [ ] Verify MP3 file created at expected path
  - [ ] Store output file path for AudioConcatenator test
  - [ ] Verify queue status updated to appropriate stage
  - [ ] Clean up: delete queue record from database
  - [ ] Clean up: delete all generated CSV files
  - [ ] Clean up: delete all generated MP3 files from microservices
- [ ] Create AudioConcatenator integration test in `test/audioConcatenator.test.ts`
  - [ ] Set up test with database connection
  - [ ] Create test mantraArray using output from ElevenLabs test
  - [ ] Include userId in test request body
  - [ ] Include pause_duration to test silence generation
  - [ ] Call workflow orchestrator with mantraArray
  - [ ] Verify queue record created in database
  - [ ] Verify ElevenLabs child process runs (for any text entries)
  - [ ] Verify AudioConcatenator child process runs successfully
  - [ ] Verify final concatenated MP3 file created
  - [ ] Verify queue status updated to "done"
  - [ ] Clean up: delete queue record from database
  - [ ] Clean up: delete all generated CSV files
  - [ ] Clean up: delete all generated MP3 files from microservices
  - [ ] Clean up: delete temporary silence files created by AudioConcatenator
- [ ] Create end-to-end test in `test/e2e.test.ts`
  - [ ] Set up test with database connection
  - [ ] Test complete workflow from mantraArray to final MP3
  - [ ] Include multiple text entries, pauses, and optional sound files
  - [ ] Verify all queue status transitions
  - [ ] Verify all generated files exist
  - [ ] Clean up: delete queue records from database
  - [ ] Clean up: delete all generated CSV files
  - [ ] Clean up: delete all generated MP3 files from microservices
  - [ ] Clean up: delete temporary files created during processing
- [ ] Run all tests and verify passing
  - [ ] Run: `npm test`
  - [ ] Verify all tests pass
  - [ ] Verify database cleanup occurs properly (no leftover queue records)
  - [ ] Verify file cleanup occurs properly (no leftover CSV or MP3 files)
  - [ ] Review test coverage

## Phase 13: Manual Testing & Refinement

- [ ] Manual testing - single request with filenameCsv
  - [ ] Create test CSV file in PATH_QUEUER/user_request_csv_files/
  - [ ] POST to /mantras/new with filenameCsv
  - [ ] Verify queue record created
  - [ ] Verify ElevenLabs CSV generated correctly
  - [ ] Verify ElevenLabs child process runs
  - [ ] Verify AudioConcatenator CSV generated correctly
  - [ ] Verify AudioConcatenator child process runs
  - [ ] Verify final MP3 file created
  - [ ] Verify queue status updated to "done"
  - [ ] Verify logs are complete
- [ ] Manual testing - single request with mantraArray
  - [ ] POST to /mantras/new with mantraArray
  - [ ] Verify same workflow completes successfully
- [ ] Manual testing - queue processing
  - [ ] Submit multiple requests quickly
  - [ ] Verify FIFO processing order
  - [ ] Verify no race conditions
- [ ] Manual testing - error scenarios
  - [ ] Invalid CSV format
  - [ ] Missing file references
  - [ ] Child process failures
  - [ ] Verify error responses match requirements
  - [ ] Verify queue status reflects errors
- [ ] Review logging output
  - [ ] Verify appropriate log levels used
  - [ ] Verify child process logs separate from parent
  - [ ] Verify log rotation works
- [ ] Code review
  - [ ] Ensure modular structure maintained
  - [ ] Check for security vulnerabilities (injection attacks, etc.)
  - [ ] Verify no sensitive data in logs
  - [ ] Ensure error handling is comprehensive

## Phase 14: Documentation

- [ ] Create README.md following docs/README-format.md
  - [ ] Project Overview section (TypeScript + Express + SQLite)
  - [ ] Setup section (include Mantrify01Db installation)
  - [ ] Usage section (API endpoint examples)
  - [ ] Project Structure section (tree view)
  - [ ] .env section (list all variables)
  - [ ] Child Processes section (RequesterElevenLabs01 and AudioFileConcatenator01)
  - [ ] References section (link to docs)
- [ ] Review all documentation
  - [ ] Ensure REQUIREMENTS.md is up to date
  - [ ] Verify all referenced files are correct
- [ ] Final commit
  - [ ] Review all changes
  - [ ] Create final commit with complete implementation

## Additional Notes

### Environment Variables to Verify

Before starting, ensure these .env variables and paths exist:

- PATH_PROJECT_RESOURCES
- PATH_QUEUER (with subdirectories: user_request_csv_files, eleven_labs_csv_files, audio_csv_files)
- PATH_TO_LOGS
- PATH_SAVED_ELEVENLABS_AUDIO_MP3_OUTPUT
- PATH_USER_ELEVENLABS_CSV_FILES
- PATH_AUDIO_CSV_FILE
- PATH_MP3_OUTPUT
- PATH_TO_ELEVENLABS_SERVICE (confirmed: /Users/nick/Documents/RequesterElevenLabs01)
- PATH_TO_AUDIO_FILE_CONCATENATOR (confirmed: /Users/nick/Documents/AudioFileConcatenator01)

If any paths don't exist, they should be created during Phase 1.

### Custom Package Dependencies

- Mantrify01Db: Located at /Users/nick/Documents/Mantrify01Db, install with `npm install file:/Users/nick/Documents/Mantrify01Db`
- RequesterElevenLabs01: Located at /Users/nick/Documents/RequesterElevenLabs01 (PATH_TO_ELEVENLABS_SERVICE)
- AudioFileConcatenator01: Located at /Users/nick/Documents/AudioFileConcatenator01 (PATH_TO_AUDIO_FILE_CONCATENATOR)

### Key Workflow Decisions

- CSV files generated for child processes should be stored in appropriate subdirectories of PATH_QUEUER
- Child process log files should use NAME_CHILD_PROCESS_* environment variables
- Queue table updates should happen synchronously to maintain FIFO order
- Error handling should gracefully handle child process failures and update queue status
- userId is passed in the request body (not from JWT/authentication)
- Child processes are spawned from paths defined in PATH_TO_ELEVENLABS_SERVICE and PATH_TO_AUDIO_FILE_CONCATENATOR

### Testing Approach

- Jest tests simulate API requests with mantraArray format
- Tests use real database and create/cleanup queue records
- ElevenLabs test uses short text for quick execution
- AudioConcatenator test uses ElevenLabs test output file
- All tests MUST clean up after completion:
  - Delete all queue records from database
  - Delete all CSV files generated for microservices
  - Delete all MP3 files created by ElevenLabs
  - Delete all MP3 files created by AudioConcatenator
  - Delete any temporary files created during processing
