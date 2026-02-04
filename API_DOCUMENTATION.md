# KeuanganKu API Documentation

**Base URL:** `https://qhrgpwycpnjtepntjdyn.supabase.co`

**Authentication:** Semua endpoint memerlukan `Authorization: Bearer {token}` header.

---

## 📑 Table of Contents

1. [Authentication](#authentication)
2. [Finance Summary API](#finance-summary-api)
3. [Transactions API](#transactions-api)
   - [Create Transaction (Income/Expense)](#create-transaction)
   - [Update Transaction](#update-transaction)
   - [Delete Transaction](#delete-transaction)
   - [Get Transaction by ID](#get-transaction-by-id)
4. [Transfer API](#transfer-api)
   - [Create Transfer](#create-transfer)
5. [Wallets API](#wallets-api)
   - [Create Wallet](#create-wallet)
   - [Update Wallet](#update-wallet)
   - [Delete Wallet](#delete-wallet)
6. [Categories API](#categories-api)
   - [Create Category](#create-category)
   - [Update Category](#update-category)
   - [Delete Category](#delete-category)
7. [Mobile App Integration Guide](#mobile-app-integration-guide)

---

## 🔐 Authentication

Semua API endpoint memerlukan authentication header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocmdwd3ljcG5qdGVwbnRqZHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNjc4NTEsImV4cCI6MjA1Mjk0Mzg1MX0.jzb1Xzll3wXXeFm0fCnVxLZTCxC8vL1FYhRj6qiH4nI
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocmdwd3ljcG5qdGVwbnRqZHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNjc4NTEsImV4cCI6MjA1Mjk0Mzg1MX0.jzb1Xzll3wXXeFm0fCnVxLZTCxC8vL1FYhRj6qiH4nI
```

---

# 1️⃣ Finance Summary API

**Endpoint untuk mendapatkan semua data keuangan dalam 1 hit request.**

---

## 📍 Endpoint

```
POST https://qhrgpwycpnjtepntjdyn.supabase.co/functions/v1/supabase-functions-finance-summary
```

---

## 🔐 Authentication

API ini memerlukan authentication token. Anda bisa menggunakan:
- **SUPABASE_ANON_KEY** untuk akses public
- **User JWT Token** untuk data spesifik user (jika RLS diaktifkan)

---

## 📤 Request

### Headers

| Key | Value | Required |
|-----|-------|----------|
| Content-Type | application/json | ✅ |
| Authorization | Bearer YOUR_SUPABASE_ANON_KEY | ✅ |

### Body

**Tidak memerlukan body** (empty body atau `{}`).

---

## 📥 Response

### Success Response (200 OK)

```json
{
  "wallets": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Bank BCA",
      "icon": "Landmark",
      "balance": 5000000,
      "created_at": "2024-05-23T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Dompet Cash",
      "icon": "Wallet",
      "balance": 500000,
      "created_at": "2024-05-23T10:00:00.000Z"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "GoPay",
      "icon": "Smartphone",
      "balance": 250000,
      "created_at": "2024-05-23T10:00:00.000Z"
    }
  ],
  "categories": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Gaji",
      "icon": "Briefcase",
      "color": "#51CF66",
      "type": "income",
      "created_at": "2024-05-23T10:00:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Makanan",
      "icon": "UtensilsCrossed",
      "color": "#FF6B6B",
      "type": "expense",
      "created_at": "2024-05-23T10:00:00.000Z"
    }
  ],
  "transactions": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "type": "expense",
      "amount": 50000,
      "wallet_id": "550e8400-e29b-41d4-a716-446655440001",
      "destination_wallet_id": null,
      "category_id": "660e8400-e29b-41d4-a716-446655440001",
      "note": "Makan Siang",
      "date": "2024-05-23T12:30:00.000Z",
      "created_at": "2024-05-23T12:30:00.000Z",
      "wallet": {
        "name": "Dompet Cash",
        "icon": "Wallet"
      },
      "destination_wallet": null,
      "category": {
        "name": "Makanan",
        "icon": "UtensilsCrossed",
        "color": "#FF6B6B"
      }
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "type": "transfer",
      "amount": 100000,
      "wallet_id": "550e8400-e29b-41d4-a716-446655440000",
      "destination_wallet_id": "550e8400-e29b-41d4-a716-446655440002",
      "category_id": null,
      "note": "Top up GoPay",
      "date": "2024-05-23T14:00:00.000Z",
      "created_at": "2024-05-23T14:00:00.000Z",
      "wallet": {
        "name": "Bank BCA",
        "icon": "Landmark"
      },
      "destination_wallet": {
        "name": "GoPay",
        "icon": "Smartphone"
      },
      "category": null
    }
  ],
  "summary": {
    "total_balance": 5750000,
    "total_income": 3000000,
    "total_expense": 1250000,
    "transaction_count": 45
  }
}
```

### Error Responses

#### 401 Unauthorized
```json
{
  "error": "Missing authorization header"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Failed to fetch data from database"
}
```

---

## 📊 Response Schema

### Wallets Array
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique wallet identifier |
| name | string | Wallet name |
| icon | string | Lucide icon name |
| balance | number | Current balance (Rupiah) |
| created_at | timestamp | Creation timestamp |

### Categories Array
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique category identifier |
| name | string | Category name |
| icon | string | Lucide icon name |
| color | string | Hex color code |
| type | enum | "income" or "expense" |
| created_at | timestamp | Creation timestamp |

### Transactions Array
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Unique transaction identifier |
| type | enum | "income", "expense", or "transfer" |
| amount | number | Transaction amount (Rupiah) |
| wallet_id | UUID | Source wallet ID |
| destination_wallet_id | UUID or null | Destination wallet (for transfers) |
| category_id | UUID or null | Category ID (null for transfers) |
| note | string or null | Transaction note |
| date | timestamp | Transaction date |
| created_at | timestamp | Creation timestamp |
| wallet | object | Wallet details (name, icon) |
| destination_wallet | object or null | Destination wallet details |
| category | object or null | Category details (name, icon, color) |

### Summary Object
| Field | Type | Description |
|-------|------|-------------|
| total_balance | number | Sum of all wallet balances |
| total_income | number | Sum of all income transactions |
| total_expense | number | Sum of all expense transactions |
| transaction_count | number | Total number of transactions |

---

## 🧪 Testing di Postman

### Step 1: Create New Request
1. Buka Postman
2. Klik **New** → **HTTP Request**
3. Set method ke **POST**

### Step 2: Configure Request

**URL:**
```
https://qhrgpwycpnjtepntjdyn.supabase.co/functions/v1/supabase-functions-finance-summary
```

**Headers:**
| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocmdwd3ljcG5qdGVwbnRqZHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNjc4NTEsImV4cCI6MjA1Mjk0Mzg1MX0.jzb1Xzll3wXXeFm0fCnVxLZTCxC8vL1FYhRj6qiH4nI |

**Body:**
- Select **raw**
- Choose **JSON** format
- Leave empty or use `{}`

### Step 3: Send Request
Klik **Send** dan lihat response di bagian bawah.

### Step 4: Save Request (Optional)
Klik **Save** untuk menyimpan request ke collection agar mudah digunakan lagi.

---

## 💡 Use Cases

### 1. Dashboard Screen
Gunakan `summary` untuk menampilkan total saldo, pemasukan, dan pengeluaran.
Gunakan `transactions` untuk menampilkan recent transactions.

### 2. Detail Screen
Gunakan `wallets` untuk menampilkan daftar wallet dengan saldo masing-masing.
Filter `transactions` berdasarkan `wallet_id` untuk menampilkan riwayat per wallet.

### 3. Transfer Screen
Gunakan `wallets` untuk menampilkan pilihan source dan destination wallet.

### 4. Reports Screen
Gunakan `transactions` dengan `categories` untuk membuat grafik/laporan berdasarkan kategori dan tanggal.

---

## ⚡ Performance Notes

- API ini menggunakan **parallel fetching** (Promise.all) untuk mengambil data wallets, categories, dan transactions secara bersamaan.
- Response time target: **< 500ms**
- Limit transactions: **1000 transaksi terakhir** (bisa disesuaikan)
- Cache-Control: **no-cache** (selalu fetch data terbaru)

---

## 🔗 Integration Example (Frontend)

```typescript
// Using Supabase Client
const { data, error } = await supabase.functions.invoke('supabase-functions-finance-summary');

if (error) {
  console.error('Error:', error);
} else {
  console.log('Wallets:', data.wallets);
  console.log('Categories:', data.categories);
  console.log('Transactions:', data.transactions);
  console.log('Summary:', data.summary);
}
```

```typescript
// Using Fetch API
const response = await fetch(
  'https://qhrgpwycpnjtepntjdyn.supabase.co/functions/v1/supabase-functions-finance-summary',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
    },
  }
);

const data = await response.json();
```

---

## 📝 Notes

- API ini sudah di-deploy dan siap digunakan
- Tidak ada rate limiting saat ini
- Untuk filtering lanjutan (tanggal range, kategori tertentu), bisa ditambahkan query parameters di versi berikutnya
- Transactions diurutkan berdasarkan tanggal terbaru terlebih dahulu (DESC)

---
---

# 2️⃣ Transactions API

## Create Transaction

### 📍 Endpoint (Income / Expense)

```
POST https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions
```

### 📤 Request Headers

| Key | Value | Required |
|-----|-------|----------|
| Content-Type | application/json | ✅ |
| Authorization | Bearer {ANON_KEY} | ✅ |
| apikey | {ANON_KEY} | ✅ |
| Prefer | return=representation | ✅ |

### 📤 Request Body (Income)

```json
{
  "type": "income",
  "amount": 5000000,
  "wallet_id": "550e8400-e29b-41d4-a716-446655440000",
  "category_id": "660e8400-e29b-41d4-a716-446655440000",
  "note": "Gaji Bulan Januari",
  "date": "2024-05-23T10:00:00.000Z"
}
```

### 📤 Request Body (Expense)

```json
{
  "type": "expense",
  "amount": 50000,
  "wallet_id": "550e8400-e29b-41d4-a716-446655440001",
  "category_id": "660e8400-e29b-41d4-a716-446655440001",
  "note": "Makan Siang",
  "date": "2024-05-23T12:30:00.000Z"
}
```

### 📥 Response (201 Created)

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440003",
    "type": "income",
    "amount": 5000000,
    "wallet_id": "550e8400-e29b-41d4-a716-446655440000",
    "destination_wallet_id": null,
    "category_id": "660e8400-e29b-41d4-a716-446655440000",
    "note": "Gaji Bulan Januari",
    "date": "2024-05-23T10:00:00.000Z",
    "created_at": "2024-05-23T10:00:05.000Z"
  }
]
```

### ⚠️ Validation Rules

- `type`: Required, must be "income" or "expense"
- `amount`: Required, must be > 0
- `wallet_id`: Required, must be valid UUID
- `category_id`: Required, must be valid UUID
- `note`: Optional, string
- `date`: Optional, defaults to current timestamp
- `destination_wallet_id`: Must be null (for income/expense)

### 💻 Integration Example (Mobile App)

```typescript
// Create Income Transaction
async function createIncome(data: {
  amount: number;
  walletId: string;
  categoryId: string;
  note?: string;
  date?: string;
}) {
  const response = await fetch(
    'https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        type: 'income',
        amount: data.amount,
        wallet_id: data.walletId,
        category_id: data.categoryId,
        note: data.note || null,
        date: data.date || new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return await response.json();
}

// Create Expense Transaction
async function createExpense(data: {
  amount: number;
  walletId: string;
  categoryId: string;
  note?: string;
  date?: string;
}) {
  const response = await fetch(
    'https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        type: 'expense',
        amount: data.amount,
        wallet_id: data.walletId,
        category_id: data.categoryId,
        note: data.note || null,
        date: data.date || new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create transaction');
  }

  return await response.json();
}
```

---

## Update Transaction

### 📍 Endpoint

```
PATCH https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions?id=eq.{transaction_id}
```

### 📤 Request Headers

| Key | Value | Required |
|-----|-------|----------|
| Content-Type | application/json | ✅ |
| Authorization | Bearer {ANON_KEY} | ✅ |
| apikey | {ANON_KEY} | ✅ |
| Prefer | return=representation | ✅ |

### 📤 Request Body

```json
{
  "amount": 75000,
  "note": "Makan Siang + Kopi",
  "category_id": "660e8400-e29b-41d4-a716-446655440001"
}
```

### 📥 Response (200 OK)

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "type": "expense",
    "amount": 75000,
    "wallet_id": "550e8400-e29b-41d4-a716-446655440001",
    "destination_wallet_id": null,
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "note": "Makan Siang + Kopi",
    "date": "2024-05-23T12:30:00.000Z",
    "created_at": "2024-05-23T12:30:00.000Z"
  }
]
```

### 💻 Integration Example

```typescript
async function updateTransaction(transactionId: string, updates: {
  amount?: number;
  categoryId?: string;
  note?: string;
  date?: string;
}) {
  const body: any = {};
  if (updates.amount !== undefined) body.amount = updates.amount;
  if (updates.categoryId !== undefined) body.category_id = updates.categoryId;
  if (updates.note !== undefined) body.note = updates.note;
  if (updates.date !== undefined) body.date = updates.date;

  const response = await fetch(
    `https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions?id=eq.${transactionId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update transaction');
  }

  return await response.json();
}
```

---

## Delete Transaction

### 📍 Endpoint

```
DELETE https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions?id=eq.{transaction_id}
```

### 📤 Request Headers

| Key | Value | Required |
|-----|-------|----------|
| Authorization | Bearer {ANON_KEY} | ✅ |
| apikey | {ANON_KEY} | ✅ |

### 📥 Response (204 No Content)

No response body.

### 💻 Integration Example

```typescript
async function deleteTransaction(transactionId: string) {
  const response = await fetch(
    `https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions?id=eq.${transactionId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete transaction');
  }

  return true;
}
```

---

## Get Transaction by ID

### 📍 Endpoint

```
GET https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions?id=eq.{transaction_id}&select=*,wallet:wallets!transactions_wallet_id_fkey(name,icon),destination_wallet:wallets!transactions_destination_wallet_id_fkey(name,icon),category:categories(name,icon,color)
```

### 📤 Request Headers

| Key | Value | Required |
|-----|-------|----------|
| Authorization | Bearer {ANON_KEY} | ✅ |
| apikey | {ANON_KEY} | ✅ |

### 📥 Response (200 OK)

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "type": "expense",
    "amount": 50000,
    "wallet_id": "550e8400-e29b-41d4-a716-446655440001",
    "destination_wallet_id": null,
    "category_id": "660e8400-e29b-41d4-a716-446655440001",
    "note": "Makan Siang",
    "date": "2024-05-23T12:30:00.000Z",
    "created_at": "2024-05-23T12:30:00.000Z",
    "wallet": {
      "name": "Dompet Cash",
      "icon": "Wallet"
    },
    "destination_wallet": null,
    "category": {
      "name": "Makanan",
      "icon": "UtensilsCrossed",
      "color": "#FF6B6B"
    }
  }
]
```

---
---

# 3️⃣ Transfer API

## Create Transfer

**Transfer uang antar wallet dengan validasi balance otomatis.**

### 📍 Endpoint

```
POST https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions
```

### 📤 Request Headers

| Key | Value | Required |
|-----|-------|----------|
| Content-Type | application/json | ✅ |
| Authorization | Bearer {ANON_KEY} | ✅ |
| apikey | {ANON_KEY} | ✅ |
| Prefer | return=representation | ✅ |

### 📤 Request Body

```json
{
  "type": "transfer",
  "amount": 100000,
  "wallet_id": "550e8400-e29b-41d4-a716-446655440000",
  "destination_wallet_id": "550e8400-e29b-41d4-a716-446655440002",
  "note": "Top up GoPay",
  "date": "2024-05-23T14:00:00.000Z"
}
```

### 📥 Response (201 Created)

```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440004",
    "type": "transfer",
    "amount": 100000,
    "wallet_id": "550e8400-e29b-41d4-a716-446655440000",
    "destination_wallet_id": "550e8400-e29b-41d4-a716-446655440002",
    "category_id": null,
    "note": "Top up GoPay",
    "date": "2024-05-23T14:00:00.000Z",
    "created_at": "2024-05-23T14:00:05.000Z"
  }
]
```

### ⚠️ Validation Rules

- `type`: Must be "transfer"
- `amount`: Required, must be > 0
- `wallet_id`: Required (source wallet), must be valid UUID
- `destination_wallet_id`: Required (destination wallet), must be valid UUID
- `wallet_id` and `destination_wallet_id` must be different
- Source wallet balance must be >= amount (validated by database trigger)
- `category_id`: Must be null (transfers don't have categories)
- `note`: Optional, string
- `date`: Optional, defaults to current timestamp

### ⚠️ Error Response (Insufficient Balance)

```json
{
  "code": "P0001",
  "message": "Insufficient balance in source wallet"
}
```

### 💻 Integration Example

```typescript
async function createTransfer(data: {
  amount: number;
  sourceWalletId: string;
  destinationWalletId: string;
  note?: string;
  date?: string;
}) {
  // Validate different wallets
  if (data.sourceWalletId === data.destinationWalletId) {
    throw new Error('Source and destination wallets must be different');
  }

  const response = await fetch(
    'https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/transactions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        type: 'transfer',
        amount: data.amount,
        wallet_id: data.sourceWalletId,
        destination_wallet_id: data.destinationWalletId,
        category_id: null,
        note: data.note || null,
        date: data.date || new Date().toISOString(),
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    if (error.code === 'P0001') {
      throw new Error('Saldo tidak cukup');
    }
    throw new Error('Failed to create transfer');
  }

  return await response.json();
}
```

### 🔄 How Transfer Works

1. User memasukkan amount dan memilih source & destination wallet
2. API menerima request dengan `type: "transfer"`
3. Database trigger `handle_transaction_balance_update` otomatis:
   - Mengurangi balance di source wallet
   - Menambah balance di destination wallet
   - Validasi balance mencukupi
4. Jika balance tidak cukup, trigger akan throw error
5. Transaction tersimpan dengan relasi ke kedua wallet

---
---

# 4️⃣ Wallets API

## Create Wallet

### 📍 Endpoint

```
POST https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/wallets
```

### 📤 Request Headers

| Key | Value | Required |
|-----|-------|----------|
| Content-Type | application/json | ✅ |
| Authorization | Bearer {ANON_KEY} | ✅ |
| apikey | {ANON_KEY} | ✅ |
| Prefer | return=representation | ✅ |

### 📤 Request Body

```json
{
  "name": "Bank BRI",
  "icon": "Landmark",
  "balance": 2000000
}
```

### 📥 Response (201 Created)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Bank BRI",
    "icon": "Landmark",
    "balance": 2000000,
    "created_at": "2024-05-23T15:00:00.000Z"
  }
]
```

### 💻 Integration Example

```typescript
async function createWallet(data: {
  name: string;
  icon: string;
  balance?: number;
}) {
  const response = await fetch(
    'https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/wallets',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({
        name: data.name,
        icon: data.icon,
        balance: data.balance || 0,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create wallet');
  }

  return await response.json();
}
```

---

## Update Wallet

### 📍 Endpoint

```
PATCH https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/wallets?id=eq.{wallet_id}
```

### 📤 Request Body

```json
{
  "name": "Bank BRI Syariah",
  "icon": "Building"
}
```

### 📥 Response (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Bank BRI Syariah",
    "icon": "Building",
    "balance": 2000000,
    "created_at": "2024-05-23T15:00:00.000Z"
  }
]
```

### 💻 Integration Example

```typescript
async function updateWallet(walletId: string, updates: {
  name?: string;
  icon?: string;
}) {
  const body: any = {};
  if (updates.name !== undefined) body.name = updates.name;
  if (updates.icon !== undefined) body.icon = updates.icon;

  const response = await fetch(
    `https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/wallets?id=eq.${walletId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update wallet');
  }

  return await response.json();
}
```

---

## Delete Wallet

### 📍 Endpoint

```
DELETE https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/wallets?id=eq.{wallet_id}
```

### ⚠️ Important Notes

- Wallet yang masih memiliki transactions tidak bisa dihapus (foreign key constraint)
- Sebaiknya soft-delete atau archive wallet yang sudah ada transactions

### 💻 Integration Example

```typescript
async function deleteWallet(walletId: string) {
  const response = await fetch(
    `https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/wallets?id=eq.${walletId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    if (error.code === '23503') {
      throw new Error('Wallet masih memiliki transaksi. Hapus transaksi terlebih dahulu.');
    }
    throw new Error('Failed to delete wallet');
  }

  return true;
}
```

---
---

# 5️⃣ Categories API

## Create Category

### 📍 Endpoint

```
POST https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/categories
```

### 📤 Request Body

```json
{
  "name": "Transport",
  "icon": "Car",
  "color": "#3B82F6",
  "type": "expense"
}
```

### 📥 Response (201 Created)

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "name": "Transport",
    "icon": "Car",
    "color": "#3B82F6",
    "type": "expense",
    "created_at": "2024-05-23T16:00:00.000Z"
  }
]
```

### 💻 Integration Example

```typescript
async function createCategory(data: {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}) {
  const response = await fetch(
    'https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/categories',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create category');
  }

  return await response.json();
}
```

---

## Update Category

### 📍 Endpoint

```
PATCH https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/categories?id=eq.{category_id}
```

### 📤 Request Body

```json
{
  "name": "Transportasi",
  "color": "#0EA5E9"
}
```

### 💻 Integration Example

```typescript
async function updateCategory(categoryId: string, updates: {
  name?: string;
  icon?: string;
  color?: string;
}) {
  const body: any = {};
  if (updates.name !== undefined) body.name = updates.name;
  if (updates.icon !== undefined) body.icon = updates.icon;
  if (updates.color !== undefined) body.color = updates.color;

  const response = await fetch(
    `https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/categories?id=eq.${categoryId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY',
        'apikey': 'YOUR_ANON_KEY',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update category');
  }

  return await response.json();
}
```

---

## Delete Category

### 📍 Endpoint

```
DELETE https://qhrgpwycpnjtepntjdyn.supabase.co/rest/v1/categories?id=eq.{category_id}
```

### ⚠️ Important Notes

- Category yang masih digunakan di transactions tidak bisa dihapus (foreign key constraint)

---
---

# 6️⃣ Mobile App Integration Guide

## Setup Supabase Client

### React Native / Expo

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qhrgpwycpnjtepntjdyn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFocmdwd3ljcG5qdGVwbnRqZHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNjc4NTEsImV4cCI6MjA1Mjk0Mzg1MX0.jzb1Xzll3wXXeFm0fCnVxLZTCxC8vL1FYhRj6qiH4nI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Complete Transaction Flow Examples

### 1. Load All Data (Dashboard Screen)

```typescript
async function loadDashboard() {
  try {
    const { data, error } = await supabase.functions.invoke('supabase-functions-finance-summary');
    
    if (error) throw error;
    
    // Data siap digunakan
    const { wallets, categories, transactions, summary } = data;
    
    // Update state/store
    setWallets(wallets);
    setCategories(categories);
    setRecentTransactions(transactions.slice(0, 5));
    setTotalBalance(summary.total_balance);
    setTotalIncome(summary.total_income);
    setTotalExpense(summary.total_expense);
    
    return data;
  } catch (error) {
    console.error('Error loading dashboard:', error);
    throw error;
  }
}
```

---

### 2. Add Income Transaction

```typescript
async function addIncome(data: {
  amount: number;
  walletId: string;
  categoryId: string;
  note?: string;
}) {
  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        type: 'income',
        amount: data.amount,
        wallet_id: data.walletId,
        category_id: data.categoryId,
        note: data.note || null,
        date: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Reload dashboard untuk update balance
    await loadDashboard();
    
    return transaction;
  } catch (error) {
    console.error('Error adding income:', error);
    throw error;
  }
}
```

---

### 3. Add Expense Transaction

```typescript
async function addExpense(data: {
  amount: number;
  walletId: string;
  categoryId: string;
  note?: string;
}) {
  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        type: 'expense',
        amount: data.amount,
        wallet_id: data.walletId,
        category_id: data.categoryId,
        note: data.note || null,
        date: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Reload dashboard untuk update balance
    await loadDashboard();
    
    return transaction;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
}
```

---

### 4. Transfer Between Wallets

```typescript
async function transferMoney(data: {
  amount: number;
  sourceWalletId: string;
  destinationWalletId: string;
  note?: string;
}) {
  try {
    // Validasi wallet berbeda
    if (data.sourceWalletId === data.destinationWalletId) {
      throw new Error('Source dan destination wallet harus berbeda');
    }
    
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        type: 'transfer',
        amount: data.amount,
        wallet_id: data.sourceWalletId,
        destination_wallet_id: data.destinationWalletId,
        category_id: null,
        note: data.note || null,
        date: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) {
      if (error.code === 'P0001') {
        throw new Error('Saldo tidak cukup');
      }
      throw error;
    }
    
    // Reload dashboard untuk update balance
    await loadDashboard();
    
    return transaction;
  } catch (error) {
    console.error('Error transferring money:', error);
    throw error;
  }
}
```

---

### 5. Edit Transaction

```typescript
async function editTransaction(transactionId: string, updates: {
  amount?: number;
  categoryId?: string;
  note?: string;
}) {
  try {
    const updateData: any = {};
    if (updates.amount !== undefined) updateData.amount = updates.amount;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.note !== undefined) updateData.note = updates.note;
    
    const { data: transaction, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Reload dashboard untuk update balance
    await loadDashboard();
    
    return transaction;
  } catch (error) {
    console.error('Error editing transaction:', error);
    throw error;
  }
}
```

---

### 6. Delete Transaction

```typescript
async function deleteTransaction(transactionId: string) {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
    
    if (error) throw error;
    
    // Reload dashboard untuk update balance
    await loadDashboard();
    
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}
```

---

### 7. Add New Wallet

```typescript
async function addWallet(data: {
  name: string;
  icon: string;
  balance?: number;
}) {
  try {
    const { data: wallet, error } = await supabase
      .from('wallets')
      .insert({
        name: data.name,
        icon: data.icon,
        balance: data.balance || 0,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Reload dashboard
    await loadDashboard();
    
    return wallet;
  } catch (error) {
    console.error('Error adding wallet:', error);
    throw error;
  }
}
```

---

### 8. Add New Category

```typescript
async function addCategory(data: {
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
}) {
  try {
    const { data: category, error } = await supabase
      .from('categories')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    
    // Reload dashboard
    await loadDashboard();
    
    return category;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
}
```

---

### 9. Reset All Data (Settings)

```typescript
async function resetAllData() {
  try {
    // Hapus semua transactions
    const { error: transError } = await supabase
      .from('transactions')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (transError) throw transError;
    
    // Reset balance semua wallets ke 0
    const { error: walletError } = await supabase
      .from('wallets')
      .update({ balance: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all
    
    if (walletError) throw walletError;
    
    // Reload dashboard
    await loadDashboard();
    
    return true;
  } catch (error) {
    console.error('Error resetting data:', error);
    throw error;
  }
}
```

---

## Error Handling Pattern

```typescript
function handleApiError(error: any) {
  if (error.code === 'P0001') {
    return 'Saldo tidak cukup';
  }
  
  if (error.code === '23503') {
    return 'Data masih digunakan dan tidak bisa dihapus';
  }
  
  if (error.code === '23505') {
    return 'Data sudah ada (duplicate)';
  }
  
  if (error.code === 'PGRST116') {
    return 'Data tidak ditemukan';
  }
  
  return error.message || 'Terjadi kesalahan';
}

// Usage
try {
  await addExpense({ ... });
} catch (error) {
  const errorMessage = handleApiError(error);
  Alert.alert('Error', errorMessage);
}
```

---

## 📱 Mobile App Architecture Recommendation

### State Management Structure

```typescript
// types.ts
export interface Wallet {
  id: string;
  name: string;
  icon: string;
  balance: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense';
  created_at: string;
}

export interface Transaction {
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

export interface FinanceSummary {
  total_balance: number;
  total_income: number;
  total_expense: number;
  transaction_count: number;
}

// store.ts (using Zustand / Context)
interface FinanceStore {
  wallets: Wallet[];
  categories: Category[];
  transactions: Transaction[];
  summary: FinanceSummary | null;
  isLoading: boolean;
  error: string | null;
  
  loadData: () => Promise<void>;
  addIncome: (data: any) => Promise<void>;
  addExpense: (data: any) => Promise<void>;
  transferMoney: (data: any) => Promise<void>;
  editTransaction: (id: string, data: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addWallet: (data: any) => Promise<void>;
  addCategory: (data: any) => Promise<void>;
  resetData: () => Promise<void>;
}
```

---

## 🔄 Real-time Subscriptions (Optional)

Untuk fitur real-time (jika dibutuhkan di masa depan):

```typescript
// Subscribe to transaction changes
const transactionSubscription = supabase
  .channel('transactions')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'transactions' 
    }, 
    (payload) => {
      console.log('Transaction changed:', payload);
      // Reload data
      loadDashboard();
    }
  )
  .subscribe();

// Unsubscribe when component unmounts
// transactionSubscription.unsubscribe();
```

---

## 📊 Performance Tips

1. **Cache Finance Summary**: Cache hasil `finance-summary` API di local storage untuk offline mode
2. **Optimistic Updates**: Update UI dulu, baru sync ke server
3. **Batch Operations**: Jika ada multiple operations, gunakan batch/bulk insert
4. **Pagination**: Untuk transaction history, load per page (50-100 items)
5. **Image Optimization**: Icon store di app, bukan di backend

---

## 🔒 Security Notes

1. **RLS (Row Level Security)**: Jika menggunakan multi-user, aktifkan RLS di Supabase
2. **API Key**: Simpan di environment variables, jangan hardcode
3. **Validation**: Selalu validasi input di frontend sebelum hit API
4. **Error Messages**: Jangan expose technical error ke user

---

## ✅ API Testing Checklist

- [ ] Finance Summary API berhasil load semua data
- [ ] Create income transaction dan balance bertambah
- [ ] Create expense transaction dan balance berkurang
- [ ] Transfer berhasil dan kedua wallet balance ter-update
- [ ] Edit transaction update balance dengan benar
- [ ] Delete transaction restore balance
- [ ] Add wallet muncul di list
- [ ] Add category muncul di list
- [ ] Reset data menghapus semua transaksi
- [ ] Error handling untuk insufficient balance
- [ ] Error handling untuk invalid input
