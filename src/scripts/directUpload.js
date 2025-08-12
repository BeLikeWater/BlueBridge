// Direct upload of new mock data
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, getDocs, addDoc, updateDoc, deleteDoc, writeBatch } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAHZhLCCH5OgzPsECNmjz3f8qJP7WY8VHI",
  authDomain: "mavikopru-e4d6e.firebaseapp.com",
  projectId: "mavikopru-e4d6e",
  storageBucket: "mavikopru-e4d6e.firebasestorage.app",
  messagingSenderId: "159901080885",
  appId: "1:159901080885:web:5b8e8b01e8d7c5b1e25e8f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Collection names
const COLLECTIONS = {
  teachers: 'teachers',
  students: 'students',
  programs: 'programs',
  methods: 'methods',
  dailyEntries: 'dailyEntries',
  studentProgressions: 'studentProgressions'
};

// Mock data
const mockTeacher = {
  name: 'Ayşe Öğretmen',
  email: 'ayse.ogretmen@mavikopru.com',
  createdAt: '2024-01-15'
};

const mockStudents = [
  {
    name: 'Aras Demir',
    age: 6,
    birthDate: '2018-03-15',
    diagnosis: 'Otizm Spektrum Bozukluğu',
    teacherId: 'teacher-1',
    notes: 'Sosyal iletişimde gelişim gösteriyor, motor beceriler çalışılması gerekiyor.',
    isActive: true,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20'
  },
  {
    name: 'Zeynep Yılmaz',
    age: 7,
    birthDate: '2017-08-22',
    diagnosis: 'Asperger Sendromu',
    teacherId: 'teacher-1',
    notes: 'Akademik başarısı yüksek, sosyal etkileşim alanında destek alıyor.',
    isActive: true,
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22'
  },
  {
    name: 'Ege Kaya',
    age: 5,
    birthDate: '2019-01-10',
    diagnosis: 'Otizm Spektrum Bozukluğu',
    teacherId: 'teacher-1',
    notes: 'Dil gelişiminde gecikme, görsel desteklerle öğrenme hızlanıyor.',
    isActive: true,
    createdAt: '2024-01-25',
    updatedAt: '2024-01-25'
  }
];

const mockPrograms = [
  {
    name: 'IM.VT.1 Video Modeli ile Motor Taklit',
    description: 'Video modeli kullanarak motor becerilerin taklit edilmesini öğretme programı.',
    teacherId: 'teacher-1',
    createdAt: '2024-01-16'
  },
  {
    name: 'SC.RT.2 Sosyal İletişim ve Rutinler',
    description: 'Günlük rutinler içerisinde sosyal iletişim becerilerinin geliştirilmesi programı.',
    teacherId: 'teacher-1',
    createdAt: '2024-01-18'
  },
  {
    name: 'CB.AV.3 Davranış Analizi ve Değiştirme',
    description: 'Problem davranışların analiz edilip olumlu davranışlarla değiştirilmesi programı.',
    teacherId: 'teacher-1',
    createdAt: '2024-01-20'
  }
];

const mockMethods = [
  {
    name: 'Ayrık Denemelerle Öğrenim (DTT)',
    description: 'Strukturlu öğretim yöntemi.',
    programId: 'program-1',
    teacherId: 'teacher-1',
    createdAt: '2024-01-16'
  },
  {
    name: 'Doğal Ortam Öğretimi (NET)',
    description: 'Doğal ortamlarda gerçekleştirilen öğretim.',
    programId: 'program-1',
    teacherId: 'teacher-1',
    createdAt: '2024-01-16'
  },
  {
    name: 'Sosyal Hikaye Tekniği',
    description: 'Sosyal durumları açıklayan kısa hikayelerle öğretim.',
    programId: 'program-2',
    teacherId: 'teacher-1',
    createdAt: '2024-01-18'
  }
];

const mockStudentProgressions = [
  {
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    currentSet: 3,
    set1CompletedAt: '2024-12-05',
    set2CompletedAt: '2024-12-12',
    updatedAt: '2024-12-17'
  },
  {
    studentId: 'student-2',
    programId: 'program-2',
    methodId: 'method-3',
    currentSet: 2,
    set1CompletedAt: '2024-12-02',
    updatedAt: '2024-12-15'
  },
  {
    studentId: 'student-3',
    programId: 'program-1',
    methodId: 'method-2',
    currentSet: 1,
    updatedAt: '2024-12-01'
  }
];

const mockDailyEntries = [
  // Aras Demir - Set 1
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-01', setNumber: 1, score: 2, notes: 'Set 1 başlangıç', teacherId: 'teacher-1', createdAt: '2024-12-01' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-02', setNumber: 1, score: 3, notes: 'Set 1 - hafif iyileşme', teacherId: 'teacher-1', createdAt: '2024-12-02' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-03', setNumber: 1, score: null, absenceReason: 'Hastalık - grip', teacherId: 'teacher-1', createdAt: '2024-12-03' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-04', setNumber: 1, score: 4, notes: 'Set 1 - hastalık sonrası toparlandı', teacherId: 'teacher-1', createdAt: '2024-12-04' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-05', setNumber: 1, score: 5, notes: 'Set 1 tamamlandı! Set 2\'ye geçiş', teacherId: 'teacher-1', createdAt: '2024-12-05' },
  
  // Aras Demir - Set 2
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-08', setNumber: 2, score: 3, notes: 'Set 2 başlangıç - yeni zorluklar', teacherId: 'teacher-1', createdAt: '2024-12-08' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-09', setNumber: 2, score: 4, notes: 'Set 2 - adaptasyon süreci', teacherId: 'teacher-1', createdAt: '2024-12-09' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-10', setNumber: 2, score: null, absenceReason: 'Aile tatili', teacherId: 'teacher-1', createdAt: '2024-12-10' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-11', setNumber: 2, score: null, absenceReason: 'Aile tatili', teacherId: 'teacher-1', createdAt: '2024-12-11' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-12', setNumber: 2, score: 5, notes: 'Set 2 tamamlandı! Set 3\'e geçiş', teacherId: 'teacher-1', createdAt: '2024-12-12' },
  
  // Aras Demir - Set 3
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-15', setNumber: 3, score: 4, notes: 'Set 3 başlangıç - en ileri seviye', teacherId: 'teacher-1', createdAt: '2024-12-15' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-16', setNumber: 3, score: 5, notes: 'Set 3 - mükemmel performans!', teacherId: 'teacher-1', createdAt: '2024-12-16' },
  { studentId: 'student-1', programId: 'program-1', methodId: 'method-1', date: '2024-12-17', setNumber: 3, score: 6, notes: 'Set 3 - en yüksek seviye başarı', teacherId: 'teacher-1', createdAt: '2024-12-17' },

  // Zeynep Yılmaz - Set 1
  { studentId: 'student-2', programId: 'program-2', methodId: 'method-3', date: '2024-12-01', setNumber: 1, score: 4, notes: 'Set 1 - sosyal hikayeyi anlayarak uyguluyor', teacherId: 'teacher-1', createdAt: '2024-12-01' },
  { studentId: 'student-2', programId: 'program-2', methodId: 'method-3', date: '2024-12-02', setNumber: 1, score: 5, notes: 'Set 1 tamamlandı! Set 2\'ye geçiş', teacherId: 'teacher-1', createdAt: '2024-12-02' },
  
  // Zeynep Yılmaz - Set 2
  { studentId: 'student-2', programId: 'program-2', methodId: 'method-3', date: '2024-12-03', setNumber: 2, score: 4, notes: 'Set 2 başlangıç - göz temasında iyileşme', teacherId: 'teacher-1', createdAt: '2024-12-03' },
  { studentId: 'student-2', programId: 'program-2', methodId: 'method-3', date: '2024-12-15', setNumber: 2, score: 5, notes: 'Set 2 - sosyal etkileşimde büyük ilerleme', teacherId: 'teacher-1', createdAt: '2024-12-15' },
  
  // Ege Kaya - Set 1
  { studentId: 'student-3', programId: 'program-1', methodId: 'method-2', date: '2024-12-01', setNumber: 1, score: 2, notes: 'Set 1 başlangıç - doğal öğretim yöntemi ile başlangıç', teacherId: 'teacher-1', createdAt: '2024-12-01' },
  { studentId: 'student-3', programId: 'program-1', methodId: 'method-2', date: '2024-12-02', setNumber: 1, score: 3, notes: 'Set 1 - görsel desteklerle öğrenme hızlanıyor', teacherId: 'teacher-1', createdAt: '2024-12-02' },
  { studentId: 'student-3', programId: 'program-1', methodId: 'method-2', date: '2024-12-15', setNumber: 1, score: 4, notes: 'Set 1 - kararlı ilerleme gösteriyor', teacherId: 'teacher-1', createdAt: '2024-12-15' }
];

// Clear collection function
async function clearCollection(collectionName) {
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
}

// Main upload function
async function uploadMockData() {
  try {
    console.log('🗑️ Clearing existing data...');
    
    // Clear existing collections
    await Promise.all([
      clearCollection(COLLECTIONS.teachers),
      clearCollection(COLLECTIONS.students),
      clearCollection(COLLECTIONS.programs),
      clearCollection(COLLECTIONS.methods),
      clearCollection(COLLECTIONS.dailyEntries),
      clearCollection(COLLECTIONS.studentProgressions)
    ]);

    console.log('📝 Uploading new mock data...');

    const batch = writeBatch(db);

    // Add teacher with original ID
    const teacherDocRef = doc(db, COLLECTIONS.teachers, 'teacher-1');
    batch.set(teacherDocRef, mockTeacher);

    // Add students with original IDs
    const studentIds = ['student-1', 'student-2', 'student-3'];
    for (let i = 0; i < mockStudents.length; i++) {
      const docRef = doc(db, COLLECTIONS.students, studentIds[i]);
      batch.set(docRef, mockStudents[i]);
    }

    // Add programs with original IDs
    const programIds = ['program-1', 'program-2', 'program-3'];
    for (let i = 0; i < mockPrograms.length; i++) {
      const docRef = doc(db, COLLECTIONS.programs, programIds[i]);
      batch.set(docRef, mockPrograms[i]);
    }

    // Add methods with original IDs
    const methodIds = ['method-1', 'method-2', 'method-3'];
    for (let i = 0; i < mockMethods.length; i++) {
      const docRef = doc(db, COLLECTIONS.methods, methodIds[i]);
      batch.set(docRef, mockMethods[i]);
    }

    // Commit the batch
    await batch.commit();

    // Add daily entries (let Firestore generate IDs)
    for (const entry of mockDailyEntries) {
      await addDoc(collection(db, COLLECTIONS.dailyEntries), entry);
    }

    // Add student progressions with original IDs
    const progressionIds = ['progression-1', 'progression-2', 'progression-3'];
    for (let i = 0; i < mockStudentProgressions.length; i++) {
      const docRef = doc(db, COLLECTIONS.studentProgressions, progressionIds[i]);
      try {
        await updateDoc(docRef, mockStudentProgressions[i]);
      } catch {
        // If document doesn't exist, create it
        await addDoc(collection(db, COLLECTIONS.studentProgressions), mockStudentProgressions[i]);
      }
    }

    console.log('✅ Mock data uploaded successfully with original IDs!');
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
}

// Run the upload
uploadMockData()
  .then(() => {
    console.log('🎉 Upload completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Upload failed:', error);
    process.exit(1);
  });