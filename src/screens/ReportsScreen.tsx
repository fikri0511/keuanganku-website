import { useState, useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays, eachDayOfInterval, startOfYear, endOfYear, eachMonthOfInterval, isSameDay, isSameMonth } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { formatCurrency } from '@/lib/finance-utils';

export const ReportsScreen = () => {
  const { transactions, categories } = useFinance();
  const [activeTab, setActiveTab] = useState('weekly');

  // Filter expenses only
  const expenses = useMemo(() => {
    return transactions.filter(t => t.type === 'expense');
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

  // Monthly Data (Current Year)
  const monthlyData = useMemo(() => {
    const today = new Date();
    const start = startOfYear(today);
    const end = endOfYear(today);
    
    const months = eachMonthOfInterval({ start, end });

    return months.map(month => {
      const monthTransactions = expenses.filter(t => isSameMonth(new Date(t.date), month));
      const total = monthTransactions.reduce((sum, t) => sum + t.amount, 0);
      return {
        name: format(month, 'MMM', { locale: id }), // Jan, Feb, etc.
        fullDate: format(month, 'MMMM yyyy', { locale: id }),
        total: total,
      };
    });
  }, [expenses]);

  const handleExport = () => {
    // Sort by date descending
    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const dataToExport = sortedExpenses.map(t => {
      const category = categories.find(c => c.id === t.category_id);
      return {
        Tanggal: format(new Date(t.date), 'dd/MM/yyyy HH:mm'),
        Kategori: category ? category.name : 'Uncategorized',
        Catatan: t.note || '-',
        Jumlah: t.amount,
        Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran'
      };
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transaksi");
    
    // Generate filename
    const filename = `Laporan_Keuangan_${format(new Date(), 'dd_MM_yyyy')}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
          <p className="text-sm font-medium mb-1">{payload[0].payload.fullDate}</p>
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
          <p className="text-warmGray text-sm">Overview pengeluaran Anda</p>
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
            Mingguan (7 Hari)
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

        <TabsContent value="monthly" className="space-y-4">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pengeluaran Tahun Ini</CardTitle>
              <CardDescription>
                Total: {formatCurrency(monthlyData.reduce((acc, curr) => acc + curr.total, 0))}
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
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
                    {monthlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#FF6B6B" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 p-4 bg-teal/5 rounded-xl border border-teal/10">
        <h3 className="text-teal font-semibold mb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export Data
        </h3>
        <p className="text-sm text-warmGray mb-3">
          Unduh laporan keuangan lengkap Anda dalam format Excel (.xlsx) untuk analisis lebih lanjut.
        </p>
        <Button 
          onClick={handleExport} 
          className="w-full bg-teal hover:bg-teal-600 text-white"
        >
          Download Excel
        </Button>
      </div>
    </div>
  );
};
