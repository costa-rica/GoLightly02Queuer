import * as fs from "fs";
import * as path from "path";
import { stringify } from "csv-stringify/sync";
import logger from "./logger";
import { ElevenLabsCsvRow, AudioConcatenatorCsvRow } from "../types";

/**
 * Write ElevenLabs CSV file
 * @param rows - Array of ElevenLabs CSV rows
 * @param filename - Output filename (will be saved in .env PATH_USER_ELEVENLABS_CSV_FILES )
 * @returns Full path to the created CSV file
 */
export function writeElevenLabsCsv(
  rows: ElevenLabsCsvRow[],
  filename: string,
): string {
  // Trigger an error if the environment variable is not set
  if (!process.env.PATH_USER_ELEVENLABS_CSV_FILES) {
    throw new Error("PATH_USER_ELEVENLABS_CSV_FILES is not set");
  }
  const outputPath = path.join(
    process.env.PATH_USER_ELEVENLABS_CSV_FILES,
    filename,
  );

  logger.info(
    `Writing ElevenLabs CSV with ${rows.length} rows to: ${outputPath}`,
  );

  // Ensure directory exists
  if (!fs.existsSync(process.env.PATH_USER_ELEVENLABS_CSV_FILES)) {
    fs.mkdirSync(process.env.PATH_USER_ELEVENLABS_CSV_FILES, {
      recursive: true,
    });
  }

  // Convert to CSV string
  const csvContent = stringify(rows, {
    header: true,
    columns: ["id", "text", "voice_id", "speed"],
  });

  // Write to file
  fs.writeFileSync(outputPath, csvContent, "utf-8");

  logger.info(`ElevenLabs CSV file created successfully: ${outputPath}`);

  return outputPath;
}

/**
 * Write AudioConcatenator CSV file
 * @param rows - Array of AudioConcatenator CSV rows
 * @param filename - Output filename (will be saved in .env PATH_AUDIO_CSV_FILE)
 * @returns Full path to the created CSV file
 */
export function writeAudioConcatenatorCsv(
  rows: AudioConcatenatorCsvRow[],
  filename: string,
): string {
  // Trigger an error if the environment variable is not set
  if (!process.env.PATH_AUDIO_CSV_FILE) {
    throw new Error("PATH_AUDIO_CSV_FILE is not set");
  }
  const outputPath = path.join(process.env.PATH_AUDIO_CSV_FILE, filename);

  logger.info(
    `Writing AudioConcatenator CSV with ${rows.length} rows to: ${outputPath}`,
  );

  // Ensure directory exists
  if (!fs.existsSync(process.env.PATH_AUDIO_CSV_FILE)) {
    fs.mkdirSync(process.env.PATH_AUDIO_CSV_FILE, { recursive: true });
  }

  // Convert to CSV string
  const csvContent = stringify(rows, {
    header: true,
    columns: ["id", "audio_file_name_and_path", "pause_duration"],
  });

  // Write to file
  fs.writeFileSync(outputPath, csvContent, "utf-8");

  logger.info(`AudioConcatenator CSV file created successfully: ${outputPath}`);

  return outputPath;
}

/**
 * Generate unique CSV filename with timestamp
 * @param prefix - Prefix for the filename (e.g., 'elevenlabs', 'audio')
 * @returns Unique filename with timestamp
 */
export function generateCsvFilename(prefix: string): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "_");
  return `${prefix}_${timestamp}.csv`;
}
