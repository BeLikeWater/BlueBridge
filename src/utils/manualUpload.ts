// Manual upload function for console use
import { 
  collection, 
  doc, 
  addDoc, 
  writeBatch,
  getDocs,
  deleteDoc,
  setDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  mockTeacher, 
  mockStudents, 
  mockPrograms, 
  mockMethods, 
  mockDailyEntries,
  mockStudentProgressions 
} from '../data/mockData';

// Collection names
const COLLECTIONS = {
  teachers: 'teachers',
  students: 'students',
  programs: 'programs',
  methods: 'methods',
  dailyEntries: 'dailyEntries',
  studentProgressions: 'studentProgressions'
};

// Clear collection function
const clearCollection = async (collectionName: string): Promise<void> => {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    
    if (snapshot.empty) {
      console.log(`Collection ${collectionName} is already empty`);
      return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
      batch.delete(document.ref);
    });
    
    await batch.commit();
    console.log(`✅ Cleared ${snapshot.docs.length} documents from ${collectionName}`);
  } catch (error) {
    console.error(`Error clearing collection ${collectionName}:`, error);
    throw error;
  }
};

export const manualUploadMockData = async () => {
  try {
    console.log('🚀 Starting manual mock data upload...');
    
    // Debug: Check db and collections
    console.log('🔍 Debug - DB:', db);
    console.log('🔍 Debug - Collections:', COLLECTIONS);
    
    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await clearCollection('teachers');
    await clearCollection('students');
    await clearCollection('programs');
    await clearCollection('methods');
    await clearCollection('dailyEntries');
    await clearCollection('studentProgressions');

    console.log('📝 Uploading new mock data...');

    // Add teacher with fixed ID
    console.log('👨‍🏫 Adding teacher...');
    try {
      await setDoc(doc(db, 'teachers', 'teacher-1'), mockTeacher);
      console.log('✅ Teacher added with ID: teacher-1');
    } catch (error) {
      console.error('❌ Teacher error:', error);
    }

    // Add students with fixed IDs
    console.log('👨‍🎓 Adding students...');
    const studentIds = ['student-1', 'student-2', 'student-3'];
    for (let i = 0; i < mockStudents.length; i++) {
      try {
        await setDoc(doc(db, 'students', studentIds[i]), mockStudents[i]);
        console.log(`✅ Student ${i+1} added with ID: ${studentIds[i]}`);
      } catch (error) {
        console.error(`❌ Student ${i+1} error:`, error);
      }
    }

    // Add programs with fixed IDs
    console.log('📚 Adding programs...');
    const programIds = ['program-1', 'program-2', 'program-3'];
    for (let i = 0; i < mockPrograms.length; i++) {
      try {
        await setDoc(doc(db, 'programs', programIds[i]), mockPrograms[i]);
        console.log(`✅ Program ${i+1} added with ID: ${programIds[i]}`);
      } catch (error) {
        console.error(`❌ Program ${i+1} error:`, error);
      }
    }

    // Add methods with fixed IDs
    console.log('🔧 Adding methods...');
    const methodIds = ['method-1', 'method-2', 'method-3'];
    for (let i = 0; i < mockMethods.length; i++) {
      try {
        await setDoc(doc(db, 'methods', methodIds[i]), mockMethods[i]);
        console.log(`✅ Method ${i+1} added with ID: ${methodIds[i]}`);
      } catch (error) {
        console.error(`❌ Method ${i+1} error:`, error);
      }
    }

    // Add daily entries with auto IDs (they reference fixed IDs above)
    console.log('📝 Adding daily entries...');
    for (let i = 0; i < mockDailyEntries.length; i++) {
      try {
        await addDoc(collection(db, 'dailyEntries'), mockDailyEntries[i]);
        console.log(`✅ Daily entry ${i+1} added`);
      } catch (error) {
        console.error(`❌ Daily entry ${i+1} error:`, error);
      }
    }

    // Add student progressions with fixed IDs
    console.log('📈 Adding student progressions...');
    const progressionIds = ['progression-1', 'progression-2', 'progression-3'];
    for (let i = 0; i < mockStudentProgressions.length; i++) {
      try {
        await setDoc(doc(db, 'studentProgressions', progressionIds[i]), mockStudentProgressions[i]);
        console.log(`✅ Student progression ${i+1} added with ID: ${progressionIds[i]}`);
      } catch (error) {
        console.error(`❌ Student progression ${i+1} error:`, error);
      }
    }
    
    console.log('✅ Manual mock data upload completed successfully!');
    console.log('📊 Data Summary:');
    console.log(`- Teachers: 1`);
    console.log(`- Students: ${mockStudents.length}`);
    console.log(`- Programs: ${mockPrograms.length}`);
    console.log(`- Methods: ${mockMethods.length}`);
    console.log(`- Daily Entries: ${mockDailyEntries.length}`);
    console.log(`- Student Progressions: ${mockStudentProgressions.length}`);
    
  } catch (error) {
    console.error('❌ Error uploading mock data:', error);
    throw error;
  }
};

// Debug function to check Firestore data
export const debugFirestoreData = async () => {
  try {
    console.log('🔍 Debugging Firestore data...');
    
    // Get students
    const studentsSnapshot = await getDocs(collection(db, 'students'));
    console.log('👨‍🎓 Students:', studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    // Get programs  
    const programsSnapshot = await getDocs(collection(db, 'programs'));
    console.log('📚 Programs:', programsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    // Get methods
    const methodsSnapshot = await getDocs(collection(db, 'methods'));
    console.log('🔧 Methods:', methodsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    // Get daily entries
    const entriesSnapshot = await getDocs(collection(db, 'dailyEntries'));
    console.log('📝 Daily Entries:', entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
    // Get progressions
    const progressionsSnapshot = await getDocs(collection(db, 'studentProgressions'));
    console.log('📈 Student Progressions:', progressionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

// Make it available globally for console use
if (typeof window !== 'undefined') {
  (window as any).uploadData = manualUploadMockData;
  (window as any).manualUploadMockData = manualUploadMockData;
  (window as any).debugData = debugFirestoreData;
}