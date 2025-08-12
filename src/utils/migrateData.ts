import { bulkOperations } from '../services/firestore';
import { 
  mockTeacher, 
  mockStudents, 
  mockPrograms, 
  mockMethods, 
  mockDailyEntries 
} from '../data/mockData';

/**
 * Manuel olarak veri migration'ını tetiklemek için
 * Browser console'da çağırabilirsiniz: window.forceMigration()
 */
export const forceMigration = async (): Promise<void> => {
  try {
    localStorage.removeItem('mockDataMigrated');
    console.log('🔄 Manuel migration başlatılıyor...');
    await migrateMockDataToFirestore();
    localStorage.setItem('mockDataMigrated', 'true');
    console.log('✅ Manuel migration tamamlandı!');
    
    // Sayfa yenilemesi yerine, success mesajı göster
    alert('Mock veriler başarıyla yüklendi! Sayfa yenilenecek.');
    window.location.reload(); // Sayfayı yenile
  } catch (error) {
    console.error('❌ Manuel migration hatası:', error);
    alert(`Migration hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    throw error; // Hatayı yeniden fırlat
  }
};

// Global scope'a ekle
if (typeof window !== 'undefined') {
  (window as any).forceMigration = forceMigration;
}

/**
 * Mock verileri Firestore'a yükleyen fonksiyon
 * Bu fonksiyon sadece geliştirme aşamasında kullanılmalı
 */
export const migrateMockDataToFirestore = async (): Promise<void> => {
  try {
    console.log('Mock veriler Firestore\'a yükleniyor...');
    
    await bulkOperations.uploadMockData(
      [mockTeacher], // teachers array
      mockStudents,
      mockPrograms, 
      mockMethods,
      mockDailyEntries
    );
    
    console.log('✅ Mock veriler başarıyla Firestore\'a yüklendi!');
  } catch (error) {
    console.error('❌ Mock veri yükleme hatası:', error);
    throw error;
  }
};

/**
 * Geliştirme modunda otomatik veri yükleme kontrolü
 */
export const checkAndMigrateData = async (): Promise<boolean> => {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }

  // LocalStorage'ı temizle ve yeniden yükle
  localStorage.removeItem('mockDataMigrated');
  const shouldMigrate = localStorage.getItem('mockDataMigrated') !== 'true';
  
  if (shouldMigrate) {
    try {
      console.log('🔄 Mock veriler yeniden yükleniyor...');
      await migrateMockDataToFirestore();
      localStorage.setItem('mockDataMigrated', 'true');
      return true;
    } catch (error) {
      console.error('Veri migration hatası:', error);
      return false;
    }
  }
  
  return false;
};