// Mock Data - Test verisi
import { Teacher, Student, Program, Method, DailyEntry, StudentProgression } from '../types';

export const mockTeacher: Teacher = {
  id: 'teacher-1',
  name: 'Ayşe Öğretmen',
  email: 'ayse.ogretmen@mavikopru.com',
  createdAt: '2024-01-15'
};

export const mockStudents: Student[] = [
  {
    id: 'student-1',
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
    id: 'student-2',
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
    id: 'student-3',
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

export const mockPrograms: Program[] = [
  {
    id: 'program-1',
    name: 'IM.VT.1 Video Modeli ile Motor Taklit',
    description: 'Video modeli kullanarak motor becerilerin taklit edilmesini öğretme programı. Gross ve fine motor hareketlerin koordinasyonunu geliştirmeyi hedefler.',
    teacherId: 'teacher-1',
    createdAt: '2024-01-16'
  },
  {
    id: 'program-2',
    name: 'SC.RT.2 Sosyal İletişim ve Rutinler',
    description: 'Günlük rutinler içerisinde sosyal iletişim becerilerinin geliştirilmesi programı. Göz teması, sıra alma, basit taleplerde bulunma becerilerini içerir.',
    teacherId: 'teacher-1',
    createdAt: '2024-01-18'
  },
  {
    id: 'program-3',
    name: 'CB.AV.3 Davranış Analizi ve Değiştirme',
    description: 'Problem davranışların analiz edilip olumlu davranışlarla değiştirilmesi programı. Pekiştirme sistemleri ve davranışsal müdahaleler içerir.',
    teacherId: 'teacher-1',
    createdAt: '2024-01-20'
  }
];

export const mockMethods: Method[] = [
  {
    id: 'method-1',
    name: 'Ayrık Denemelerle Öğrenim (DTT)',
    description: 'Strukturlu öğretim yöntemi. Her beceri küçük adımlara bölünerek, ayrık denemelerle öğretilir. Hemen pekiştirme ve düzeltici geri bildirim verilir.',
    programId: 'program-1',
    teacherId: 'teacher-1',
    createdAt: '2024-01-16'
  },
  {
    id: 'method-2',
    name: 'Doğal Ortam Öğretimi (NET)',
    description: 'Çocuğun doğal ilgi ve motivasyonundan yararlanarak öğretimin doğal ortamlarda gerçekleştirilmesi. Oyun ve rutin aktiviteler içerisinde öğretim yapılır.',
    programId: 'program-1',
    teacherId: 'teacher-1',
    createdAt: '2024-01-16'
  },
  {
    id: 'method-3',
    name: 'Sosyal Hikaye Tekniği',
    description: 'Sosyal durumları açıklayan kısa hikayelerle sosyal becerilerin öğretimi. Çocuğun sosyal durumları anlaması ve uygun tepkiler vermesi hedeflenir.',
    programId: 'program-2',
    teacherId: 'teacher-1',
    createdAt: '2024-01-18'
  },
  {
    id: 'method-4',
    name: 'Olumlu Davranış Desteği (PBS)',
    description: 'Problem davranışların nedenlerini anlayarak, çevre düzenlemeleri ve olumlu pekiştirmelerle davranış değişikliği sağlama yöntemi.',
    programId: 'program-3',
    teacherId: 'teacher-1',
    createdAt: '2024-01-20'
  }
];

// Öğrenci progresyon durumları
export const mockStudentProgressions: StudentProgression[] = [
  {
    id: 'progression-1',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    currentSet: 3, // Aras Set 3'te
    set1CompletedAt: '2024-12-05',
    set2CompletedAt: '2024-12-12',
    updatedAt: '2024-12-17'
  },
  {
    id: 'progression-2',
    studentId: 'student-2',
    programId: 'program-2',
    methodId: 'method-3',
    currentSet: 2, // Zeynep Set 2'de
    set1CompletedAt: '2024-12-02',
    updatedAt: '2024-12-15'
  },
  {
    id: 'progression-3',
    studentId: 'student-3',
    programId: 'program-1',
    methodId: 'method-2',
    currentSet: 1, // Ege henüz Set 1'de
    updatedAt: '2024-12-01'
  }
];

// Son 30 günlük örnek veri - tek set sistemi ile
export const mockDailyEntries: DailyEntry[] = [
  // Aras Demir için IM.VT.1 programı, Ayrık Denemelerle Öğrenim yöntemi
  // Set 1 Aşaması (1-5 Aralık)
  {
    id: 'entry-1',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-01',
    setNumber: 1,
    score: 2,
    notes: 'Set 1 başlangıç - konsantrasyonda zorluk',
    teacherId: 'teacher-1',
    createdAt: '2024-12-01'
  },
  {
    id: 'entry-2',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-02',
    setNumber: 1,
    score: 3,
    notes: 'Set 1 - hafif iyileşme',
    teacherId: 'teacher-1',
    createdAt: '2024-12-02'
  },
  // 3 Aralık yokluk
  {
    id: 'entry-3',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-03',
    setNumber: 1,
    score: null,
    absenceReason: 'Hastalık - grip',
    teacherId: 'teacher-1',
    createdAt: '2024-12-03'
  },
  {
    id: 'entry-4',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-04',
    setNumber: 1,
    score: 4,
    notes: 'Set 1 - hastalık sonrası toparlandı',
    teacherId: 'teacher-1',
    createdAt: '2024-12-04'
  },
  {
    id: 'entry-5',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-05',
    setNumber: 1,
    score: 5,
    notes: 'Set 1 tamamlandı! Set 2\'ye geçiş',
    teacherId: 'teacher-1',
    createdAt: '2024-12-05'
  },
  
  // Set 2 Aşaması (8-12 Aralık)
  {
    id: 'entry-6',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-08',
    setNumber: 2,
    score: 3,
    notes: 'Set 2 başlangıç - yeni zorluklar',
    teacherId: 'teacher-1',
    createdAt: '2024-12-08'
  },
  {
    id: 'entry-7',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-09',
    setNumber: 2,
    score: 4,
    notes: 'Set 2 - adaptasyon süreci',
    teacherId: 'teacher-1',
    createdAt: '2024-12-09'
  },
  // 10-11 Aralık yokluk
  {
    id: 'entry-8',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-10',
    setNumber: 2,
    score: null,
    absenceReason: 'Aile tatili',
    teacherId: 'teacher-1',
    createdAt: '2024-12-10'
  },
  {
    id: 'entry-9',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-11',
    setNumber: 2,
    score: null,
    absenceReason: 'Aile tatili',
    teacherId: 'teacher-1',
    createdAt: '2024-12-11'
  },
  {
    id: 'entry-10',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-12',
    setNumber: 2,
    score: 5,
    notes: 'Set 2 tamamlandı! Set 3\'e geçiş',
    teacherId: 'teacher-1',
    createdAt: '2024-12-12'
  },
  
  // Set 3 Aşaması (15-17 Aralık)
  {
    id: 'entry-11',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-15',
    setNumber: 3,
    score: 4,
    notes: 'Set 3 başlangıç - en ileri seviye',
    teacherId: 'teacher-1',
    createdAt: '2024-12-15'
  },
  {
    id: 'entry-12',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-16',
    setNumber: 3,
    score: 5,
    notes: 'Set 3 - mükemmel performans!',
    teacherId: 'teacher-1',
    createdAt: '2024-12-16'
  },
  {
    id: 'entry-13',
    studentId: 'student-1',
    programId: 'program-1',
    methodId: 'method-1',
    date: '2024-12-17',
    setNumber: 3,
    score: 6,
    notes: 'Set 3 - en yüksek seviye başarı',
    teacherId: 'teacher-1',
    createdAt: '2024-12-17'
  },

  // Zeynep Yılmaz için Sosyal İletişim programı 
  // Set 1 Aşaması (1-2 Aralık)
  {
    id: 'entry-14',
    studentId: 'student-2',
    programId: 'program-2',
    methodId: 'method-3',
    date: '2024-12-01',
    setNumber: 1,
    score: 4,
    notes: 'Set 1 - sosyal hikayeyi anlayarak uyguluyor',
    teacherId: 'teacher-1',
    createdAt: '2024-12-01'
  },
  {
    id: 'entry-15',
    studentId: 'student-2',
    programId: 'program-2',
    methodId: 'method-3',
    date: '2024-12-02',
    setNumber: 1,
    score: 5,
    notes: 'Set 1 tamamlandı! Set 2\'ye geçiş',
    teacherId: 'teacher-1',
    createdAt: '2024-12-02'
  },
  
  // Set 2 Aşaması (3-15 Aralık)
  {
    id: 'entry-16',
    studentId: 'student-2',
    programId: 'program-2',
    methodId: 'method-3',
    date: '2024-12-03',
    setNumber: 2,
    score: 4,
    notes: 'Set 2 başlangıç - göz temasında iyileşme',
    teacherId: 'teacher-1',
    createdAt: '2024-12-03'
  },
  {
    id: 'entry-17',
    studentId: 'student-2',
    programId: 'program-2',
    methodId: 'method-3',
    date: '2024-12-15',
    setNumber: 2,
    score: 5,
    notes: 'Set 2 - sosyal etkileşimde büyük ilerleme',
    teacherId: 'teacher-1',
    createdAt: '2024-12-15'
  },
  
  // Ege Kaya için henüz Set 1'de
  {
    id: 'entry-18',
    studentId: 'student-3',
    programId: 'program-1',
    methodId: 'method-2',
    date: '2024-12-01',
    setNumber: 1,
    score: 2,
    notes: 'Set 1 başlangıç - doğal öğretim yöntemi ile başlangıç',
    teacherId: 'teacher-1',
    createdAt: '2024-12-01'
  },
  {
    id: 'entry-19',
    studentId: 'student-3',
    programId: 'program-1',
    methodId: 'method-2',
    date: '2024-12-02',
    setNumber: 1,
    score: 3,
    notes: 'Set 1 - görsel desteklerle öğrenme hızlanıyor',
    teacherId: 'teacher-1',
    createdAt: '2024-12-02'
  },
  {
    id: 'entry-20',
    studentId: 'student-3',
    programId: 'program-1',
    methodId: 'method-2',
    date: '2024-12-15',
    setNumber: 1,
    score: 4,
    notes: 'Set 1 - kararlı ilerleme gösteriyor',
    teacherId: 'teacher-1',
    createdAt: '2024-12-15'
  }
];

// Grafik için daha kolay kullanım
export const getMockDataForStudent = (studentId: string, programId: string, methodId: string) => {
  return mockDailyEntries.filter(entry => 
    entry.studentId === studentId && 
    entry.programId === programId && 
    entry.methodId === methodId
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};