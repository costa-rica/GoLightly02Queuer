import * as fs from 'fs';
import * as path from 'path';
import { stringify } from 'csv-stringify/sync';
import logger from './logger';
import { ElevenLabsCsvRow, AudioConcatenatorCsvRow } from '../types';

/**
 * Write ElevenLabs CSV file
 * @param rows - Array of ElevenLabs CSV rows
 * @param filename - Output filename (will be saved in PATH_QUEUER/eleven_labs_csv_files/)
 * @returns Full path to the created CSV file
 */
export function writeElevenLabsCsv(rows: ElevenLabsCsvRow[], filename: string): string {
  const outputDir = path.join(
    process.env.PATH_QUEUER || '',
    'eleven_labs_csv_files'
  );

  const outputPath = path.join(outputDir, filename);

  logger.info(`Writing ElevenLabs CSV with ${rows.length} rows to: ${outputPath}`);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Convert to CSV string
  const csvContent = stringify(rows, {
    header: true,
    columns: ['id', 'text', 'voice_id', 'speed']
  });

  // Write to file
  fs.writeFileSync(outputPath, csvContent, 'utf-8');

  logger.info(`ElevenLabs CSV file created successfully: ${outputPath}`);

  return outputPath;
}

/**
 * Write AudioConcatenator CSV file
 * @param rows - Array of AudioConcatenator CSV rows
 * @param filename - Output filename (will be saved in PATH_QUEUER/audio_csv_files/)
 * @returns Full path to the created CSV file
 */
export function writeAudioConcatenatorCsv(rows: AudioConcatenatorCsvRow[], filename: string): string {
  const outputDir = path.join(
    process.env.PATH_QUEUER || '',
    'audio_csv_files'
  );

  const outputPath = path.join(outputDir, filename);

  logger.info(`Writing AudioConcatenator CSV with ${rows.length} rows to: ${outputPath}`);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Convert to CSV string
  const csvContent = stringify(rows, {
    header: true,
    columns: ['id', 'audio_file_name_and_path', 'pause_duration']
  });

  // Write to file
  fs.writeFileSync(outputPath, csvContent, 'utf-8');

  logger.info(`AudioConcatenator CSV file created successfully: ${outputPath}`);

  return outputPath;
}

/**
 * Generate unique CSV filename with timestamp
 * @param prefix - Prefix for the filename (e.g., 'elevenlabs', 'audio')
 * @returns Unique filename with timestamp
 */
export function generateCsvFilename(prefix: string): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '').replace('T', '_');
  return `${prefix}_${timestamp}.csv`;
}
