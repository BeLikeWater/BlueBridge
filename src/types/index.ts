// Mavi Köprü - Otizm Çocuk Takip Sistemi Tipleri

export interface Teacher {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  age: number;
  birthDate: string;
  diagnosis: string;
  teacherId: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  createdAt: string;
}

export interface Method {
  id: string;
  name: string;
  description?: string;
  programId: string;
  teacherId: string;
  createdAt: string;
}

export interface DailyEntry {
  id: string;
  studentId: string;
  programId: string;
  methodId: string;
  date: string; // YYYY-MM-DD format
  setNumber: number; // 1, 2, veya 3 - hangi set
  score: number | null; // 1-6 arası, null ise devamsız
  notes?: string;
  absenceReason?: string; // Yokluk nedeni (grafikteki boşluklar için)
  teacherId: string;
  createdAt: string;
}

// Öğrenci progresyon takibi için yeni interface
export interface StudentProgression {
  id: string;
  studentId: string;
  programId: string;
  methodId: string;
  currentSet: number; // 1, 2, veya 3
  set1CompletedAt?: string; // Set1 tamamlama tarihi
  set2CompletedAt?: string; // Set2 tamamlama tarihi
  set3CompletedAt?: string; // Set3 tamamlama tarihi
  updatedAt: string;
}

// Grafik için gerekli tip
export interface ProgressData {
  date: string;
  set1: number | null;
  set2: number | null;
  set3: number | null;
  hasData: boolean;
  absenceReason?: string;
}

// Form için gerekli tipler
export interface StudentFormData {
  name: string;
  birthDate: string;
  diagnosis: string;
  notes: string;
}

export interface ProgramFormData {
  name: string;
  description: string;
}

export interface MethodFormData {
  name: string;
  description: string;
  programId: string;
}

export interface DailyEntryFormData {
  studentId: string;
  programId: string;
  methodId: string;
  date: string;
  set1Score: number;
  set2Score: number;
  set3Score: number;
  notes: string;
  absenceReason?: string;
}

// Context ve Provider için
export interface AppContextType {
  currentUser: Teacher | null;
  students: Student[];
  programs: Program[];
  methods: Method[];
  dailyEntries: DailyEntry[];
  
  // Actions
  addStudent: (student: StudentFormData) => Promise<void>;
  addProgram: (program: ProgramFormData) => Promise<void>;
  addMethod: (method: MethodFormData) => Promise<void>;
  addDailyEntry: (entry: DailyEntryFormData) => Promise<void>;
  
  // Getters
  getStudentsByTeacher: (teacherId: string) => Student[];
  getProgramsByTeacher: (teacherId: string) => Program[];
  getMethodsByProgram: (programId: string) => Method[];
  getDailyEntriesForStudent: (studentId: string, programId: string, methodId: string) => DailyEntry[];
}

// Navigasyon için
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType;
  path: string;
}

// Sayfa tipleri
export type PageType = 'dashboard' | 'students' | 'programs' | 'methods' | 'entries' | 'progress';

// Skor renkleri için enum
export enum ScoreLevel {
  VERY_LOW = 1,    // Kırmızı
  LOW = 2,         // Turuncu
  MEDIUM_LOW = 3,  // Sarı
  MEDIUM_HIGH = 4, // Açık Yeşil
  HIGH = 5,        // Yeşil
  VERY_HIGH = 6    // Koyu Yeşil
}