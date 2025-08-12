// Upload new mock data with single-set system
import { bulkOperations } from '../services/firestore';
import { 
  mockTeacher, 
  mockStudents, 
  mockPrograms, 
  mockMethods, 
  mockDailyEntries,
  mockStudentProgressions 
} from '../data/mockData';

export const uploadNewMockData = async () => {
  try {
    console.log('🚀 Starting new mock data upload...');
    
    await bulkOperations.uploadMockData(
      [mockTeacher],
      mockStudents,
      mockPrograms,
      mockMethods,
      mockDailyEntries,
      mockStudentProgressions
    );
    
    console.log('✅ New mock data upload completed successfully!');
    console.log('📊 Data Summary:');
    console.log(`- Teachers: 1`);
    console.log(`- Students: ${mockStudents.length}`);
    console.log(`- Programs: ${mockPrograms.length}`);
    console.log(`- Methods: ${mockMethods.length}`);
    console.log(`- Daily Entries: ${mockDailyEntries.length}`);
    console.log(`- Student Progressions: ${mockStudentProgressions.length}`);
    
  } catch (error) {
    console.error('❌ Error uploading new mock data:', error);
    throw error;
  }
};

// Function already exported above