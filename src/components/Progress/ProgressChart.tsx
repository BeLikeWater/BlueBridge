import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { DailyEntry } from '../../types';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ProgressChartProps {
  entries: DailyEntry[];
  studentName: string;
  programName: string;
  methodName: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  entries, 
  studentName, 
  programName, 
  methodName 
}) => {
  // Verileri set bazında grupla
  const set1Entries = entries.filter(entry => entry.setNumber === 1);
  const set2Entries = entries.filter(entry => entry.setNumber === 2);
  const set3Entries = entries.filter(entry => entry.setNumber === 3);

  // Set 1 verilerini hazırla
  const set1ChartData = set1Entries.map((entry, index) => ({
    day: index + 1,
    date: entry.date,
    dateFormatted: format(parseISO(entry.date), 'dd MMM', { locale: tr }),
    score: entry.absenceReason ? null : entry.score,
    hasAbsence: !!entry.absenceReason,
    absenceReason: entry.absenceReason,
    notes: entry.notes,
    setNumber: entry.setNumber,
    // Devamsızlık için özel görsel değer
    absenceMarker: entry.absenceReason ? 0.5 : null
  }));

  // Set 2 verilerini hazırla
  const set2ChartData = set2Entries.map((entry, index) => ({
    day: index + 1,
    date: entry.date,
    dateFormatted: format(parseISO(entry.date), 'dd MMM', { locale: tr }),
    score: entry.absenceReason ? null : entry.score,
    hasAbsence: !!entry.absenceReason,
    absenceReason: entry.absenceReason,
    notes: entry.notes,
    setNumber: entry.setNumber,
    // Devamsızlık için özel görsel değer
    absenceMarker: entry.absenceReason ? 0.5 : null
  }));

  // Set 3 verilerini hazırla
  const set3ChartData = set3Entries.map((entry, index) => ({
    day: index + 1,
    date: entry.date,
    dateFormatted: format(parseISO(entry.date), 'dd MMM', { locale: tr }),
    score: entry.absenceReason ? null : entry.score,
    hasAbsence: !!entry.absenceReason,
    absenceReason: entry.absenceReason,
    notes: entry.notes,
    setNumber: entry.setNumber,
    // Devamsızlık için özel görsel değer
    absenceMarker: entry.absenceReason ? 0.5 : null
  }));

  // Custom Tooltip Component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (data.hasAbsence) {
        return (
          <Paper sx={{ p: 2, border: '1px solid #ccc' }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {data.dateFormatted}
            </Typography>
            <Chip 
              label="Devamsız" 
              color="error" 
              size="small" 
              sx={{ mb: 1 }}
            />
            <Typography variant="body2">
              Neden: {data.absenceReason}
            </Typography>
          </Paper>
        );
      }

      return (
        <Paper sx={{ p: 2, border: '1px solid #ccc' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
            {data.dateFormatted} - Set {data.setNumber}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Skor: <span style={{ fontWeight: 'bold', color: '#1976d2' }}>{data.score}/6</span>
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Gün: {data.day}
          </Typography>
          {data.notes && (
            <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#666' }}>
              Not: {data.notes}
            </Typography>
          )}
        </Paper>
      );
    }
    return null;
  };

  // Render chart for a specific set
  const renderChart = (chartData: any[], setNumber: number, color: string) => {
    if (chartData.length === 0) {
      return (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1565C0' }}>
            Set {setNumber} İlerleme Grafiği
          </Typography>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Set {setNumber} için henüz veri bulunmuyor
            </Typography>
          </Box>
        </Paper>
      );
    }

    const completedEntries = chartData.filter(entry => !entry.hasAbsence);
    const averageScore = completedEntries.length > 0 
      ? (completedEntries.reduce((sum, entry) => sum + (entry.score || 0), 0) / completedEntries.length).toFixed(1)
      : '0';

    return (
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#1565C0' }}>
            Set {setNumber} İlerleme Grafiği
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Chip 
              label={`Ortalama: ${averageScore}`} 
              color="primary" 
              size="small" 
            />
            <Chip 
              label={`Toplam Gün: ${chartData.length}`} 
              color="secondary" 
              size="small" 
            />
            <Chip 
              label={`Katılım: ${completedEntries.length}`} 
              color="success" 
              size="small" 
            />
          </Box>
        </Box>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="dateFormatted" 
              label={{ value: 'Tarih', position: 'insideBottom', offset: -5 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              domain={[0, 6]} 
              ticks={[1, 2, 3, 4, 5, 6]}
              label={{ value: 'Skor', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            
            {/* Skor çizgisi */}
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke={color}
              strokeWidth={3}
              dot={{ fill: color, strokeWidth: 2, r: 6 }}
              connectNulls={false}
              name="Performans Skoru"
            />
            
            {/* Devamsızlık işaretçileri */}
            <Line 
              type="monotone" 
              dataKey="absenceMarker" 
              stroke="#f44336"
              strokeWidth={2}
              dot={{ fill: '#f44336', strokeWidth: 2, r: 8 }}
              connectNulls={false}
              name="Devamsızlık"
            />
            
            {/* Hedef çizgileri */}
            <ReferenceLine y={3} stroke="#ff9800" strokeDasharray="5 5" label="Gelişim Sınırı" />
            <ReferenceLine y={5} stroke="#4caf50" strokeDasharray="5 5" label="Başarı Sınırı" />
          </LineChart>
        </ResponsiveContainer>

        {/* İstatistikler */}
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
      </Paper>
    );
  };

  if (entries.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#666' }}>
          Grafik Görüntülenemiyor
        </Typography>
        <Typography variant="body1" sx={{ color: '#999', mb: 2 }}>
          <strong>{studentName}</strong> öğrencisi için <strong>{programName}</strong> programı ve <strong>{methodName}</strong> yöntemi kombinasyonuna ait günlük giriş verisi bulunamadı.
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          Bu kombinasyon için veri girişi yapın veya farklı bir program/yöntem seçin.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Başlık Bilgileri */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9ff' }}>
        <Typography variant="h5" sx={{ mb: 2, color: '#1565C0', fontWeight: 'bold' }}>
          {studentName} - İlerleme Raporu
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Program:</strong> {programName}
        </Typography>
        <Typography variant="body1">
          <strong>Yöntem:</strong> {methodName}
        </Typography>
      </Paper>

      {/* Set 1 Grafiği */}
      {renderChart(set1ChartData, 1, '#1976d2')}

      {/* Set 2 Grafiği */}
      {renderChart(set2ChartData, 2, '#ed6c02')}

      {/* Set 3 Grafiği */}
      {renderChart(set3ChartData, 3, '#2e7d32')}
    </Box>
  );
};

export default ProgressChart;