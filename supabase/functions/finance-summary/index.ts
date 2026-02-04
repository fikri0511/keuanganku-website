const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WalletData {
  id: string;
  name: string;
  icon: string;
  balance: number;
  created_at: string;
}

interface CategoryData {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  created_at: string;
}

interface TransactionData {
  id: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  wallet_id: string;
  destination_wallet_id: string | null;
  category_id: string | null;
  note: string | null;
  date: string;
  created_at: string;
  wallet?: {
    name: string;
    icon: string;
  };
  destination_wallet?: {
    name: string;
    icon: string;
  };
  category?: {
    name: string;
    icon: string;
    color: string;
  };
}

interface FinanceSummaryResponse {
  wallets: WalletData[];
  categories: CategoryData[];
  transactions: TransactionData[];
  summary: {
    total_balance: number;
    total_income: number;
    total_expense: number;
    transaction_count: number;
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'apikey': supabaseKey,
    };

    const [walletsRes, categoriesRes, transactionsRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/wallets?select=*&order=created_at.asc`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/categories?select=*&order=created_at.asc`, { headers }),
      fetch(`${supabaseUrl}/rest/v1/transactions?select=id,type,amount,wallet_id,destination_wallet_id,category_id,note,date,created_at,wallet:wallets!transactions_wallet_id_fkey(name,icon),destination_wallet:wallets!transactions_destination_wallet_id_fkey(name,icon),category:categories(name,icon,color)&order=date.desc&limit=1000`, { headers }),
    ]);

    if (!walletsRes.ok || !categoriesRes.ok || !transactionsRes.ok) {
      throw new Error('Failed to fetch data from database');
    }

    const wallets: WalletData[] = await walletsRes.json();
    const categories: CategoryData[] = await categoriesRes.json();
    const transactions: TransactionData[] = await transactionsRes.json();

    const total_balance = wallets.reduce((sum, wallet) => sum + Number(wallet.balance), 0);
    
    const total_income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const total_expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const response: FinanceSummaryResponse = {
      wallets,
      categories,
      transactions,
      summary: {
        total_balance,
        total_income,
        total_expense,
        transaction_count: transactions.length,
      },
    };

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        }, 
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
