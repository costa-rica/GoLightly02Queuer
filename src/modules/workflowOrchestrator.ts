import logger from './logger';
import { MantraRequestBody, MantraArrayElement, WorkflowResult } from '../types';
import { parseCsvFile, parseMantraArray } from './csvParser';
import { addJobToQueue, updateJobStatus } from './queueManager';
import { generateJobFilename } from './fileManager';
import { runElevenLabsWorkflow } from './elevenLabsHandler';
import { runAudioConcatenatorWorkflow } from './audioConcatenatorHandler';

/**
 * Main workflow orchestrator for mantra creation
 * @param requestBody - Request body containing userId and either filenameCsv or mantraArray
 * @returns Workflow result with final file path
 */
export async function orchestrateMantraCreation(requestBody: MantraRequestBody): Promise<WorkflowResult> {
  const { userId, filenameCsv, mantraArray } = requestBody;

  logger.info(`Starting mantra creation workflow for user ${userId}`);

  let queueId: number | undefined;

  try {
    // Step 1: Parse input (filenameCsv or mantraArray)
    logger.info('Step 1: Parsing input data');
    let mantraElements: MantraArrayElement[];

    if (filenameCsv) {
      logger.info(`Parsing CSV file: ${filenameCsv}`);
      mantraElements = parseCsvFile(filenameCsv);
    } else if (mantraArray) {
      logger.info(`Parsing mantra array with ${mantraArray.length} elements`);
      mantraElements = parseMantraArray(mantraArray);
    } else {
      throw new Error('Either filenameCsv or mantraArray must be provided');
    }

    logger.info(`Parsed ${mantraElements.length} mantra elements`);

    // Step 2: Create and save queue record (status: "queued")
    logger.info('Step 2: Creating queue record');
    const jobFilename = generateJobFilename(userId);
    const queueRecord = await addJobToQueue(userId, jobFilename);
    queueId = queueRecord.id!;

    logger.info(`Queue record created with ID: ${queueId}`);

    // Step 3: Update status to "started"
    logger.info('Step 3: Updating status to started');
    await updateJobStatus(queueId, 'started');

    // Step 4-7: Run ElevenLabs workflow
    logger.info('Step 4-7: Running ElevenLabs workflow');
    await updateJobStatus(queueId, 'elevenlabs');

    const elevenLabsFiles = await runElevenLabsWorkflow(mantraElements);

    logger.info(`ElevenLabs workflow completed with ${elevenLabsFiles.length} files`);

    // Step 8-11: Run AudioConcatenator workflow
    logger.info('Step 8-11: Running AudioConcatenator workflow');
    await updateJobStatus(queueId, 'concatenator');

    const finalFilePath = await runAudioConcatenatorWorkflow(mantraElements, elevenLabsFiles);

    logger.info(`AudioConcatenator workflow completed: ${finalFilePath}`);

    // Step 12: Update status to "done"
    logger.info('Step 12: Updating status to done');
    await updateJobStatus(queueId, 'done');

    // Step 13: Return final file path
    logger.info(`Mantra creation workflow completed successfully: ${finalFilePath}`);

    return {
      success: true,
      queueId,
      finalFilePath,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Workflow failed: ${errorMessage}`, error);

    // Update queue status to reflect error if queueId exists
    if (queueId) {
      try {
        // We could add an 'error' or 'failed' status, but for now leave it at current status
        logger.error(`Workflow failed at queue ${queueId}`);
      } catch (updateError) {
        logger.error('Failed to update queue status after error:', updateError);
      }
    }

    return {
      success: false,
      queueId: queueId || -1,
      error: errorMessage,
    };
  }
}
