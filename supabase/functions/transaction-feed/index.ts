import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

export const runtime = 'edge'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase Client
    // We use the ANON key but pass the user's Authorization header
    // This ensures RLS policies are applied (users only see their own data)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const authHeader = req.headers.get('Authorization')

    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    })

    // Fetch data in parallel to minimize latency
    // No N+1 queries here - we fetch all needed rows in 3 requests
    const [
      { data: transactions, error: txError },
      { data: wallets, error: walletsError },
      { data: categories, error: catsError }
    ] = await Promise.all([
      supabase.from('transactions').select('*').order('date', { ascending: false }),
      supabase.from('wallets').select('*'),
      supabase.from('categories').select('*')
    ])

    if (txError) throw txError
    if (walletsError) throw walletsError
    if (catsError) throw catsError

    // Create lookup maps for O(1) access
    // much faster than .find() inside the map loop
    const walletMap = new Map(wallets.map(w => [w.id, w]))
    const categoryMap = new Map(categories.map(c => [c.id, c]))

    // Transform and join data
    const feed = transactions.map(tx => {
      const wallet = walletMap.get(tx.wallet_id)
      const category = categoryMap.get(tx.category_id)
      const destWallet = tx.destination_wallet_id ? walletMap.get(tx.destination_wallet_id) : null

      return {
        transaction_id: tx.id,
        amount: Number(tx.amount), // Ensure number
        note: tx.note,
        date: tx.date,
        created_at: tx.created_at,
        type: tx.type, // income/expense/transfer
        
        // Nested Wallet Object (Source)
        wallet: wallet ? {
          id: wallet.id,
          name: wallet.name,
          icon: wallet.icon
        } : null,

        // Nested Destination Wallet (for transfers)
        destination_wallet: destWallet ? {
          id: destWallet.id,
          name: destWallet.name,
          icon: destWallet.icon
        } : null,

        // Nested Category Object
        category: category ? {
          id: category.id,
          name: category.name,
          icon: category.icon,
          color: category.color // Useful for frontend UI
        } : null
      }
    })

    return new Response(JSON.stringify(feed), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
