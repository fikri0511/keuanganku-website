-- Create Wallets Table
CREATE TABLE IF NOT EXISTS public.wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    balance NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    amount NUMERIC NOT NULL,
    wallet_id UUID REFERENCES public.wallets(id) ON DELETE CASCADE,
    destination_wallet_id UUID REFERENCES public.wallets(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    note TEXT,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallets;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;

-- Seed Data (only if empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.wallets) THEN
    INSERT INTO public.wallets (name, icon, balance) VALUES
    ('Bank BCA', 'Landmark', 5000000),
    ('Dompet Cash', 'Wallet', 500000),
    ('GoPay', 'Smartphone', 250000);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.categories) THEN
    INSERT INTO public.categories (name, icon, color, type) VALUES
    ('Gaji', 'Briefcase', '#51CF66', 'income'),
    ('Freelance', 'Laptop', '#51CF66', 'income'),
    ('Investasi', 'TrendingUp', '#51CF66', 'income'),
    ('Hadiah', 'Gift', '#51CF66', 'income'),
    ('Makanan', 'UtensilsCrossed', '#FF6B6B', 'expense'),
    ('Transport', 'Car', '#FF6B6B', 'expense'),
    ('Belanja', 'ShoppingCart', '#FF6B6B', 'expense'),
    ('Tagihan', 'FileText', '#FF6B6B', 'expense'),
    ('Hiburan', 'Film', '#FF6B6B', 'expense'),
    ('Kesehatan', 'Heart', '#FF6B6B', 'expense');
  END IF;
END $$;

-- Triggers for Balance Updates
CREATE OR REPLACE FUNCTION public.update_balance_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'income' THEN
    UPDATE public.wallets SET balance = balance + NEW.amount WHERE id = NEW.wallet_id;
  ELSIF NEW.type = 'expense' THEN
    UPDATE public.wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
  ELSIF NEW.type = 'transfer' THEN
    UPDATE public.wallets SET balance = balance - NEW.amount WHERE id = NEW.wallet_id;
    UPDATE public.wallets SET balance = balance + NEW.amount WHERE id = NEW.destination_wallet_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_balance_insert ON public.transactions;
CREATE TRIGGER trg_update_balance_insert
AFTER INSERT ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_balance_on_insert();

CREATE OR REPLACE FUNCTION public.update_balance_on_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.type = 'income' THEN
    UPDATE public.wallets SET balance = balance - OLD.amount WHERE id = OLD.wallet_id;
  ELSIF OLD.type = 'expense' THEN
    UPDATE public.wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
  ELSIF OLD.type = 'transfer' THEN
    UPDATE public.wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
    UPDATE public.wallets SET balance = balance - OLD.amount WHERE id = OLD.destination_wallet_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_balance_delete ON public.transactions;
CREATE TRIGGER trg_update_balance_delete
AFTER DELETE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_balance_on_delete();
