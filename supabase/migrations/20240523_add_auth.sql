-- Add user_id to tables
ALTER TABLE public.wallets ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();

-- Enable RLS
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create Policies for Wallets
CREATE POLICY "Users can view their own wallets" 
ON public.wallets FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets" 
ON public.wallets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets" 
ON public.wallets FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallets" 
ON public.wallets FOR DELETE 
USING (auth.uid() = user_id);

-- Create Policies for Categories
CREATE POLICY "Users can view their own categories" 
ON public.categories FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" 
ON public.categories FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
ON public.categories FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
ON public.categories FOR DELETE 
USING (auth.uid() = user_id);

-- Create Policies for Transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions" 
ON public.transactions FOR DELETE 
USING (auth.uid() = user_id);

-- Update default data seeding to use user_id if available, or just rely on the app to seed for new users.
-- We should probably create a function to seed data for a new user.

CREATE OR REPLACE FUNCTION public.seed_default_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert Default Wallets
  INSERT INTO public.wallets (name, icon, balance, user_id) VALUES
  ('Bank BCA', 'Landmark', 0, NEW.id),
  ('Dompet Cash', 'Wallet', 0, NEW.id),
  ('GoPay', 'Smartphone', 0, NEW.id);

  -- Insert Default Categories
  INSERT INTO public.categories (name, icon, color, type, user_id) VALUES
  ('Gaji', 'Briefcase', '#51CF66', 'income', NEW.id),
  ('Freelance', 'Laptop', '#51CF66', 'income', NEW.id),
  ('Investasi', 'TrendingUp', '#51CF66', 'income', NEW.id),
  ('Hadiah', 'Gift', '#51CF66', 'income', NEW.id),
  ('Makanan', 'UtensilsCrossed', '#FF6B6B', 'expense', NEW.id),
  ('Transport', 'Car', '#FF6B6B', 'expense', NEW.id),
  ('Belanja', 'ShoppingCart', '#FF6B6B', 'expense', NEW.id),
  ('Tagihan', 'FileText', '#FF6B6B', 'expense', NEW.id),
  ('Hiburan', 'Film', '#FF6B6B', 'expense', NEW.id),
  ('Kesehatan', 'Heart', '#FF6B6B', 'expense', NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to seed data when a new user is created
-- Note: This requires permissions on auth.users which might be restricted in some Supabase setups depending on the role.
-- However, usually 'postgres' or service_role can create this. 
-- In the context of Supabase Dashboard SQL Editor, it works.
-- But creating a trigger on auth.users via client migration might fail if not superuser.
-- Let's try to add it. If it fails, we handle seeding in the frontend.

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.seed_default_user_data();
