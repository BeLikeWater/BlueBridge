// Browser console'da çalıştırmak için manual upload script
// Bu kodu React uygulamasının açık olduğu browser tab'inde console'a yapıştırın

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

// Console'da çalıştırılacak upload fonksiyonu
console.log('🚀 Mock data upload functions loaded!');
console.log('✅ Run: uploadData() to upload all mock data');

window.uploadData = async function() {
  if (!window.manualUploadMockData) {
    console.error('❌ Upload function not available. Make sure React app is loaded.');
    return;
  }
  
  try {
    await window.manualUploadMockData();
  } catch (error) {
    console.error('❌ Upload failed:', error);
  }
};

console.log('📋 Available commands:');
console.log('- uploadData() : Upload all mock data to Firestore');
console.log('📊 Data ready:', {
  teachers: 1,
  students: mockStudents.length,
  programs: mockPrograms.length, 
  methods: mockMethods.length,
  dailyEntries: mockDailyEntries.length,
  studentProgressions: mockStudentProgressions.length
});