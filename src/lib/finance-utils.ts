import * as LucideIcons from 'lucide-react';

export const getIconComponent = (iconName: string) => {
  // Case-insensitive icon lookup
  const icons = LucideIcons as any;
  const iconKeys = Object.keys(icons);
  
  // Try exact match first
  if (icons[iconName]) {
    return icons[iconName];
  }
  
  // Try case-insensitive match
  const matchedKey = iconKeys.find(
    key => key.toLowerCase() === iconName.toLowerCase()
  );
  
  if (matchedKey && icons[matchedKey]) {
    return icons[matchedKey];
  }
  
  // Return default icon if not found
  return LucideIcons.CircleDot;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInHours < 1) {
    return 'Baru saja';
  } else if (diffInHours < 24) {
    return `${diffInHours} jam yang lalu`;
  } else if (diffInDays === 1) {
    return 'Kemarin';
  } else if (diffInDays < 7) {
    return `${diffInDays} hari yang lalu`;
  } else {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
};

export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

export const formatDateFull = (dateString: string): string => {
  // Parse the date string, assuming it's in ISO format (YYYY-MM-DD or ISO 8601)
  let date: Date;
  
  if (dateString.includes('T')) {
    // If it's an ISO 8601 string, parse it
    date = new Date(dateString);
  } else {
    // If it's just YYYY-MM-DD format, parse it as local date to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  }
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export const formatDateOnly = (date: Date): string => {
  // Format date with time as ISO string with Indonesia timezone offset (UTC+7)
  // This ensures the time is saved correctly with proper timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // Indonesia timezone is UTC+7
  // Format: YYYY-MM-DDTHH:mm:ss+07:00
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
};
