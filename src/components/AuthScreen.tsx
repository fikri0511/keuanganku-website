import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const AuthScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      let loginEmail = emailOrUsername;
      
      // Jika input bukan email (tidak ada @), cari email berdasarkan username
      if (!emailOrUsername.includes('@')) {
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('username', emailOrUsername);
        
        if (profileError || !profiles || profiles.length === 0) {
          toast.error('Username tidak ditemukan', {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            },
          });
          setIsLoading(false);
          return;
        }
        
        loginEmail = profiles[0].email;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (error) {
        // Tampilkan toast error untuk kesalahan login
        if (error.message.includes('Invalid login credentials') || 
            error.message.includes('Email not confirmed') ||
            error.message.includes('Invalid')) {
          toast.error('Email/username atau password yang Anda masukkan salah. Silakan periksa kembali dan coba lagi.', {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            },
          });
        } else {
          toast.error(error.message || 'Gagal masuk', {
            style: {
              background: '#fee2e2',
              color: '#991b1b',
              border: '1px solid #fca5a5',
            },
          });
        }
        throw error;
      }
      // Auth state change will be picked up by the context
      toast.success('Berhasil masuk!', {
        style: {
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #86efac',
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Cek apakah username sudah digunakan
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();
      
      if (existingProfile) {
        toast.error('Username sudah digunakan. Silakan pilih username lain.', {
          style: {
            background: '#fee2e2',
            color: '#991b1b',
            border: '1px solid #fca5a5',
          },
        });
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username,
          },
        },
      });

      if (error) throw error;
      toast.success('Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi atau login langsung.', {
        style: {
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #86efac',
        },
      });
    } catch (error: any) {
      toast.error(error.message || 'Gagal mendaftar', {
        style: {
          background: '#fee2e2',
          color: '#991b1b',
          border: '1px solid #fca5a5',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      toast.success('Masuk sebagai tamu berhasil!', {
        style: {
          background: '#dcfce7',
          color: '#166534',
          border: '1px solid #86efac',
        },
      });
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes('Anonymous sign-ins are disabled')) {
         toast.error('Fitur Tamu belum diaktifkan. Harap aktifkan "Anonymous Sign-ins" di pengaturan Supabase Anda.', {
           style: {
             background: '#fee2e2',
             color: '#991b1b',
             border: '1px solid #fca5a5',
           },
         });
      } else {
         toast.error(error.message || 'Gagal masuk sebagai tamu.', {
           style: {
             background: '#fee2e2',
             color: '#991b1b',
             border: '1px solid #fca5a5',
           },
         });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-warmCream p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/vite.svg" alt="KeuanganKu Logo" className="w-12 h-12" />
            <CardTitle className="text-3xl font-bold text-teal font-mono">KeuanganKu</CardTitle>
          </div>
          <CardDescription>Kelola keuanganmu dengan mudah dan cepat</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Masuk</TabsTrigger>
              <TabsTrigger value="register">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email atau Username</Label>
                  <Input 
                    id="email-login" 
                    type="text" 
                    placeholder="email@example.com atau username" 
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input 
                    id="password-login" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-teal hover:bg-teal-600" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Masuk
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-register">Nama Lengkap</Label>
                  <Input 
                    id="name-register" 
                    type="text" 
                    placeholder="Nama Anda" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username-register">Username</Label>
                  <Input 
                    id="username-register" 
                    type="text" 
                    placeholder="username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={3}
                    pattern="[a-zA-Z0-9_]+"
                    title="Username hanya boleh mengandung huruf, angka, dan underscore"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-register">Email</Label>
                  <Input 
                    id="email-register" 
                    type="email" 
                    placeholder="nama@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-register">Password</Label>
                  <Input 
                    id="password-register" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full bg-teal hover:bg-teal-600" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Daftar Akun Baru
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Atau</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              type="button" 
              className="w-full mt-4" 
              onClick={handleGuestLogin}
              disabled={isLoading}
            >
              Masuk sebagai Tamu
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-xs text-muted-foreground">
          &copy; 2026 KeuanganKu App
        </CardFooter>
      </Card>
    </div>
  );
};
