import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Program } from '../../types';

interface ProgramFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (program: Omit<Program, 'id'>) => void;
  program: Program | null; // null = yeni program, Program = düzenleme
}

const ProgramFormDialog: React.FC<ProgramFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  program
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    teacherId: 'teacher-1', // Mock teacher ID - gerçek uygulamada current teacher olacak
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (program) {
      // Düzenleme modunda program verilerini form'a yükle
      setFormData({
        name: program.name,
        description: program.description || '',
        teacherId: program.teacherId,
        createdAt: program.createdAt
      });
    } else {
      // Yeni program modunda form'u temizle
      setFormData({
        name: '',
        description: '',
        teacherId: 'teacher-1',
        createdAt: new Date().toISOString()
      });
    }
    setErrors({});
  }, [program, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Program adı gereklidir';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Program adı en az 3 karakter olmalıdır';
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = 'Açıklama en fazla 1000 karakter olabilir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const programData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        teacherId: formData.teacherId,
        createdAt: formData.createdAt
      };

      console.log('Submitting program data:', programData);
      await onSubmit(programData);
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
            {program ? 'Program Düzenle' : 'Yeni Program Ekle'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Program Adı */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Program Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="Örn: IM.VT.1 Video Modeli ile Motor Taklit"
              required
            />
          </Grid>

          {/* Açıklama */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Program Açıklaması"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/1000 karakter`}
              placeholder="Programın amacı, hedefleri ve uygulama yöntemi hakkında detaylı bilgi..."
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
                💡 <strong>Bilgi:</strong> Program kaydedildikten sonra bu program için öğretim yöntemleri 
                tanımlanabilir. Her programa özel yöntemler eklenerek eğitim sürecini daha da 
                özelleştirebilirsiniz.
              </Typography>
            </Box>
          </Grid>

          {/* Program Örnekleri */}
          <Grid size={{ xs: 12 }}>
            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: '#e3f2fd', 
                borderRadius: 1, 
                border: '1px solid #bbdefb' 
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                📚 Program Örnekleri:
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.4 }}>
                • <strong>Motor Beceriler:</strong> IM.VT.1 Video Modeli ile Motor Taklit<br/>
                • <strong>Sosyal Beceriler:</strong> SOS.İLT.2 Sosyal İletişim Becerileri<br/>
                • <strong>Dil Becerileri:</strong> DİL.GEL.3 Dil ve Konuşma Geliştirme<br/>
                • <strong>Akademik Beceriler:</strong> AKA.MAT.4 Matematik Kavramları<br/>
                • <strong>Yaşam Becerileri:</strong> YAŞ.BEC.5 Günlük Yaşam Becerileri
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
          {program ? 'Güncelle' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramFormDialog;