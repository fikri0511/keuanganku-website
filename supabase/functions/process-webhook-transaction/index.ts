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
    // 1. Initialize Supabase Admin Client (Bypass RLS)
    // We need service role because n8n might not have a user token
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    
    if (!supabaseServiceKey) {
      throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Parse Body
    const body = await req.json()
    const { 
      user_id, 
      amount, 
      type = 'expense', 
      category: categoryName, 
      wallet: walletName, 
      note, 
      date 
    } = body

    if (!user_id || !amount || !walletName || !categoryName) {
      throw new Error('Missing required fields: user_id, amount, wallet, category')
    }

    // 3. Find Wallet ID (Case Insensitive)
    const { data: wallets, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('id, name')
      .eq('user_id', user_id)
      .ilike('name', walletName)
      .limit(1)

    if (walletError) throw walletError
    if (!wallets || wallets.length === 0) {
      throw new Error(`Wallet not found: ${walletName}`)
    }
    const wallet_id = wallets[0].id

    // 4. Find Category ID (Case Insensitive)
    const { data: categories, error: catError } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .eq('user_id', user_id)
      .ilike('name', categoryName)
      .limit(1)
    
    if (catError) throw catError
    if (!categories || categories.length === 0) {
      throw new Error(`Category not found: ${categoryName}`)
    }
    const category_id = categories[0].id

    // 5. Insert Transaction
    // Note: We don't need to manually update balance because the DB triggers handle it!
    const { data: transaction, error: insertError } = await supabaseAdmin
      .from('transactions')
      .insert({
        user_id,
        amount,
        type,
        category_id,
        wallet_id,
        note,
        date: date || new Date().toISOString()
      })
      .select()
      .single()

    if (insertError) throw insertError

    // 6. Return Success
    return new Response(JSON.stringify({ 
      success: true, 
      transaction,
      message: `Successfully added ${type}: ${amount}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
