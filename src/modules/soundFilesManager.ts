import logger from './logger';
import { SoundFiles, ContractMantrasSoundFiles } from './database';
import { MantraArrayElement } from '../types';

/**
 * Find SoundFiles IDs based on sound file filenames from mantra elements
 * @param mantraElements - Original mantra elements that may contain sound_file references
 * @returns Array of SoundFiles IDs that were referenced in the mantra
 */
export async function findSoundFilesInMantra(
  mantraElements: MantraArrayElement[]
): Promise<number[]> {
  logger.info('Finding sound files referenced in mantra elements');

  // Filter mantra elements to only those with sound_file
  const soundFileElements = mantraElements.filter(
    (element) => element.sound_file && element.sound_file.trim() !== ''
  );

  if (soundFileElements.length === 0) {
    logger.info('No sound files found in mantra elements');
    return [];
  }

  logger.info(`Found ${soundFileElements.length} sound file references in mantra elements`);

  const soundFileIds: number[] = [];

  // Find each sound file in the database
  for (const element of soundFileElements) {
    const filename = element.sound_file!;

    try {
      // Look up the sound file by filename
      const soundFile = await SoundFiles.findOne({
        where: { filename },
      });

      if (soundFile) {
        soundFileIds.push(soundFile.id);
        logger.info(`Found SoundFiles record ${soundFile.id} for filename: ${filename}`);
      } else {
        logger.warn(`SoundFiles record not found for filename: ${filename}`);
      }
    } catch (error) {
      logger.error(`Failed to find SoundFiles record for ${filename}:`, error);
      throw error;
    }
  }

  logger.info(`Successfully found ${soundFileIds.length} SoundFiles records`);

  // Deduplicate sound file IDs (same sound file may be used multiple times in one mantra)
  const uniqueSoundFileIds = Array.from(new Set(soundFileIds));

  if (uniqueSoundFileIds.length < soundFileIds.length) {
    logger.info(`Deduplicated ${soundFileIds.length} references to ${uniqueSoundFileIds.length} unique SoundFiles`);
  }

  return uniqueSoundFileIds;
}

/**
 * Link Mantra to SoundFiles records via ContractMantrasSoundFiles
 * @param mantraId - ID of the Mantra record
 * @param soundFileIds - Array of SoundFiles IDs to link
 * @returns Array of created ContractMantrasSoundFiles record IDs
 */
export async function linkMantraToSoundFiles(
  mantraId: number,
  soundFileIds: number[]
): Promise<number[]> {
  logger.info(`Linking Mantra ${mantraId} to ${soundFileIds.length} SoundFiles records`);

  const createdIds: number[] = [];

  // Create a contract record for each SoundFiles ID
  for (const soundFilesId of soundFileIds) {
    try {
      const contract = await ContractMantrasSoundFiles.create({
        mantraId,
        soundFilesId,
      });

      createdIds.push(contract.id);
      logger.info(`Created ContractMantrasSoundFiles record ${contract.id}: mantraId=${mantraId}, soundFilesId=${soundFilesId}`);
    } catch (error) {
      logger.error(`Failed to create ContractMantrasSoundFiles for mantraId=${mantraId}, soundFilesId=${soundFilesId}:`, error);
      throw error;
    }
  }

  logger.info(`Successfully linked Mantra ${mantraId} to ${createdIds.length} SoundFiles records`);

  return createdIds;
}
