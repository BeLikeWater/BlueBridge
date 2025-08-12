// Direct upload of new mock data
import { bulkOperations } from '../services/firestore';
import { 
  mockTeacher, 
  mockStudents, 
  mockPrograms, 
  mockMethods, 
  mockDailyEntries,
  mockStudentProgressions 
} from '../data/mockData';

const directUpload = async () => {
  try {
    console.log('🚀 Starting direct mock data upload...');
    
    await bulkOperations.uploadMockData(
      [mockTeacher],
      mockStudents,
      mockPrograms,
      mockMethods,
      mockDailyEntries,
      mockStudentProgressions
    );
    
    console.log('✅ Direct mock data upload completed successfully!');
    
  } catch (error) {
    console.error('❌ Error uploading mock data:', error);
    throw error;
  }
};

// Çalıştır
directUpload();