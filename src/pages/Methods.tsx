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
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  PlaylistAddCheck as MethodsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { methodsService, programsService } from '../services/firestore';
import { Method, Program } from '../types';
import MethodFormDialog from '../components/Methods/MethodFormDialog';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const Methods: React.FC = () => {
  const [methods, setMethods] = useState<Method[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<Method | null>(null);
  const [methodToDelete, setMethodToDelete] = useState<Method | null>(null);
  const [filterProgram, setFilterProgram] = useState<string>('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Program filtresine göre yöntemleri filtrele
    if (filterProgram === '') {
      setFilteredMethods(methods);
    } else {
      const filtered = methods.filter(method => method.programId === filterProgram);
      setFilteredMethods(filtered);
    }
  }, [methods, filterProgram]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [methodsData, programsData] = await Promise.all([
        methodsService.getAll(),
        programsService.getAll()
      ]);
      setMethods(methodsData);
      setPrograms(programsData);
      setFilteredMethods(methodsData);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Veriler yüklenemedi';
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddMethod = () => {
    setSelectedMethod(null);
    setFormOpen(true);
  };

  const handleEditMethod = (method: Method) => {
    setSelectedMethod(method);
    setFormOpen(true);
  };

  const handleDeleteClick = (method: Method) => {
    setMethodToDelete(method);
    setDeleteDialogOpen(true);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterProgram(event.target.value);
  };

  const handleFormSubmit = async (methodData: Omit<Method, 'id'>) => {
    try {
      console.log('Form submitted with data:', methodData);
      console.log('Selected method:', selectedMethod);
      
      if (selectedMethod) {
        // Güncelleme
        console.log('Updating method with ID:', selectedMethod.id);
        await methodsService.update(selectedMethod.id, methodData);
        showSnackbar('Yöntem başarıyla güncellendi', 'success');
      } else {
        // Yeni ekleme
        console.log('Adding new method');
        await methodsService.add(methodData);
        showSnackbar('Yöntem başarıyla eklendi', 'success');
      }
      
      setFormOpen(false);
      setSelectedMethod(null);
      fetchData();
    } catch (error) {
      console.error('Yöntem kaydetme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Yöntem kaydedilirken hata oluştu';
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'unknown',
        stack: error instanceof Error ? error.stack : 'no stack'
      });
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!methodToDelete) return;

    try {
      await methodsService.delete(methodToDelete.id);
      showSnackbar('Yöntem başarıyla silindi', 'success');
      setDeleteDialogOpen(false);
      setMethodToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Yöntem silme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Yöntem silinirken hata oluştu';
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    }
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Bilinmeyen Program';
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
          <MethodsIcon sx={{ color: '#1565C0', mr: 2, fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
            Öğretim Yöntemleri
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddMethod}
          sx={{ borderRadius: 2 }}
        >
          Yeni Yöntem
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Programlara özgü öğretim yöntemlerini görüntüleyin, düzenleyin veya yeni yöntem ekleyin.
      </Typography>

      {/* Program Filtresi */}
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterIcon sx={{ color: '#1565C0' }} />
            <Typography variant="h6" sx={{ color: '#333' }}>Filtreler</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Program Seç</InputLabel>
              <Select
                value={filterProgram}
                label="Program Seç"
                onChange={handleFilterChange}
              >
                <MenuItem value="">
                  <em>Tüm Programlar</em>
                </MenuItem>
                {programs.map(program => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {filterProgram && (
              <Chip
                label={`Filtrelenmiş: ${getProgramName(filterProgram)}`}
                onDelete={() => setFilterProgram('')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Paper>
      </Box>

      <Paper elevation={3} sx={{ overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Yöntem Adı</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Program</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Açıklama</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Oluşturulma Tarihi</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMethods.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" sx={{ color: '#666' }}>
                      {filterProgram 
                        ? 'Seçili programa ait yöntem bulunmuyor.' 
                        : 'Henüz kayıtlı yöntem bulunmuyor. İlk yöntemi eklemek için "Yeni Yöntem" butonunu kullanın.'
                      }
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMethods.map((method) => (
                  <TableRow key={method.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {method.name}
                        </Typography>
                        <Chip 
                          label="Aktif Yöntem" 
                          size="small" 
                          variant="filled"
                          color="warning"
                          sx={{ mt: 0.5 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getProgramName(method.programId)}
                        size="small"
                        variant="outlined"
                        color="info"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {method.description ? (
                          method.description.length > 60 
                            ? `${method.description.substring(0, 60)}...`
                            : method.description
                        ) : (
                          <em>Açıklama eklenmemiş</em>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {new Date(method.createdAt).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Görüntüle">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#1976d2' }}
                            onClick={() => {
                              // TODO: Yöntem detay sayfası eklenebilir
                              console.log('Yöntem detayları:', method);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Düzenle">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#ed6c02' }}
                            onClick={() => handleEditMethod(method)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sil">
                          <IconButton 
                            size="small" 
                            sx={{ color: '#d32f2f' }}
                            onClick={() => handleDeleteClick(method)}
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

      {/* Yöntem Form Dialog */}
      <MethodFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        method={selectedMethod}
        programs={programs}
      />

      {/* Silme Onay Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Yöntemi Sil"
        content={`"${methodToDelete?.name}" adlı yöntemi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
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

export default Methods;