export type SpendingRowView = {
  categoryId: string | null;
  categoryName: string;
  amountCentavos: number; 
  percentage: number;     
};

export type TransactionView = {
  id: string;
  description: string;
  categoryName: string | null;
  amountCentavos: number; 
  date: Date;
};

export type CategoryOptions = { id: string; categoryName: string };