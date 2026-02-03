import * as path from 'path';
import { Mantra, ContractUsersMantras } from './database';
import logger from './logger';

/**
 * Parse full file path to extract directory path and filename
 * @param fullPath - Full path to the file (e.g., "/path/to/output_20260202_153045.mp3")
 * @returns Object with filePath (directory), filename, and title (filename without extension)
 */
export function parseFilePath(fullPath: string): {
  filePath: string;
  filename: string;
  title: string;
} {
  // Extract the filename (everything after the last "/")
  const filename = path.basename(fullPath);

  // Extract the directory path (everything before the last "/", including the trailing "/")
  const dirPath = path.dirname(fullPath);
  const filePath = dirPath + '/';

  // Extract title (filename without extension)
  const title = path.parse(filename).name;

  return { filePath, filename, title };
}

/**
 * Create Mantra record in database
 * @param fullPath - Full path to the mantra MP3 file
 * @returns Created Mantra record
 */
export async function createMantraRecord(fullPath: string): Promise<any> {
  logger.info(`Creating Mantra record for: ${fullPath}`);

  const { filePath, filename, title } = parseFilePath(fullPath);

  logger.info(`Parsed path - filePath: ${filePath}, filename: ${filename}, title: ${title}`);

  const mantra = await Mantra.create({
    title,
    description: null,
    filename,
    filePath,
  });

  logger.info(`Mantra record created successfully: ID ${mantra.id}`);

  return mantra;
}

/**
 * Create ContractUsersMantras record to link user with mantra
 * @param userId - User ID
 * @param mantraId - Mantra ID
 * @returns Created ContractUsersMantras record
 */
export async function createUserMantraContract(
  userId: number,
  mantraId: number
): Promise<any> {
  logger.info(`Creating ContractUsersMantras record for userId: ${userId}, mantraId: ${mantraId}`);

  const contract = await ContractUsersMantras.create({
    userId,
    mantraId,
  });

  logger.info(`ContractUsersMantras record created successfully: ID ${contract.id}`);

  return contract;
}

/**
 * Create Mantra record and link to user after AudioConcatenator completes
 * @param fullPath - Full path to the mantra MP3 file
 * @param userId - User ID who requested the mantra
 * @returns Created Mantra record with ID
 */
export async function saveMantraToDatabase(
  fullPath: string,
  userId: number
): Promise<any> {
  logger.info(`Saving mantra to database for userId: ${userId}`);

  try {
    // Create Mantra record
    const mantra = await createMantraRecord(fullPath);

    // Create ContractUsersMantras record
    await createUserMantraContract(userId, mantra.id);

    logger.info(`Mantra saved successfully to database: Mantra ID ${mantra.id}`);

    return mantra;
  } catch (error) {
    logger.error('Failed to save mantra to database:', error);
    throw new Error('Failed to save mantra to database');
  }
}
