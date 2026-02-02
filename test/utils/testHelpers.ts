import { Queue, User } from '../../src/modules/database';
import { deleteFiles } from '../../src/modules/fileManager';
import logger from '../../src/modules/logger';

/**
 * Clean up database records created during tests
 * @param queueIds - Array of queue IDs to delete
 */
export async function cleanupDatabaseRecords(queueIds: number[]): Promise<void> {
  for (const id of queueIds) {
    try {
      await Queue.destroy({ where: { id } });
      logger.info(`Deleted test queue record: ${id}`);
    } catch (error) {
      logger.warn(`Failed to delete queue record ${id}:`, error);
    }
  }
}

/**
 * Clean up files created during tests
 * @param filePaths - Array of file paths to delete
 */
export function cleanupTestFiles(filePaths: string[]): void {
  deleteFiles(filePaths);
  logger.info(`Deleted ${filePaths.length} test files`);
}

/**
 * Get or create a test user
 * @returns Test user record
 */
export async function getOrCreateTestUser(): Promise<any> {
  let testUser = await User.findOne({ where: { email: 'test@mantrify.com' } });

  if (!testUser) {
    testUser = await User.create({
      email: 'test@mantrify.com',
      password: '$2b$10$test.hash.here',
      isEmailVerified: true,
      isAdmin: false,
    });
    logger.info(`Created test user: ${testUser.id}`);
  }

  return testUser;
}

/**
 * Sample mantra array for testing
 */
export function getSampleMantraArray() {
  return [
    {
      id: '1',
      text: 'This is a test mantra',
      voice_id: 'Xb7hH8MSUJpSbSDYk0k2',
      speed: '1.0',
    },
    {
      id: '2',
      pause_duration: '2.0',
    },
    {
      id: '3',
      text: 'Another test phrase',
      voice_id: 'Xb7hH8MSUJpSbSDYk0k2',
      speed: '0.9',
    },
  ];
}
