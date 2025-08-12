import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid,
  Paper, 
  Typography, 
  Card, 
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  People as StudentsIcon,
  Assignment as ProgramsIcon,
  PlaylistAddCheck as MethodsIcon,
  EditNote as EntriesIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { studentsService, programsService, methodsService, dailyEntriesService } from '../services/firestore';
import { Student, Program, Method, DailyEntry } from '../types';

const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, programsData, methodsData, entriesData] = await Promise.all([
          studentsService.getAll(),
          programsService.getAll(),
          methodsService.getAll(),
          dailyEntriesService.getRecent(5)
        ]);
        
        setStudents(studentsData);
        setPrograms(programsData);
        setMethods(methodsData);
        setDailyEntries(entriesData);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // İstatistikler
  const totalStudents = students.length;
  const totalPrograms = programs.length;
  const totalMethods = methods.length;
  const todayEntries = dailyEntries.filter(entry => 
    entry.date === new Date().toISOString().split('T')[0]
  ).length;

  // Son günlük girişler
  const recentEntries = dailyEntries.slice(0, 5);

  // İstatistik kartları
  const stats = [
    {
      title: 'Toplam Öğrenci',
      value: totalStudents,
      icon: StudentsIcon,
      color: '#1976d2',
      description: 'Sisteme kayıtlı öğrenci sayısı'
    },
    {
      title: 'Aktif Program',
      value: totalPrograms,
      icon: ProgramsIcon,
      color: '#388e3c',
      description: 'Tanımlı eğitim programı'
    },
    {
      title: 'Öğretim Yöntemi',
      value: totalMethods,
      icon: MethodsIcon,
      color: '#f57c00',
      description: 'Kullanılabilir öğretim yöntemi'
    },
    {
      title: 'Bugünkü Girişler',
      value: todayEntries,
      icon: EntriesIcon,
      color: '#7b1fa2',
      description: 'Bugün yapılan günlük giriş'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#1565C0', fontWeight: 'bold' }}>
        Ana Sayfa
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
        Mavi Köprü otizm çocuk takip sistemi ana sayfasına hoş geldiniz. 
        Öğrencilerinizin eğitim süreçlerini takip etmek için aşağıdaki bilgileri kullanabilirsiniz.
      </Typography>

      {/* İstatistik Kartları */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                  border: `1px solid ${stat.color}30`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon sx={{ color: stat.color, fontSize: 32, mr: 2 }} />
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#333' }}>
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {stat.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3}>
        {/* Son Girişler */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CalendarIcon sx={{ color: '#1565C0', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
                Son Günlük Girişler
              </Typography>
            </Box>

            {recentEntries.length > 0 ? (
              <List>
                {recentEntries.map((entry, index) => {
                  const student = students.find(s => s.id === entry.studentId);
                  const program = programs.find(p => p.id === entry.programId);
                  const method = methods.find(m => m.id === entry.methodId);
                  
                  return (
                    <React.Fragment key={entry.id}>
                      <ListItem sx={{ px: 0, py: 2 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {student?.name}
                              </Typography>
                              <Chip 
                                label={entry.date} 
                                size="small" 
                                variant="outlined"
                                icon={<CalendarIcon />}
                              />
                              {entry.absenceReason ? (
                                <Chip 
                                  label="YOKLUK" 
                                  size="small" 
                                  color="error"
                                />
                              ) : (
                                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                  <Chip 
                                    label={`Set ${entry.setNumber}`} 
                                    size="small" 
                                    color="primary"
                                    variant="outlined"
                                  />
                                  <Chip 
                                    label={`Skor: ${entry.score || 0}`} 
                                    size="small" 
                                    color={entry.score && entry.score >= 5 ? 'success' : entry.score && entry.score >= 3 ? 'warning' : 'error'}
                                  />
                                </Box>
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                                <strong>Program:</strong> {program?.name}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                                <strong>Yöntem:</strong> {method?.name}
                              </Typography>
                              {entry.absenceReason && (
                                <Typography variant="body2" sx={{ color: '#d32f2f', fontStyle: 'italic' }}>
                                  <strong>Yokluk Nedeni:</strong> {entry.absenceReason}
                                </Typography>
                              )}
                              {entry.notes && (
                                <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                                  <strong>Not:</strong> {entry.notes}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < recentEntries.length - 1 && <Divider />}
                    </React.Fragment>
                  );
                })}
              </List>
            ) : (
              <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 4 }}>
                Henüz günlük giriş yapılmamış.
              </Typography>
            )}
          </Paper>
        </Grid>

        {/* Hızlı Erişim */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} sx={{ p: 3, height: 'fit-content' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrendingUpIcon sx={{ color: '#1565C0', mr: 1 }} />
              <Typography variant="h6" sx={{ color: '#1565C0', fontWeight: 'bold' }}>
                Öğrenci Listesi
              </Typography>
            </Box>

            <List>
              {students.map((student, index) => (
                <React.Fragment key={student.id}>
                  <ListItem sx={{ px: 0, py: 1.5 }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {student.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: '#666' }}>
                            {student.diagnosis}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#999', fontSize: '0.75rem' }}>
                            Kayıt: {new Date(student.createdAt).toLocaleDateString('tr-TR')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < students.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;