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

export type CreateTransactionResult =
  | { success: true; description: string; amountCentavos: number }
  | {
      success: false;
      message: string;
      errors?: Partial<Record<"description" | "amount" | "type" | "date" | "categoryId", string[]>>;
    };

export type CategoryOption = { id: string; categoryName: string };