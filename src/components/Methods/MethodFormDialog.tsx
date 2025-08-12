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
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { Method, Program } from '../../types';

interface MethodFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (method: Omit<Method, 'id'>) => void;
  method: Method | null; // null = yeni yöntem, Method = düzenleme
  programs: Program[];
}

const MethodFormDialog: React.FC<MethodFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  method,
  programs
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    programId: '',
    teacherId: 'teacher-1', // Mock teacher ID - gerçek uygulamada current teacher olacak
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (method) {
      // Düzenleme modunda yöntem verilerini form'a yükle
      setFormData({
        name: method.name,
        description: method.description || '',
        programId: method.programId,
        teacherId: method.teacherId,
        createdAt: method.createdAt
      });
    } else {
      // Yeni yöntem modunda form'u temizle
      setFormData({
        name: '',
        description: '',
        programId: '',
        teacherId: 'teacher-1',
        createdAt: new Date().toISOString()
      });
    }
    setErrors({});
  }, [method, open]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Yöntem adı gereklidir';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Yöntem adı en az 3 karakter olmalıdır';
    }

    if (!formData.programId) {
      newErrors.programId = 'Program seçimi zorunludur';
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
      const methodData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        programId: formData.programId,
        teacherId: formData.teacherId,
        createdAt: formData.createdAt
      };

      console.log('Submitting method data:', methodData);
      await onSubmit(methodData);
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getSelectedProgramName = () => {
    const program = programs.find(p => p.id === formData.programId);
    return program?.name || '';
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
            {method ? 'Yöntem Düzenle' : 'Yeni Yöntem Ekle'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Program Seçimi */}
          <Grid size={{ xs: 12 }}>
            <FormControl 
              fullWidth 
              error={!!errors.programId}
              required
            >
              <InputLabel>Bağlı Program</InputLabel>
              <Select
                value={formData.programId}
                label="Bağlı Program"
                onChange={(e) => setFormData({ ...formData, programId: e.target.value })}
              >
                <MenuItem value="">
                  <em>Program seçiniz</em>
                </MenuItem>
                {programs.map(program => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.programId && (
                <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                  {errors.programId}
                </Typography>
              )}
            </FormControl>
          </Grid>

          {/* Seçilen Program Bilgisi */}
          {formData.programId && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="info" sx={{ borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Seçili Program:</strong> {getSelectedProgramName()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }}>
                  Bu yöntem seçili programa bağlı olarak oluşturulacak ve sadece bu program için kullanılabilir.
                </Typography>
              </Alert>
            </Grid>
          )}

          {/* Yöntem Adı */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Yöntem Adı"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              error={!!errors.name}
              helperText={errors.name}
              placeholder="Örn: Ayrık Denemelerle Öğrenim"
              required
            />
          </Grid>

          {/* Açıklama */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Yöntem Açıklaması"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={!!errors.description}
              helperText={errors.description || `${formData.description.length}/1000 karakter`}
              placeholder="Yöntemin nasıl uygulanacağı, hangi tekniklerin kullanılacağı hakkında detaylı bilgi..."
            />
          </Grid>

          {/* Yöntem Örnekleri */}
          <Grid size={{ xs: 12 }}>
            <Box 
              sx={{ 
                p: 2, 
                backgroundColor: '#fff3e0', 
                borderRadius: 1, 
                border: '1px solid #ffcc02' 
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                🎯 Öğretim Yöntemleri Örnekleri:
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.4 }}>
                • <strong>Ayrık Denemelerle Öğrenim (DTT):</strong> Yapılandırılmış öğretim yöntemi<br/>
                • <strong>Doğal Ortam Öğretimi (NET):</strong> Çocuğun doğal motivasyonunu kullanma<br/>
                • <strong>Video Modelleme:</strong> Görsel öğrenme desteği ile beceri kazandırma<br/>
                • <strong>Sosyal Hikayeler:</strong> Görsel destekli sosyal durumları öğretme<br/>
                • <strong>PECS (Resim Değişim İletişim Sistemi):</strong> İletişim becerilerini geliştirme<br/>
                • <strong>Pivotal Response Training:</strong> Temel becerilere odaklanma
              </Typography>
            </Box>
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
                💡 <strong>Bilgi:</strong> Yöntem kaydedildikten sonra öğrenciler için günlük girişler 
                yapılabilir. Her yöntem, bağlı olduğu programa özel olarak tasarlanmalıdır.
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
          disabled={!formData.programId} // Program seçilmeden kaydetme yapılamaz
        >
          {method ? 'Güncelle' : 'Kaydet'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MethodFormDialog;