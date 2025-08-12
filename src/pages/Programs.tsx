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
  Assignment as ProgramsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { programsService } from '../services/firestore';
import { Program } from '../types';
import ProgramFormDialog from '../components/Programs/ProgramFormDialog';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchPrograms();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const programsData = await programsService.getAll();
      setPrograms(programsData);
    } catch (error) {
      console.error('Program verilerini yükleme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Program verileri yüklenemedi';
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddProgram = () => {
    setSelectedProgram(null);
    setFormOpen(true);
  };

  const handleEditProgram = (program: Program) => {
    setSelectedProgram(program);
    setFormOpen(true);
  };

  const handleDeleteClick = (program: Program) => {
    setProgramToDelete(program);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (programData: Omit<Program, 'id'>) => {
    try {
      console.log('Form submitted with data:', programData);
      console.log('Selected program:', selectedProgram);
      
      if (selectedProgram) {
        // Güncelleme
        console.log('Updating program with ID:', selectedProgram.id);
        await programsService.update(selectedProgram.id, programData);
        showSnackbar('Program başarıyla güncellendi', 'success');
      } else {
        // Yeni ekleme
        console.log('Adding new program');
        await programsService.add(programData);
        showSnackbar('Program başarıyla eklendi', 'success');
      }
      
      setFormOpen(false);
      setSelectedProgram(null);
      fetchPrograms();
    } catch (error) {
      console.error('Program kaydetme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Program kaydedilirken hata oluştu';
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'unknown',
        stack: error instanceof Error ? error.stack : 'no stack'
      });
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!programToDelete) return;

    try {
      await programsService.delete(programToDelete.id);
      showSnackbar('Program başarıyla silindi', 'success');
      setDeleteDialogOpen(false);
      setProgramToDelete(null);
      fetchPrograms();
    } catch (error) {
      console.error('Program silme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Program silinirken hata oluştu';
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
          <ProgramsIcon sx={{ color: '#1565C0', mr: 2, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
            Programlar
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddProgram}
          sx={{ borderRadius: 2 }}
        >
          Yeni Program
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Eğitim programlarını görüntüleyin, düzenleyin veya yeni program ekleyin.
      </Typography>

      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Program Adı</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Açıklama</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Oluşturulma Tarihi</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      Henüz kayıtlı program bulunmuyor. İlk programı eklemek için "Yeni Program" butonunu kullanın.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                programs.map((program) => (
                  <TableRow key={program.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {program.name}
                        </Typography>
                        <Chip 
                          label="Aktif Program" 
                          size="small" 
                          variant="filled"
                          color="success"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {program.description ? (
                          program.description.length > 80 
                            ? `${program.description.substring(0, 80)}...`
                            : program.description
                        ) : (
                          <em>Açıklama eklenmemiş</em>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {new Date(program.createdAt).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Görüntüle">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#1976d2' }}
                            onClick={() => {
                              // TODO: Program detay sayfası eklenebilir
                              console.log('Program detayları:', program);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#ed6c02' }}
                            onClick={() => handleEditProgram(program)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#d32f2f' }}
                            onClick={() => handleDeleteClick(program)}
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

      {/* Program Form Dialog */}
      <ProgramFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        program={selectedProgram}
      />

      {/* Silme Onay Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Programı Sil"
        content={`"${programToDelete?.name}" adlı programı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
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

export default Programs;