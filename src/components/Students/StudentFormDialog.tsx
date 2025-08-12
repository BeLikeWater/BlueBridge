import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControlLabel,
  Switch,
  Grid,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Student } from '../../types';

interface StudentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (student: Omit<Student, 'id'>) => void;
  student: Student | null; // null = yeni öğrenci, Student = düzenleme
}

const StudentFormDialog: React.FC<StudentFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  student
}) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    diagnosis: '',
    teacherId: 'teacher1', // Mock teacher ID - gerçek uygulamada current teacher olacak
    notes: '',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (student) {
      // Düzenleme modunda öğrenci verilerini form'a yükle
      setFormData({
        name: student.name,
        age: student.age?.toString() || '',
        diagnosis: student.diagnosis || '',
        teacherId: student.teacherId,
        notes: student.notes || '',
        isActive: student.isActive ?? true,
        createdAt: student.createdAt,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Yeni öğrenci modunda form'u temizle
      setFormData({
        name: '',
        age: '',
        diagnosis: '',
        teacherId: 'teacher1',
        notes: '',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    setErrors({});
  }, [student, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ad soyad gereklidir';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Ad soyad en az 2 karakter olmalıdır';
    }

    const age = parseInt(formData.age);
    if (!formData.age || formData.age.trim() === '' || isNaN(age)) {
      newErrors.age = 'Geçerli bir yaş giriniz';
    } else if (age < 1 || age > 25) {
      newErrors.age = 'Yaş 1-25 arasında olmalıdır';
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Tanı bilgisi gereklidir';
    } else if (formData.diagnosis.trim().length < 3) {
      newErrors.diagnosis = 'Tanı en az 3 karakter olmalıdır';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notlar en fazla 500 karakter olabilir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Yaştan birthDate hesapla
      const currentYear = new Date().getFullYear();
      const age = parseInt(formData.age);
      const birthYear = currentYear - (isNaN(age) ? 0 : age);
      const birthDate = `${birthYear}-01-01`; // Basit yaklaşım

      const studentData = {
        name: formData.name.trim(),
        age: isNaN(age) ? 0 : age,
        birthDate: birthDate,
        diagnosis: formData.diagnosis.trim(),
        teacherId: formData.teacherId,
        notes: formData.notes.trim() || undefined,
        isActive: formData.isActive,
        createdAt: formData.createdAt,
        updatedAt: new Date().toISOString()
      };

      console.log('Submitting student data:', studentData);
      await onSubmit(studentData);
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565C0' }}>
            {student ? 'Öğrenci Düzenle' : 'Yeni Öğrenci Ekle'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Ad Soyad */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Ad Soyad"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="Öğrencinin adı ve soyadı"
              required
            />
          </Grid>

          {/* Yaş */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Yaş"
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              error={!!errors.age}
              helperText={errors.age}
              placeholder="Öğrencinin yaşı"
              required
              inputProps={{ min: 1, max: 25 }}
            />
          </Grid>

          {/* Tanı */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Tanı"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              error={!!errors.diagnosis}
              helperText={errors.diagnosis}
              placeholder="Örn: Otizm Spektrum Bozukluğu, ADHD, vb."
              required
            />
          </Grid>

          {/* Notlar */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Notlar"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              error={!!errors.notes}
              helperText={errors.notes || `${formData.notes.length}/500 karakter`}
              placeholder="Öğrenci hakkında ek bilgiler, özel durumlar, iletişim notları vb."
            />
          </Grid>

          {/* Aktif Durumu */}
          <Grid size={{ xs: 12 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body1">
                    Öğrenci Aktif
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                    Pasif öğrenciler listede gri renkte görünür ve yeni giriş yapılamaz
                  </Typography>
                </Box>
              }
            />
          </Grid>

          {/* Bilgi Kutusu */}
          <Grid size={{ xs: 12 }}>
            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: '#f8f9fa', 
                borderRadius: 1, 
                border: '1px solid #e0e0e0' 
              }}
            >
              <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                💡 <strong>Bilgi:</strong> Öğrenci kaydedildikten sonra bu öğrenci için programlar ve günlük girişler 
                tanımlanabilir. Öğrenci bilgileri istendiğinde güncellenebilir.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 1.5 }}
        >
          İptal
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          sx={{ borderRadius: 1.5, ml: 1 }}
        >
          {student ? 'Güncelle' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentFormDialog;