
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  createdBy: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface PersonalData {
  fullName: string;
  whatsapp: string;
  email: string;
  address: string;        // Tambahan Alamat
  mountain: string;
  packageCategory: string; 
  tripPackage: string;      
  startDate: string;
  climberCode?: string;      // Khusus Merbabu
  identityImage?: string;    // Base64 string
}

export interface Registration extends PersonalData {
  id: number;
  status: string;
  timestamp?: string;
  synced?: boolean;
}

export interface AdminSettings {
  googleScriptUrl: string;
  spreadsheetId: string;
  adminPhone?: string;
  adminEmail?: string;
}
