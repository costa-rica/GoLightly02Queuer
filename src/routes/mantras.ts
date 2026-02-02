import { Router, Request, Response, NextFunction } from 'express';
import logger from '../modules/logger';
import { validateMantraRequest } from '../modules/validator';
import { orchestrateMantraCreation } from '../modules/workflowOrchestrator';
import { MantraRequestBody } from '../types';

const router = Router();

/**
 * POST /mantras/new
 * Create a new mantra from CSV file or array
 */
router.post('/new', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Received POST /mantras/new request');

    // Validate request body
    validateMantraRequest(req.body);

    const requestBody: MantraRequestBody = req.body;

    // Log request details
    logger.info(`Processing mantra request for user ${requestBody.userId}`);
    if (requestBody.filenameCsv) {
      logger.info(`Using CSV file: ${requestBody.filenameCsv}`);
    } else if (requestBody.mantraArray) {
      logger.info(`Using mantraArray with ${requestBody.mantraArray.length} elements`);
    }

    // Orchestrate mantra creation workflow
    const result = await orchestrateMantraCreation(requestBody);

    if (result.success) {
      logger.info(`Mantra creation successful: ${result.finalFilePath}`);

      res.status(200).json({
        success: true,
        queueId: result.queueId,
        finalFilePath: result.finalFilePath,
        message: 'Mantra created successfully',
      });
    } else {
      logger.error(`Mantra creation failed: ${result.error}`);

      res.status(500).json({
        success: false,
        queueId: result.queueId,
        error: {
          code: 'WORKFLOW_FAILED',
          message: result.error || 'Mantra creation failed',
          status: 500,
        },
      });
    }
  } catch (error) {
    // Pass error to error handler middleware
    next(error);
  }
});

export default router;
