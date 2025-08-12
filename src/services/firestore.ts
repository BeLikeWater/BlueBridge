import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Teacher, Student, Program, Method, DailyEntry, StudentProgression } from '../types';

// Collection names
const COLLECTIONS = {
  teachers: 'teachers',
  students: 'students',
  programs: 'programs',
  methods: 'methods',
  dailyEntries: 'dailyEntries',
  studentProgressions: 'studentProgressions'
};

// Teachers
export const teachersService = {
  async getAll(): Promise<Teacher[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.teachers));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Teacher));
  },

  async add(teacher: Omit<Teacher, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.teachers), teacher);
    return docRef.id;
  },

  async update(id: string, updates: Partial<Teacher>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.teachers, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.teachers, id));
  }
};

// Students
export const studentsService = {
  async getAll(): Promise<Student[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.students));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  },

  async getByTeacher(teacherId: string): Promise<Student[]> {
    const q = query(
      collection(db, COLLECTIONS.students), 
      where('teacherId', '==', teacherId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
  },

  async add(student: Omit<Student, 'id'>): Promise<string> {
    try {
      console.log('Firestore add - Data:', student);
      const docRef = await addDoc(collection(db, COLLECTIONS.students), student);
      console.log('Firestore add successful - ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Firestore add error:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<Student>): Promise<void> {
    try {
      console.log('Firestore update - ID:', id);
      console.log('Firestore update - Data:', updates);
      const docRef = doc(db, COLLECTIONS.students, id);
      await updateDoc(docRef, updates);
      console.log('Firestore update successful');
    } catch (error) {
      console.error('Firestore update error:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.students, id));
  }
};

// Programs
export const programsService = {
  async getAll(): Promise<Program[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.programs));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Program));
  },

  async add(program: Omit<Program, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.programs), program);
    return docRef.id;
  },

  async update(id: string, updates: Partial<Program>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.programs, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.programs, id));
  }
};

// Methods
export const methodsService = {
  async getAll(): Promise<Method[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.methods));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Method));
  },

  async getByProgram(programId: string): Promise<Method[]> {
    const q = query(
      collection(db, COLLECTIONS.methods), 
      where('programId', '==', programId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Method));
  },

  async add(method: Omit<Method, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.methods), method);
    return docRef.id;
  },

  async update(id: string, updates: Partial<Method>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.methods, id);
    await updateDoc(docRef, updates);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.methods, id));
  }
};

// Daily Entries
export const dailyEntriesService = {
  async getAll(): Promise<DailyEntry[]> {
    const q = query(
      collection(db, COLLECTIONS.dailyEntries), 
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyEntry));
  },

  async getByStudent(studentId: string, programId?: string, methodId?: string): Promise<DailyEntry[]> {
    try {
      console.log('🔍 Querying dailyEntries for:', { studentId, programId, methodId });
      
      // Basit query ile başla
      const baseQuery = query(
        collection(db, COLLECTIONS.dailyEntries),
        where('studentId', '==', studentId)
      );

      console.log('🔍 Running base query...');
      const querySnapshot = await getDocs(baseQuery);
      console.log('🔍 Base query results:', querySnapshot.docs.length);
      
      let entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyEntry));
      console.log('🔍 Entries before filtering:', entries);

      // Client-side filtering
      if (programId) {
        entries = entries.filter(entry => entry.programId === programId);
        console.log('🔍 After program filter:', entries.length);
      }

      if (methodId) {
        entries = entries.filter(entry => entry.methodId === methodId);
        console.log('🔍 After method filter:', entries.length);
      }

      // Tarihe göre sırala
      entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      console.log('🔍 Final filtered entries:', entries);
      
      return entries;
    } catch (error) {
      console.error('❌ Error in getByStudent:', error);
      throw error;
    }
  },

  async getRecent(limit: number = 10): Promise<DailyEntry[]> {
    const q = query(
      collection(db, COLLECTIONS.dailyEntries), 
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const entries = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DailyEntry));
    return entries.slice(0, limit);
  },

  async add(entry: Omit<DailyEntry, 'id'>): Promise<string> {
    try {
      console.log('Firestore add - Data:', entry);
      // Undefined değerleri temizle
      const cleanEntry = Object.fromEntries(
        Object.entries(entry).filter(([_, value]) => value !== undefined)
      );
      console.log('Firestore add - Clean Data:', cleanEntry);
      const docRef = await addDoc(collection(db, COLLECTIONS.dailyEntries), cleanEntry);
      console.log('Firestore add successful - ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Firestore add error:', error);
      throw error;
    }
  },

  async update(id: string, updates: Partial<DailyEntry>): Promise<void> {
    try {
      console.log('Firestore update - ID:', id);
      console.log('Firestore update - Data:', updates);
      // Undefined değerleri temizle
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, value]) => value !== undefined)
      );
      console.log('Firestore update - Clean Data:', cleanUpdates);
      const docRef = doc(db, COLLECTIONS.dailyEntries, id);
      await updateDoc(docRef, cleanUpdates);
      console.log('Firestore update successful');
    } catch (error) {
      console.error('Firestore update error:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.dailyEntries, id));
  }
};

// Student Progressions
export const studentProgressionsService = {
  async getAll(): Promise<StudentProgression[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.studentProgressions));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudentProgression));
  },

  async getByStudent(studentId: string, programId: string, methodId: string): Promise<StudentProgression | null> {
    const q = query(
      collection(db, COLLECTIONS.studentProgressions),
      where('studentId', '==', studentId),
      where('programId', '==', programId),
      where('methodId', '==', methodId)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } as StudentProgression;
  },

  async createOrUpdate(progression: Omit<StudentProgression, 'id'>): Promise<string> {
    try {
      // Önce mevcut progresyon var mı kontrol et
      const existing = await this.getByStudent(
        progression.studentId, 
        progression.programId, 
        progression.methodId
      );

      if (existing) {
        // Güncelle
        const docRef = doc(db, COLLECTIONS.studentProgressions, existing.id);
        await updateDoc(docRef, {
          ...progression,
          updatedAt: new Date().toISOString()
        });
        return existing.id;
      } else {
        // Yeni oluştur
        const docRef = await addDoc(collection(db, COLLECTIONS.studentProgressions), {
          ...progression,
          updatedAt: new Date().toISOString()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Student progression create/update error:', error);
      throw error;
    }
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.studentProgressions, id));
  }
};

// Bulk operations for initial data loading
export const bulkOperations = {
  async clearCollection(collectionName: string): Promise<void> {
    try {
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`Collection ${collectionName} is already empty`);
        return;
      }

      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Cleared ${snapshot.docs.length} documents from ${collectionName}`);
    } catch (error) {
      console.error(`Error clearing collection ${collectionName}:`, error);
      throw error; // Hatayı yukarı aktar
    }
  },

  async uploadMockData(
    teachers: Omit<Teacher, 'id'>[],
    students: Omit<Student, 'id'>[],
    programs: Omit<Program, 'id'>[],
    methods: Omit<Method, 'id'>[],
    dailyEntries: Omit<DailyEntry, 'id'>[],
    studentProgressions: Omit<StudentProgression, 'id'>[] = []
  ): Promise<void> {
    console.log('🗑️ Clearing existing data...');
    
    // Clear existing collections
    await Promise.all([
      this.clearCollection(COLLECTIONS.teachers),
      this.clearCollection(COLLECTIONS.students),
      this.clearCollection(COLLECTIONS.programs),
      this.clearCollection(COLLECTIONS.methods),
      this.clearCollection(COLLECTIONS.dailyEntries),
      this.clearCollection(COLLECTIONS.studentProgressions)
    ]);

    console.log('📝 Uploading new mock data...');

    const batch = writeBatch(db);

    // Add teachers with original IDs
    for (const teacher of teachers) {
      const docRef = doc(db, COLLECTIONS.teachers, 'teacher-1'); // Fixed ID
      batch.set(docRef, teacher);
    }

    // Add students with original IDs
    const studentIds = ['student-1', 'student-2', 'student-3'];
    for (let i = 0; i < students.length; i++) {
      const docRef = doc(db, COLLECTIONS.students, studentIds[i]);
      batch.set(docRef, students[i]);
    }

    // Add programs with original IDs
    const programIds = ['program-1', 'program-2', 'program-3'];
    for (let i = 0; i < programs.length; i++) {
      const docRef = doc(db, COLLECTIONS.programs, programIds[i]);
      batch.set(docRef, programs[i]);
    }

    // Add methods with original IDs
    const methodIds = ['method-1', 'method-2', 'method-3'];
    for (let i = 0; i < methods.length; i++) {
      const docRef = doc(db, COLLECTIONS.methods, methodIds[i]);
      batch.set(docRef, methods[i]);
    }

    // Commit the batch
    await batch.commit();

    // Add daily entries (let Firestore generate IDs)
    for (const entry of dailyEntries) {
      await addDoc(collection(db, COLLECTIONS.dailyEntries), entry);
    }

    // Add student progressions with original IDs
    const progressionIds = ['progression-1', 'progression-2', 'progression-3'];
    for (let i = 0; i < studentProgressions.length; i++) {
      const docRef = doc(db, COLLECTIONS.studentProgressions, progressionIds[i]);
      await updateDoc(docRef, studentProgressions[i]).catch(() => {
        // If document doesn't exist, create it
        return addDoc(collection(db, COLLECTIONS.studentProgressions), studentProgressions[i]);
      });
    }

    console.log('✅ Mock data uploaded successfully with original IDs!');
  }
};