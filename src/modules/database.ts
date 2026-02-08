import {
  initModels,
  sequelize,
  Queue,
  User,
  Meditation,
  ContractUsersMeditations,
  ElevenLabsFiles,
  ContractMeditationsElevenLabsFiles,
  SoundFiles,
  ContractMeditationsSoundFiles,
} from "golightly02db";

// Initialize all database models
initModels();

// Export database instance and models
export {
  sequelize,
  Queue,
  User,
  Meditation,
  ContractUsersMeditations,
  ElevenLabsFiles,
  ContractMeditationsElevenLabsFiles,
  SoundFiles,
  ContractMeditationsSoundFiles,
};
