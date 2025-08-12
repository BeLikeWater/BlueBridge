import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import ProgressChart from '../components/Progress/ProgressChart';
import { studentsService, programsService, methodsService, dailyEntriesService, studentProgressionsService } from '../services/firestore';
import { Student, Program, Method, DailyEntry, StudentProgression } from '../types';

const Progress: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [chartData, setChartData] = useState<DailyEntry[]>([]);
  const [studentProgression, setStudentProgression] = useState<StudentProgression | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [studentsData, programsData] = await Promise.all([
          studentsService.getAll(),
          programsService.getAll()
        ]);
        
        setStudents(studentsData);
        setPrograms(programsData);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchMethods = async () => {
      if (!selectedProgram) {
        setMethods([]);
        return;
      }

      try {
        const methodsData = await methodsService.getByProgram(selectedProgram);
        setMethods(methodsData);
      } catch (error) {
        console.error('Yöntem yükleme hatası:', error);
      }
    };

    fetchMethods();
  }, [selectedProgram]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedStudent || !selectedProgram || !selectedMethod) {
        setChartData([]);
        setStudentProgression(null);
        return;
      }

      setLoadingChart(true);
      try {
        const [entriesData, progressionData] = await Promise.all([
          dailyEntriesService.getByStudent(selectedStudent, selectedProgram, selectedMethod),
          studentProgressionsService.getByStudent(selectedStudent, selectedProgram, selectedMethod)
        ]);
        
        setChartData(entriesData);
        setStudentProgression(progressionData);
      } catch (error) {
        console.error('Grafik verisi yükleme hatası:', error);
        setChartData([]);
        setStudentProgression(null);
      } finally {
        setLoadingChart(false);
      }
    };

    fetchChartData();
  }, [selectedStudent, selectedProgram, selectedMethod]);

  // Seçilen öğrenciye göre programları filtrele
  const availablePrograms = programs; // Tüm programlar kullanılabilir

  // Seçilen programa göre yöntemleri filtrele
  const availableMethods = methods;

  // Seçilen varlıkların isimlerini al
  const studentName = students.find(s => s.id === selectedStudent)?.name || '';
  const programName = programs.find(p => p.id === selectedProgram)?.name || '';
  const methodName = methods.find(m => m.id === selectedMethod)?.name || '';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon sx={{ color: '#1565C0', mr: 2, fontSize: 32 }} />
        <Typography variant="h4" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
          İlerleme Grafikleri
        </Typography>
      </Box>

      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Öğrencilerin günlük girişleri ve ilerleme durumlarını grafiksel olarak inceleyin.
        Öğrenci, program ve yöntem seçerek detaylı analiz yapabilirsiniz.
      </Typography>

      {/* Filtreler */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#333' }}>
          Grafik Filtreleri
        </Typography>
        
        <Grid container spacing={3}>
          {/* Öğrenci Seçimi */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth>
              <InputLabel>Öğrenci Seçin</InputLabel>
              <Select
                value={selectedStudent}
                label="Öğrenci Seçin"
                onChange={(e) => {
                  setSelectedStudent(e.target.value);
                  setSelectedProgram('');
                  setSelectedMethod('');
                }}
              >
                {students.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Program Seçimi */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth disabled={!selectedStudent}>
              <InputLabel>Program Seçin</InputLabel>
              <Select
                value={selectedProgram}
                label="Program Seçin"
                onChange={(e) => {
                  setSelectedProgram(e.target.value);
                  setSelectedMethod('');
                }}
              >
                {availablePrograms.map(program => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Yöntem Seçimi */}
          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth disabled={!selectedProgram}>
              <InputLabel>Yöntem Seçin</InputLabel>
              <Select
                value={selectedMethod}
                label="Yöntem Seçin"
                onChange={(e) => setSelectedMethod(e.target.value)}
              >
                {availableMethods.map(method => (
                  <MenuItem key={method.id} value={method.id}>
                    {method.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Seçim Özeti */}
        {(selectedStudent || selectedProgram || selectedMethod) && (
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" sx={{ alignSelf: 'center', mr: 1, fontWeight: 'bold' }}>
              Seçilenler:
            </Typography>
            {selectedStudent && (
              <Chip 
                label={`Öğrenci: ${studentName}`} 
                variant="outlined" 
                color="primary" 
                size="small" 
              />
            )}
            {selectedProgram && (
              <Chip 
                label={`Program: ${programName}`} 
                variant="outlined" 
                color="success" 
                size="small" 
              />
            )}
            {selectedMethod && (
              <Chip 
                label={`Yöntem: ${methodName}`} 
                variant="outlined" 
                color="warning" 
                size="small" 
              />
            )}
          </Box>
        )}

        {/* Progresyon Durumu */}
        {selectedStudent && selectedProgram && selectedMethod && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f8f9ff', borderRadius: 1, border: '1px solid #e3f2fd' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1565C0', fontWeight: 'bold' }}>
              📊 Progresyon Durumu
            </Typography>
            {studentProgression ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Mevcut Set: 
                </Typography>
                <Chip 
                  label={`Set ${studentProgression.currentSet}`}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
                
                {studentProgression.set1CompletedAt && (
                  <Chip 
                    label={`Set 1 ✓ (${new Date(studentProgression.set1CompletedAt).toLocaleDateString('tr-TR')})`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
                
                {studentProgression.set2CompletedAt && (
                  <Chip 
                    label={`Set 2 ✓ (${new Date(studentProgression.set2CompletedAt).toLocaleDateString('tr-TR')})`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
                
                {studentProgression.set3CompletedAt && (
                  <Chip 
                    label={`Set 3 ✓ (${new Date(studentProgression.set3CompletedAt).toLocaleDateString('tr-TR')})`}
                    color="success"
                    size="small"
                    variant="outlined"
                  />
                )}
                
                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                  Son güncelleme: {new Date(studentProgression.updatedAt).toLocaleDateString('tr-TR')}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label="Progresyon verisi yok"
                  color="warning"
                  size="small"
                  variant="outlined"
                />
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Bu öğrenci için henüz progresyon kaydı oluşturulmamış. Grafik mevcut verileri gösterecek.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      {/* Grafik Alanı */}
      {selectedStudent && selectedProgram && selectedMethod ? (
        loadingChart ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : chartData.length > 0 ? (
          <ProgressChart
            entries={chartData}
            studentName={studentName}
            programName={programName}
            methodName={methodName}
          />
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            Seçilen kriterlere uygun veri bulunamadı. Önce günlük girişler bölümünden veri girişi yapın.
          </Alert>
        )
      ) : (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Grafik görüntülemek için önce öğrenci, program ve yöntem seçimi yapın.
        </Alert>
      )}

      {/* Açıklamalar */}
      <Paper elevation={2} sx={{ p: 3, mt: 3, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1565C0' }}>
          Grafik Açıklaması
        </Typography>
        
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Skor Sistemi:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>1-2:</strong> Başlangıç seviyesi (kırmızı tonları)
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • <strong>3-4:</strong> Gelişim seviyesi (sarı-turuncu tonları)
            </Typography>
            <Typography variant="body2">
              • <strong>5-6:</strong> Başarılı seviye (yeşil tonları)
            </Typography>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Grafik Özellikleri:
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Set 1, Set 2, Set 3 ayrı çizgilerle gösterilir
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              • Yokluk günleri grafikte boşluk bırakır
            </Typography>
            <Typography variant="body2">
              • Kırmızı noktalar yokluk nedenlerini gösterir
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Progress;