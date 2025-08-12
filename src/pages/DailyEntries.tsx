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
  SelectChangeEvent,
  TextField,
  Grid
} from '@mui/material';
import {
  EditNote as EntriesIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  EventAvailable as PresentIcon,
  EventBusy as AbsentIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { dailyEntriesService, studentsService, programsService, methodsService, studentProgressionsService } from '../services/firestore';
import { DailyEntry, Student, Program, Method, StudentProgression } from '../types';
import DailyEntryFormDialog from '../components/DailyEntries/DailyEntryFormDialog';
import ConfirmDialog from '../components/Common/ConfirmDialog';

const DailyEntries: React.FC = () => {
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DailyEntry[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<DailyEntry | null>(null);
  
  // Filtre state'leri
  const [filterStudent, setFilterStudent] = useState<string>('');
  const [filterProgram, setFilterProgram] = useState<string>('');
  const [filterMethod, setFilterMethod] = useState<string>('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);
  const [searchText, setSearchText] = useState('');
  
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchAllData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, filterStudent, filterProgram, filterMethod, filterDate, searchText]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [entriesData, studentsData, programsData, methodsData] = await Promise.all([
        dailyEntriesService.getAll(),
        studentsService.getAll(),
        programsService.getAll(),
        methodsService.getAll()
      ]);
      
      setEntries(entriesData);
      setStudents(studentsData);
      setPrograms(programsData);
      setMethods(methodsData);
      setFilteredEntries(entriesData);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Veriler yüklenemedi';
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...entries];

    // Öğrenci filtresi
    if (filterStudent) {
      filtered = filtered.filter(entry => entry.studentId === filterStudent);
    }

    // Program filtresi
    if (filterProgram) {
      filtered = filtered.filter(entry => entry.programId === filterProgram);
    }

    // Yöntem filtresi
    if (filterMethod) {
      filtered = filtered.filter(entry => entry.methodId === filterMethod);
    }

    // Tarih filtresi
    if (filterDate) {
      const filterDateString = format(filterDate, 'yyyy-MM-dd');
      filtered = filtered.filter(entry => entry.date === filterDateString);
    }

    // Arama metni filtresi
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(entry => {
        const student = getStudentName(entry.studentId).toLowerCase();
        const program = getProgramName(entry.programId).toLowerCase();
        const method = getMethodName(entry.methodId).toLowerCase();
        const notes = entry.notes?.toLowerCase() || '';
        const absenceReason = entry.absenceReason?.toLowerCase() || '';
        
        return student.includes(searchLower) ||
               program.includes(searchLower) ||
               method.includes(searchLower) ||
               notes.includes(searchLower) ||
               absenceReason.includes(searchLower);
      });
    }

    // Tarihe göre sıralama (en yeni en üstte)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredEntries(filtered);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddEntry = () => {
    setSelectedEntry(null);
    setFormOpen(true);
  };

  const handleEditEntry = (entry: DailyEntry) => {
    setSelectedEntry(entry);
    setFormOpen(true);
  };

  const handleDeleteClick = (entry: DailyEntry) => {
    setEntryToDelete(entry);
    setDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (entryData: Omit<DailyEntry, 'id'>) => {
    try {
      console.log('Form submitted with data:', entryData);
      console.log('Selected entry:', selectedEntry);
      
      if (selectedEntry) {
        // Güncelleme
        console.log('Updating entry with ID:', selectedEntry.id);
        await dailyEntriesService.update(selectedEntry.id, entryData);
        showSnackbar('Günlük giriş başarıyla güncellendi', 'success');
      } else {
        // Yeni ekleme
        console.log('Adding new entry');
        await dailyEntriesService.add(entryData);
        showSnackbar('Günlük giriş başarıyla eklendi', 'success');
      }
      
      setFormOpen(false);
      setSelectedEntry(null);
      fetchAllData();
    } catch (error) {
      console.error('Günlük giriş kaydetme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Günlük giriş kaydedilirken hata oluştu';
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.code || 'unknown',
        stack: error instanceof Error ? error.stack : 'no stack'
      });
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!entryToDelete) return;

    try {
      await dailyEntriesService.delete(entryToDelete.id);
      showSnackbar('Günlük giriş başarıyla silindi', 'success');
      setDeleteDialogOpen(false);
      setEntryToDelete(null);
      fetchAllData();
    } catch (error) {
      console.error('Günlük giriş silme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : 'Günlük giriş silinirken hata oluştu';
      showSnackbar(`Hata: ${errorMessage}`, 'error');
    }
  };

  const clearFilters = () => {
    setFilterStudent('');
    setFilterProgram('');
    setFilterMethod('');
    setFilterDate(null);
    setSearchText('');
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student?.name || 'Bilinmeyen Öğrenci';
  };

  const getProgramName = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    return program?.name || 'Bilinmeyen Program';
  };

  const getMethodName = (methodId: string) => {
    const method = methods.find(m => m.id === methodId);
    return method?.name || 'Bilinmeyen Yöntem';
  };

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'default';
    if (score >= 5) return 'success';
    if (score >= 3) return 'warning';
    return 'error';
  };

  const hasActiveFilters = filterStudent || filterProgram || filterMethod || filterDate || searchText;

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
            <EntriesIcon sx={{ color: '#1565C0', mr: 2, fontSize: 32 }} />
            <Typography variant="h4" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
              Günlük Girişler
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEntry}
            sx={{ borderRadius: 2 }}
          >
            Yeni Giriş
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
          Öğrencilerin günlük performans verilerini görüntüleyin, düzenleyin veya yeni giriş ekleyin. 
          En sık kullanılan sayfadır.
        </Typography>

        {/* Filtreler ve Arama */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FilterIcon sx={{ color: '#1565C0' }} />
            <Typography variant="h6" sx={{ color: '#333' }}>Filtreler ve Arama</Typography>
            {hasActiveFilters && (
              <Button
                size="small"
                onClick={clearFilters}
                sx={{ ml: 'auto' }}
              >
                Filtreleri Temizle
              </Button>
            )}
          </Box>
          
          <Grid container spacing={2}>
            {/* Arama */}
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Ara"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Öğrenci, program, not..."
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                }}
              />
            </Grid>

            {/* Öğrenci Filtresi */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Öğrenci</InputLabel>
                <Select
                  value={filterStudent}
                  label="Öğrenci"
                  onChange={(e: SelectChangeEvent) => setFilterStudent(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Program Filtresi */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Program</InputLabel>
                <Select
                  value={filterProgram}
                  label="Program"
                  onChange={(e: SelectChangeEvent) => setFilterProgram(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {programs.map(program => (
                    <MenuItem key={program.id} value={program.id}>
                      {program.name.length > 20 ? `${program.name.substring(0, 20)}...` : program.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Yöntem Filtresi */}
            <Grid size={{ xs: 12, md: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Yöntem</InputLabel>
                <Select
                  value={filterMethod}
                  label="Yöntem"
                  onChange={(e: SelectChangeEvent) => setFilterMethod(e.target.value)}
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {methods.map(method => (
                    <MenuItem key={method.id} value={method.id}>
                      {method.name.length > 20 ? `${method.name.substring(0, 20)}...` : method.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Tarih Filtresi */}
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                size="small"
                fullWidth
                label="Tarih Seç"
                type="date"
                value={filterDate ? format(filterDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterDate(value ? new Date(value) : null);
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>

          {/* Aktif Filtreler */}
          {hasActiveFilters && (
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {filterStudent && (
                <Chip
                  label={`Öğrenci: ${getStudentName(filterStudent)}`}
                  onDelete={() => setFilterStudent('')}
                  color="primary"
                  size="small"
                />
              )}
              {filterProgram && (
                <Chip
                  label={`Program: ${getProgramName(filterProgram)}`}
                  onDelete={() => setFilterProgram('')}
                  color="secondary"
                  size="small"
                />
              )}
              {filterMethod && (
                <Chip
                  label={`Yöntem: ${getMethodName(filterMethod)}`}
                  onDelete={() => setFilterMethod('')}
                  color="info"
                  size="small"
                />
              )}
              {filterDate && (
                <Chip
                  label={`Tarih: ${format(filterDate, 'dd/MM/yyyy')}`}
                  onDelete={() => setFilterDate(null)}
                  color="warning"
                  size="small"
                />
              )}
              {searchText && (
                <Chip
                  label={`Arama: "${searchText}"`}
                  onDelete={() => setSearchText('')}
                  color="default"
                  size="small"
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Tablo */}
        <Paper elevation={3} sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Tarih</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Öğrenci</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Program</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Yöntem</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Set</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Skor</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Durum</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="body1" sx={{ color: '#666' }}>
                        {hasActiveFilters 
                          ? 'Filtrelere uygun giriş bulunamadı. Filtreleri değiştirip tekrar deneyin.'
                          : 'Henüz günlük giriş yapılmamış. İlk girişi eklemek için "Yeni Giriş" butonunu kullanın.'
                        }
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                          {new Date(entry.date).toLocaleDateString('tr-TR')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {getStudentName(entry.studentId)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 150 }}>
                          {getProgramName(entry.programId).length > 25
                            ? `${getProgramName(entry.programId).substring(0, 25)}...`
                            : getProgramName(entry.programId)
                          }
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 120 }}>
                          {getMethodName(entry.methodId).length > 20
                            ? `${getMethodName(entry.methodId).substring(0, 20)}...`
                            : getMethodName(entry.methodId)
                          }
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip 
                          label={`Set ${entry.setNumber}`} 
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        {entry.absenceReason ? (
                          <Chip 
                            label="YOKLUK" 
                            size="small"
                            color="error"
                            icon={<AbsentIcon />}
                          />
                        ) : (
                          <Chip 
                            label={entry.score?.toString() || '0'} 
                            size="small"
                            color={getScoreColor(entry.score)}
                            sx={{ 
                              fontWeight: 'bold',
                              minWidth: 40
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {entry.absenceReason ? (
                            <Tooltip title={`Yokluk Nedeni: ${entry.absenceReason}`}>
                              <Chip 
                                label="Devamsız" 
                                size="small"
                                color="error"
                                icon={<AbsentIcon />}
                              />
                            </Tooltip>
                          ) : (
                            <Chip 
                              label="Katıldı" 
                              size="small"
                              color="success"
                              icon={<PresentIcon />}
                            />
                          )}
                          {entry.notes && (
                            <Tooltip title={entry.notes}>
                              <Chip 
                                label="💬" 
                                size="small"
                                variant="outlined"
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          <Tooltip title="Görüntüle">
                            <IconButton 
                              size="small" 
                              sx={{ color: '#1976d2' }}
                              onClick={() => {
                                // TODO: Giriş detay sayfası eklenebilir
                                console.log('Giriş detayları:', entry);
                              }}
                            >
                              <ViewIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Düzenle">
                            <IconButton 
                              size="small" 
                              sx={{ color: '#ed6c02' }}
                              onClick={() => handleEditEntry(entry)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Sil">
                            <IconButton 
                              size="small" 
                              sx={{ color: '#d32f2f' }}
                              onClick={() => handleDeleteClick(entry)}
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

        {/* İstatistikler */}
        <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Paper elevation={1} sx={{ p: 2, minWidth: 150 }}>
            <Typography variant="h6" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
              {filteredEntries.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Toplam Giriş
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, minWidth: 150 }}>
            <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
              {filteredEntries.filter(e => !e.absenceReason).length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Katılım
            </Typography>
          </Paper>
          <Paper elevation={1} sx={{ p: 2, minWidth: 150 }}>
            <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 'bold' }}>
              {filteredEntries.filter(e => e.absenceReason).length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Devamsızlık
            </Typography>
          </Paper>
        </Box>

        {/* Form Dialog */}
        <DailyEntryFormDialog
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleFormSubmit}
          entry={selectedEntry}
          students={students}
          programs={programs}
          methods={methods}
        />

        {/* Silme Onay Dialog */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Günlük Girişi Sil"
          content={`${entryToDelete ? format(new Date(entryToDelete.date), 'dd/MM/yyyy', { locale: tr }) : ''} tarihli girişi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
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

export default DailyEntries;