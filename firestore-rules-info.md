# Firestore Rules Sorunu Çözümü

Firebase Console'da aşağıdaki rules'u ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Test için tüm işlemlere izin ver (SADECE GELIŞTIRME İÇİN!)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**NOT:** Bu rules sadece geliştirme aşamasında kullanılmalıdır. Prodüksiyon için güvenli rules yazılmalıdır.

## Güvenli Rules Örneği:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /teachers/{teacherId} {
      allow read, write: if request.auth != null;
    }
    
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }
    
    match /programs/{programId} {
      allow read, write: if request.auth != null;
    }
    
    match /methods/{methodId} {
      allow read, write: if request.auth != null;
    }
    
    match /dailyEntries/{entryId} {
      allow read, write: if request.auth != null;
    }
  }
}
```