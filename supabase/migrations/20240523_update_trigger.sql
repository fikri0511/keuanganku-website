-- Trigger for Balance Updates on UPDATE
CREATE OR REPLACE FUNCTION public.update_balance_on_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Reverse OLD transaction effect
  IF OLD.type = 'income' THEN
    UPDATE public.wallets SET balance = balance - OLD.amount WHERE id = OLD.wallet_id;
  ELSIF OLD.type = 'expense' THEN
    UPDATE public.wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
  ELSIF OLD.type = 'transfer' THEN
    UPDATE public.wallets SET balance = balance + OLD.amount WHERE id = OLD.wallet_id;
    UPDATE public.wallets SET balance = balance - OLD.amount WHERE id = OLD.destination_wallet_id;
  END IF;

  -- Apply NEW transaction effect
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

DROP TRIGGER IF EXISTS trg_update_balance_update ON public.transactions;
CREATE TRIGGER trg_update_balance_update
AFTER UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_balance_on_update();
