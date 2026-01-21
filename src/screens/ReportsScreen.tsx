import { useState, useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { format, subDays, eachDayOfInterval, startOfYear, endOfYear, eachMonthOfInterval, isSameDay, isSameMonth, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileSpreadsheet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatCurrency } from '@/lib/finance-utils';

const COLORS = [
  '#0D7377', '#FF6B6B', '#51CF66', '#F6AD55', '#4299E1', '#9F7AEA', '#ED64A6', '#718096',
  '#D69E2E', '#38B2AC', '#805AD5', '#E53E3E', '#319795', '#DD6B20', '#3182CE', '#D53F8C'
];

export const ReportsScreen = () => {
  const { transactions, categories } = useFinance();
  const [activeTab, setActiveTab] = useState('weekly');
  const [selectedMonthStr, setSelectedMonthStr] = useState(format(new Date(), 'yyyy-MM'));

  // Parse selected month
  const selectedDate = useMemo(() => {
    const [year, month] = selectedMonthStr.split('-').map(Number);
    return new Date(year, month - 1);
  }, [selectedMonthStr]);

  // Generate list of months for dropdown (last 12 months)
  const monthOptions = useMemo(() => {
    const today = new Date();
    const months = [];
    for (let i = 0; i < 12; i++) {
      const d = subMonths(today, i);
      months.push({
        value: format(d, 'yyyy-MM'),
        label: format(d, 'MMMM yyyy', { locale: id })
      });
    }
    return months;
  }, []);

  // Filter expenses only
  const expenses = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && !isNaN(d.getTime());
    });
  }, [transactions]);

  // Weekly Data (Current Week)
  const weeklyData = useMemo(() => {
    const today = new Date();
    // Show last 7 days
    const start = subDays(today, 6);
    const end = today;
    
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dayTransactions = expenses.filter(t => isSameDay(new Date(t.date), day));
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: format(day, 'EEE', { locale: id }), // Mon, Tue, etc.
        fullDate: format(day, 'dd MMM', { locale: id }),
        total: total,
      };
    });
  }, [expenses]);

  // Monthly Data (Specific Month - Daily Breakdown)
  const monthlyDailyData = useMemo(() => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    // Handle future dates or end of month correctly
    const now = new Date();
    const actualEnd = end > now ? end : end; // just show full month always

    const days = eachDayOfInterval({ start, end: actualEnd });

    return days.map(day => {
      const dayTransactions = expenses.filter(t => isSameDay(new Date(t.date), day));
      const total = dayTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: format(day, 'd', { locale: id }), // 1, 2, 3...
        fullDate: format(day, 'dd MMM yyyy', { locale: id }),
        total: total,
      };
    });
  }, [expenses, selectedDate]);

  // Category Data for Pie Chart (Selected Month)
  const monthlyCategoryData = useMemo(() => {
    const monthTransactions = expenses.filter(t => isSameMonth(new Date(t.date), selectedDate));
    
    const categoryTotals: Record<string, number> = {};
    
    monthTransactions.forEach(t => {
      const catId = t.categoryId;
      categoryTotals[catId] = (categoryTotals[catId] || 0) + t.amount;
    });

    const entries = Object.keys(categoryTotals)
      .map(catId => {
        const category = categories.find(c => c.id === catId);
        return {
          name: category ? category.name : 'Lainnya',
          value: categoryTotals[catId],
          color: category?.color
        };
      })
      .sort((a, b) => b.value - a.value);

    // Always assign distinct colors from the palette for the chart to ensure differentiation
    return entries.map((entry, index) => ({
      ...entry,
      color: COLORS[index % COLORS.length]
    }));
  }, [expenses, selectedDate, categories]);

  const monthlyTotalExpense = useMemo(() => {
    return monthlyCategoryData.reduce((acc, curr) => acc + curr.value, 0);
  }, [monthlyCategoryData]);

  const handleExport = () => {
    // Export data based on selected month
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);

    // Get all transactions for this month (income & expense)
    const monthTransactions = transactions.filter(t => {
      const d = new Date(t.date);
      return !isNaN(d.getTime()) && isSameMonth(d, selectedDate);
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const totalIncome = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Prepare Excel Data using Array of Arrays (AOA) for better layout control
    const wb = XLSX.utils.book_new();
    
    const wsData = [
      [`Laporan Keuangan - ${format(selectedDate, 'MMMM yyyy', { locale: id })}`],
      [''],
      ['RINGKASAN'],
      ['Total Pemasukan', totalIncome],
      ['Total Pengeluaran', totalExpense],
      ['Sisa (Cashflow)', totalIncome - totalExpense],
      [''],
      ['RINCIAN KATEGORI PENGELUARAN'],
      ['Kategori', 'Jumlah', 'Persentase']
    ];

    // Add categories
    monthlyCategoryData.forEach(c => {
      const percentage = (c.value / totalExpense) * 100;
      wsData.push([c.name, c.value, `${percentage.toFixed(1)}%`]);
    });

    wsData.push(['']);
    wsData.push(['DETAIL TRANSAKSI']);
    wsData.push(['Tanggal', 'Jam', 'Tipe', 'Kategori', 'Catatan', 'Jumlah']);

    // Add transactions
    monthTransactions.forEach(t => {
      const category = categories.find(c => c.id === t.categoryId);
      wsData.push([
        format(new Date(t.date), 'dd/MM/yyyy'),
        format(new Date(t.date), 'HH:mm'),
        t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        category ? category.name : '-',
        t.note || '-',
        t.amount
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths (approximate)
    ws['!cols'] = [
      { wch: 15 }, // A
      { wch: 20 }, // B
      { wch: 15 }, // C
      { wch: 20 }, // D
      { wch: 30 }, // E
      { wch: 15 }  // F
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Laporan Bulanan");
    
    const filename = `Laporan_Keuangan_${format(selectedDate, 'MMM_yyyy')}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="text-sm font-medium mb-1">{payload[0].payload.fullDate || payload[0].name}</p>
          <p className="text-sm font-bold text-coral">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="pb-24 pt-8 px-6 min-h-screen bg-warmCream">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Laporan</h1>
          <p className="text-warmGray text-sm">Analisis keuangan Anda</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleExport}
          className="text-teal border-teal/20 hover:bg-teal/5"
          title="Export Excel"
        >
          <FileSpreadsheet className="w-5 h-5" />
        </Button>
      </div>

      <Tabs defaultValue="weekly" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-white shadow-sm h-12 rounded-xl p-1">
          <TabsTrigger 
            value="weekly" 
            className="rounded-lg data-[state=active]:bg-teal data-[state=active]:text-white font-medium transition-all"
          >
            Mingguan
          </TabsTrigger>
          <TabsTrigger 
            value="monthly"
            className="rounded-lg data-[state=active]:bg-teal data-[state=active]:text-white font-medium transition-all"
          >
            Bulanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-4">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pengeluaran 7 Hari Terakhir</CardTitle>
              <CardDescription>
                Total: {formatCurrency(weeklyData.reduce((acc, curr) => acc + curr.total, 0))}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#718096', fontSize: 12 }} 
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F7FAFC' }} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#FF6B6B" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-6">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm">
             <span className="text-sm font-medium text-gray-600">Pilih Periode:</span>
             <Select value={selectedMonthStr} onValueChange={setSelectedMonthStr}>
              <SelectTrigger className="w-[180px] border-none bg-gray-50 h-9">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Kategori Pengeluaran</CardTitle>
              <CardDescription>
                {format(selectedDate, 'MMMM yyyy', { locale: id })}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full relative">
              {monthlyCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {monthlyCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p>Belum ada pengeluaran</p>
                </div>
              )}
            </CardContent>
          </Card>

           <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600 px-1">Rincian Kategori</h3>
            {monthlyCategoryData.map((item, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color || COLORS[index % COLORS.length] }} 
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-800">{formatCurrency(item.value)}</span>
                  <span className="text-xs text-gray-500">
                    {((item.value / monthlyTotalExpense) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tren Harian</CardTitle>
              <CardDescription>
                Total: {formatCurrency(monthlyTotalExpense)}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyDailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#718096', fontSize: 10 }} 
                    dy={10}
                    interval={2} // Show every 3rd label to avoid crowding
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F7FAFC' }} />
                  <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                    {monthlyDailyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#FF6B6B" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 mb-4 p-4 bg-teal/5 rounded-xl border border-teal/10">
        <h3 className="text-teal font-semibold mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export Data Bulan Ini
        </h3>
        <p className="text-sm text-warmGray mb-3">
          Unduh laporan lengkap bulan {format(selectedDate, 'MMMM yyyy', { locale: id })} dalam format Excel.
        </p>
        <Button 
          onClick={handleExport} 
          className="w-full bg-teal hover:bg-teal-600 text-white"
        >
          Download Laporan Bulanan
        </Button>
      </div>
    </div>
  );
};
