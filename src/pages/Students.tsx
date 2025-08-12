import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tooltip
} from '@mui/material';
import {
  People as StudentsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { studentsService } from '../services/firestore';
import { Student } from '../types';
import StudentFormDialog from '../components/Students/StudentFormDialog';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchStudents();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await studentsService.getAll();
      setStudents(studentsData);
    } catch (error) {
      console.error('Öğrenci verilerini yükleme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Öğrenci verileri yüklenemedi';
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setFormOpen(true);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (studentData: Omit<Student, 'id'>) => {
    try {
      console.log('Form submitted with data:', studentData);
      console.log('Selected student:', selectedStudent);
      
      if (selectedStudent) {
        // Güncelleme
        console.log('Updating student with ID:', selectedStudent.id);
        await studentsService.update(selectedStudent.id, studentData);
        showSnackbar('Öğrenci başarıyla güncellendi', 'success');
      } else {
        // Yeni ekleme
        console.log('Adding new student');
        await studentsService.add(studentData);
        showSnackbar('Öğrenci başarıyla eklendi', 'success');
      }
      
      setFormOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (error) {
      console.error('Öğrenci kaydetme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Öğrenci kaydedilirken hata oluştu';
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'unknown',
        stack: error instanceof Error ? error.stack : 'no stack'
      });
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;

    try {
      await studentsService.delete(studentToDelete.id);
      showSnackbar('Öğrenci başarıyla silindi', 'success');
      setDeleteDialogOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error) {
      console.error('Öğrenci silme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Öğrenci silinirken hata oluştu';
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <StudentsIcon sx={{ color: '#1565C0', mr: 2, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
            Öğrenciler
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudent}
          sx={{ borderRadius: 2 }}
        >
          Yeni Öğrenci
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Sistemdeki öğrencileri görüntüleyin, düzenleyin veya yeni öğrenci ekleyin.
      </Typography>

      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Ad Soyad</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Yaş</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tanı</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Kayıt Tarihi</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      Henüz kayıtlı öğrenci bulunmuyor. İlk öğrenciyi eklemek için "Yeni Öğrenci" butonunu kullanın.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {student.name}
                        </Typography>
                        {student.notes && (
                          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.85rem' }}>
                            {student.notes.length > 50 
                              ? `${student.notes.substring(0, 50)}...` 
                              : student.notes
                            }
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {student.age} yaş
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.diagnosis} 
                        size="small" 
                        variant="outlined"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {new Date(student.createdAt).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={student.isActive ? 'Aktif' : 'Pasif'} 
                        size="small"
                        color={student.isActive ? 'success' : 'default'}
                        variant={student.isActive ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Görüntüle">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#1976d2' }}
                            onClick={() => {
                              // TODO: Öğrenci detay sayfası eklenebilir
                              console.log('Öğrenci detayları:', student);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#ed6c02' }}
                            onClick={() => handleEditStudent(student)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#d32f2f' }}
                            onClick={() => handleDeleteClick(student)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Öğrenci Form Dialog */}
      <StudentFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
      />

      {/* Silme Onay Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Öğrenciyi Sil"
        content={`"${studentToDelete?.name}" adlı öğrenciyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        confirmText="Sil"
        cancelText="İptal"
        severity="error"
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Students;