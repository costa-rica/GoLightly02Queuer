import * as fs from 'fs';
import * as path from 'path';
import { MantraRequestBody } from '../types';
import { ValidationError } from './errors';

/**
 * Validate POST /mantras/new request body
 * @param body - Request body to validate
 * @throws ValidationError if validation fails
 */
export function validateMantraRequest(body: any): asserts body is MantraRequestBody {
  // Check that body exists
  if (!body || typeof body !== 'object') {
    throw new ValidationError('Request body is required');
  }

  // Check userId is present and valid
  if (!body.userId) {
    throw new ValidationError('userId is required');
  }

  if (typeof body.userId !== 'number' || body.userId <= 0) {
    throw new ValidationError('userId must be a positive number');
  }

  // Check that exactly one of filenameCsv or mantraArray is provided (XOR)
  const hasFilenameCsv = body.filenameCsv && typeof body.filenameCsv === 'string';
  const hasMantraArray = body.mantraArray && Array.isArray(body.mantraArray);

  if (!hasFilenameCsv && !hasMantraArray) {
    throw new ValidationError('Either filenameCsv or mantraArray must be provided');
  }

  if (hasFilenameCsv && hasMantraArray) {
    throw new ValidationError('Cannot provide both filenameCsv and mantraArray');
  }

  // Validate filenameCsv if provided
  if (hasFilenameCsv) {
    validateFilenameCsv(body.filenameCsv);
  }

  // Validate mantraArray if provided
  if (hasMantraArray) {
    validateMantraArray(body.mantraArray);
  }
}

/**
 * Validate that CSV file exists
 * @param filenameCsv - CSV filename
 * @throws ValidationError if file doesn't exist
 */
function validateFilenameCsv(filenameCsv: string): void {
  const csvPath = path.join(
    process.env.PATH_QUEUER || '',
    'user_request_csv_files',
    filenameCsv
  );

  if (!fs.existsSync(csvPath)) {
    throw new ValidationError(`CSV file not found: ${filenameCsv}`);
  }
}

/**
 * Validate mantraArray structure
 * @param mantraArray - Array to validate
 * @throws ValidationError if array is invalid
 */
function validateMantraArray(mantraArray: any[]): void {
  if (mantraArray.length === 0) {
    throw new ValidationError('mantraArray cannot be empty');
  }

  const errors: { index: number; message: string }[] = [];

  mantraArray.forEach((element, index) => {
    // Check that element is an object
    if (!element || typeof element !== 'object') {
      errors.push({ index, message: 'Element must be an object' });
      return;
    }

    // Check that element has an id
    if (!element.id) {
      errors.push({ index, message: 'Element is missing required field: id' });
      return;
    }

    // Check that at least one of text, pause_duration, or sound_file is present
    const hasText = element.text && typeof element.text === 'string' && element.text.trim() !== '';
    const hasPause = element.pause_duration && !isNaN(Number(element.pause_duration));
    const hasSound = element.sound_file && typeof element.sound_file === 'string' && element.sound_file.trim() !== '';

    if (!hasText && !hasPause && !hasSound) {
      errors.push({
        index,
        message: 'Element must have at least one of: text, pause_duration, or sound_file',
      });
    }

    // Validate mutual exclusivity: sound_file cannot coexist with text/voice_id/speed/pause_duration
    if (hasSound) {
      const hasTextFields = hasText ||
                           (element.voice_id && element.voice_id.toString().trim() !== '') ||
                           (element.speed && element.speed.toString().trim() !== '') ||
                           hasPause;

      if (hasTextFields) {
        errors.push({
          index,
          message: 'sound_file cannot be used with text, voice_id, speed, or pause_duration in the same element',
        });
      }
    }

    // Validate voice_id if present
    if (element.voice_id && typeof element.voice_id !== 'string') {
      errors.push({ index, message: 'voice_id must be a string' });
    }

    // Validate speed if present
    if (element.speed && isNaN(Number(element.speed))) {
      errors.push({ index, message: 'speed must be a number' });
    }

    // Validate pause_duration if present
    if (element.pause_duration && isNaN(Number(element.pause_duration))) {
      errors.push({ index, message: 'pause_duration must be a number' });
    }
  });

  if (errors.length > 0) {
    throw new ValidationError('mantraArray validation failed', errors);
  }
}
