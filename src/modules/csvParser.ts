import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import logger from './logger';
import { MantraArrayElement } from '../types';

/**
 * Read and parse CSV file from filenameCsv
 * @param filenameCsv - The name of the CSV file (located in PATH_QUEUER/user_request_csv_files/)
 * @returns Array of MantraArrayElement objects
 */
export function parseCsvFile(filenameCsv: string): MantraArrayElement[] {
  const csvFilePath = path.join(
    process.env.PATH_QUEUER || '',
    'user_request_csv_files',
    filenameCsv
  );

  logger.info(`Reading CSV file: ${csvFilePath}`);

  if (!fs.existsSync(csvFilePath)) {
    throw new Error(`CSV file not found: ${csvFilePath}`);
  }

  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: false  // Keep all values as strings initially
  });

  logger.info(`Parsed ${records.length} rows from CSV file`);

  // Convert to MantraArrayElement format
  const mantraElements: MantraArrayElement[] = records.map((record: any) => ({
    id: record.id,
    text: record.text || undefined,
    voice_id: record.voice_id || undefined,
    speed: record.speed || undefined,
    pause_duration: record.pause_duration || undefined,
    sound_file: record.sound_file || undefined,
  }));

  return mantraElements;
}

/**
 * Validate and normalize mantraArray from request body
 * @param mantraArray - The mantra array from the request body
 * @returns Validated array of MantraArrayElement objects
 */
export function parseMantraArray(mantraArray: any[]): MantraArrayElement[] {
  if (!Array.isArray(mantraArray)) {
    throw new Error('mantraArray must be an array');
  }

  if (mantraArray.length === 0) {
    throw new Error('mantraArray cannot be empty');
  }

  logger.info(`Parsing mantraArray with ${mantraArray.length} elements`);

  // Validate and normalize each element
  const normalized: MantraArrayElement[] = mantraArray.map((element, index) => {
    if (!element.id) {
      throw new Error(`mantraArray element at index ${index} is missing 'id' field`);
    }

    return {
      id: element.id,
      text: element.text || undefined,
      voice_id: element.voice_id || undefined,
      speed: element.speed || undefined,
      pause_duration: element.pause_duration || undefined,
      sound_file: element.sound_file || undefined,
    };
  });

  return normalized;
}
