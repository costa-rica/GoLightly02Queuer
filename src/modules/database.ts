import { initModels, sequelize, Queue, User, Mantra, ContractUsersMantras, ElevenLabsFiles } from 'mantrify01db';

// Initialize all database models
initModels();

// Export database instance and models
export { sequelize, Queue, User, Mantra, ContractUsersMantras, ElevenLabsFiles };
