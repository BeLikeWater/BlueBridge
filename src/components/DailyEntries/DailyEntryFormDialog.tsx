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
  Alert,
  FormControlLabel,
  Switch,
  Slider,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import { Close as CloseIcon, EventBusy as AbsentIcon, EventAvailable as PresentIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { DailyEntry, Student, Program, Method, StudentProgression } from '../../types';
import { studentProgressionsService } from '../../services/firestore';

interface DailyEntryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entry: Omit<DailyEntry, 'id'>) => void;
  entry: DailyEntry | null;
  students: Student[];
  programs: Program[];
  methods: Method[];
}

const DailyEntryFormDialog: React.FC<DailyEntryFormDialogProps> = ({
  open,
  onClose,
  onSubmit,
  entry,
  students,
  programs,
  methods
}) => {
  const [formData, setFormData] = useState({
    studentId: '',
    programId: '',
    methodId: '',
    date: new Date(),
    setNumber: 1,
    score: 1,
    notes: '',
    absenceReason: '',
    isAbsent: false,
    isSetCompleted: false,
    teacherId: 'teacher-1',
    createdAt: new Date().toISOString()
  });
  const [studentProgression, setStudentProgression] = useState<StudentProgression | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [availableMethods, setAvailableMethods] = useState<Method[]>([]);

  useEffect(() => {
    if (entry) {
      setFormData({
        studentId: entry.studentId,
        programId: entry.programId,
        methodId: entry.methodId,
        date: new Date(entry.date),
        setNumber: entry.setNumber,
        score: entry.score || 1,
        notes: entry.notes || '',
        absenceReason: entry.absenceReason || '',
        isAbsent: !!entry.absenceReason,
        isSetCompleted: false,
        teacherId: entry.teacherId,
        createdAt: entry.createdAt
      });
    } else {
      setFormData({
        studentId: '',
        programId: '',
        methodId: '',
        date: new Date(),
        setNumber: 1,
        score: 1,
        notes: '',
        absenceReason: '',
        isAbsent: false,
        isSetCompleted: false,
        teacherId: 'teacher-1',
        createdAt: new Date().toISOString()
      });
    }
    setErrors({});
  }, [entry, open]);

  useEffect(() => {
    // Program seçildiğinde o programa ait yöntemleri getir
    if (formData.programId) {
      const filtered = methods.filter(method => method.programId === formData.programId);
      setAvailableMethods(filtered);
      
      // Eğer seçili yöntem bu program için geçerli değilse temizle
      if (formData.methodId && !filtered.some(m => m.id === formData.methodId)) {
        setFormData(prev => ({ ...prev, methodId: '' }));
      }
    } else {
      setAvailableMethods([]);
      setFormData(prev => ({ ...prev, methodId: '' }));
    }
  }, [formData.programId, methods]);

  // Öğrenci, program ve yöntem seçildiğinde progresyon bilgisini getir (bilgi amaçlı)
  useEffect(() => {
    const fetchStudentProgression = async () => {
      if (formData.studentId && formData.programId && formData.methodId) {
        try {
          const progression = await studentProgressionsService.getByStudent(
            formData.studentId,
            formData.programId,
            formData.methodId
          );
          setStudentProgression(progression);
        } catch (error) {
          console.error('Error fetching student progression:', error);
          setStudentProgression(null);
        }
      } else {
        setStudentProgression(null);
      }
    };

    fetchStudentProgression();
  }, [formData.studentId, formData.programId, formData.methodId]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.studentId) {
      newErrors.studentId = 'Öğrenci seçimi zorunludur';
    }

    if (!formData.programId) {
      newErrors.programId = 'Program seçimi zorunludur';
    }

    if (!formData.methodId) {
      newErrors.methodId = 'Yöntem seçimi zorunludur';
    }

    if (!formData.date) {
      newErrors.date = 'Tarih seçimi zorunludur';
    }

    if (formData.isAbsent && !formData.absenceReason.trim()) {
      newErrors.absenceReason = 'Yokluk nedeni belirtilmelidir';
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
      const entryData = {
        studentId: formData.studentId,
        programId: formData.programId,
        methodId: formData.methodId,
        date: format(formData.date, 'yyyy-MM-dd'),
        setNumber: formData.setNumber,
        score: formData.isAbsent ? null : formData.score,
        notes: formData.notes.trim() || undefined,
        absenceReason: formData.isAbsent ? formData.absenceReason.trim() : undefined,
        teacherId: formData.teacherId,
        createdAt: formData.createdAt
      };

      console.log('Submitting entry data:', entryData);
      await onSubmit(entryData);

      // Eğer set tamamlandı olarak işaretlenmişse progresyonu güncelle
      if (formData.isSetCompleted && !formData.isAbsent) {
        await updateStudentProgressionOnCompletion();
      }
    } catch (error) {
      console.error('Form submit error:', error);
    }
  };


  const updateStudentProgressionOnCompletion = async () => {
    if (!formData.studentId || !formData.programId || !formData.methodId) return;

    try {
      const currentProgression = await studentProgressionsService.getByStudent(
        formData.studentId,
        formData.programId, 
        formData.methodId
      );

      const progressionData: Omit<StudentProgression, 'id'> = {
        studentId: formData.studentId,
        programId: formData.programId,
        methodId: formData.methodId,
        currentSet: formData.setNumber === 3 ? 3 : formData.setNumber + 1,
        updatedAt: new Date().toISOString(),
        // Mevcut tamamlama tarihlerini koru
        set1CompletedAt: currentProgression?.set1CompletedAt,
        set2CompletedAt: currentProgression?.set2CompletedAt,
        set3CompletedAt: currentProgression?.set3CompletedAt
      };

      // Yeni tamamlama tarihini ekle
      if (formData.setNumber === 1) {
        progressionData.set1CompletedAt = new Date().toISOString();
      } else if (formData.setNumber === 2) {
        progressionData.set2CompletedAt = new Date().toISOString();
      } else if (formData.setNumber === 3) {
        progressionData.set3CompletedAt = new Date().toISOString();
      }

      await studentProgressionsService.createOrUpdate(progressionData);
      console.log('Student progression updated for set completion:', progressionData);
    } catch (error) {
      console.error('Error updating student progression on completion:', error);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || '';
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || '';
  };

  const getMethodName = (methodId: string) => {
    const method = methods.find(m => m.id === methodId);
    return method?.name || '';
  };

  const scoreMarks = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' },
    { value: 6, label: '6' }
  ];

  const canProceedToForm = () => {
    return formData.studentId && formData.programId && formData.methodId;
  };

  const getProgressionInfo = () => {
    if (!studentProgression) {
      return 'Bu öğrenci için progresyon kaydı yok - istediğiniz seti seçebilirsiniz';
    }
    
    let info = `Mevcut Set: ${studentProgression.currentSet}`;
    if (studentProgression.set1CompletedAt) info += ' | Set 1 ✓';
    if (studentProgression.set2CompletedAt) info += ' | Set 2 ✓';  
    if (studentProgression.set3CompletedAt) info += ' | Set 3 ✓';
    
    return info;
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
              {entry ? 'Günlük Giriş Düzenle' : 'Yeni Günlük Giriş'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3 }}>
          <Grid container spacing={3}>
            {/* Öğrenci Seçimi */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl 
                fullWidth 
                error={!!errors.studentId}
                required
              >
                <InputLabel>Öğrenci</InputLabel>
                <Select
                  value={formData.studentId}
                  label="Öğrenci"
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                >
                  <MenuItem value="">
                    <em>Öğrenci seçiniz</em>
                  </MenuItem>
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.studentId && (
                  <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                    {errors.studentId}
                  </Typography>
                )}
              </FormControl>
            </Grid>


            {/* Program Seçimi */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl 
                fullWidth 
                error={!!errors.programId}
                required
              >
                <InputLabel>Program</InputLabel>
                <Select
                  value={formData.programId}
                  label="Program"
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

            {/* Yöntem Seçimi */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl 
                fullWidth 
                error={!!errors.methodId}
                required
                disabled={!formData.programId}
              >
                <InputLabel>Yöntem</InputLabel>
                <Select
                  value={formData.methodId}
                  label="Yöntem"
                  onChange={(e) => setFormData({ ...formData, methodId: e.target.value })}
                >
                  <MenuItem value="">
                    <em>{formData.programId ? 'Yöntem seçiniz' : 'Önce program seçiniz'}</em>
                  </MenuItem>
                  {availableMethods.map(method => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.methodId && (
                  <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5 }}>
                    {errors.methodId}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Seçim Özeti */}
            {(formData.studentId || formData.programId || formData.methodId) && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="info" sx={{ borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Seçim Özeti:
                  </Typography>
                  <Typography variant="body2">
                    <strong>Öğrenci:</strong> {getStudentName(formData.studentId) || 'Seçilmedi'} |{' '}
                    <strong>Program:</strong> {getProgramName(formData.programId) || 'Seçilmedi'} |{' '}
                    <strong>Yöntem:</strong> {getMethodName(formData.methodId) || 'Seçilmedi'}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Progresyon Bilgisi */}
            {canProceedToForm() && (
              <Grid size={{ xs: 12 }}>
                <Alert severity="info" sx={{ borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    📊 Progresyon Bilgisi:
                  </Typography>
                  <Typography variant="body2">
                    {getProgressionInfo()}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {/* Tarih ve Set Seçimi */}
            {canProceedToForm() && (
              <>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label="Tarih"
                    type="date"
                    value={format(formData.date, 'yyyy-MM-dd')}
                    onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                    error={!!errors.date}
                    helperText={errors.date}
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Set Numarası</InputLabel>
                    <Select
                      value={formData.setNumber}
                      label="Set Numarası"
                      onChange={(e) => setFormData({ ...formData, setNumber: e.target.value as number })}
                    >
                      <MenuItem value={1}>Set 1</MenuItem>
                      <MenuItem value={2}>Set 2</MenuItem>
                      <MenuItem value={3}>Set 3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper elevation={1} sx={{ p: 2, backgroundColor: '#fff3e0', borderRadius: 1 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.isSetCompleted}
                          onChange={(e) => setFormData({ ...formData, isSetCompleted: e.target.checked })}
                          color="success"
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            Set Tamamlandı
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#666' }}>
                            Bu set artık bitmiş mi?
                          </Typography>
                        </Box>
                      }
                    />
                  </Paper>
                </Grid>
              </>
            )}

            {/* Devamsızlık Durumu */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={1} sx={{ p: 2, backgroundColor: '#f9f9f9' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isAbsent}
                      onChange={(e) => setFormData({ ...formData, isAbsent: e.target.checked, absenceReason: e.target.checked ? formData.absenceReason : '' })}
                      color="error"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {formData.isAbsent ? <AbsentIcon color="error" /> : <PresentIcon color="success" />}
                      <Typography>
                        {formData.isAbsent ? 'Öğrenci devamsız' : 'Öğrenci katıldı'}
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </Grid>

            {/* Yokluk Nedeni */}
            {formData.isAbsent && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Yokluk Nedeni"
                  value={formData.absenceReason}
                  onChange={(e) => setFormData({ ...formData, absenceReason: e.target.value })}
                  error={!!errors.absenceReason}
                  helperText={errors.absenceReason}
                  placeholder="Hastalık, aile durumu, ulaşım sorunu vb."
                  required
                />
              </Grid>
            )}

            {/* Set Skorlaması */}
            {!formData.isAbsent && canProceedToForm() && (
              <>
                <Grid size={{ xs: 12 }}>
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="h6" sx={{ color: '#1565C0' }}>
                      Set {formData.setNumber} Skorlaması
                    </Typography>
                  </Divider>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Paper 
                    elevation={3} 
                    sx={{ 
                      p: 3, 
                      backgroundColor: '#f8f9ff',
                      border: '2px solid #1976d2'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3, 
                        fontWeight: 'bold', 
                        color: '#1976d2',
                        textAlign: 'center'
                      }}
                    >
                      Set {formData.setNumber} - Günlük Skor
                    </Typography>

                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      <Typography variant="h2" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        {formData.score}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                        Bugünkü Performans Skoru
                      </Typography>
                    </Box>

                    <Slider
                      value={formData.score}
                      onChange={(_, value) => setFormData(prev => ({ ...prev, score: value as number }))}
                      min={1}
                      max={6}
                      step={1}
                      marks={scoreMarks}
                      valueLabelDisplay="auto"
                      sx={{
                        '& .MuiSlider-thumb': {
                          width: 24,
                          height: 24,
                        },
                        '& .MuiSlider-track': {
                          height: 8,
                        },
                        '& .MuiSlider-rail': {
                          height: 8,
                        }
                      }}
                    />
                  </Paper>
                </Grid>

                {/* Skor Rehberi */}
                <Grid size={{ xs: 12 }}>
                  <Alert severity="info" sx={{ borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      🎯 Skor Rehberi:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, backgroundColor: '#f44336', borderRadius: '50%' }}></Box>
                        <Typography variant="body2">1-2: Başlangıç</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, backgroundColor: '#ff9800', borderRadius: '50%' }}></Box>
                        <Typography variant="body2">3-4: Gelişim</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, backgroundColor: '#4caf50', borderRadius: '50%' }}></Box>
                        <Typography variant="body2">5-6: Başarılı</Typography>
                      </Box>
                    </Box>
                  </Alert>
                </Grid>
              </>
            )}

            {/* Notlar */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Günlük Notlar"
                multiline
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                error={!!errors.notes}
                helperText={errors.notes || `${formData.notes.length}/500 karakter`}
                placeholder="Öğrencinin davranışları, özel durumlar, gözlemler vb."
              />
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
            disabled={!formData.studentId || !formData.programId || !formData.methodId}
          >
            {entry ? 'Güncelle' : 'Kaydet'}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default DailyEntryFormDialog;