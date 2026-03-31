// types.ts — All TypeScript types for the app

// category of expense is type alias: only these 5 categories are allowed
type Category = "food" | "transport" | "utilities" | "entertainment" | "other";

// Expense is the main data shape
interface Expense {
  id: string;
  title: string;
  amount: number;
  category: Category;
  date: string;
}

// Props interface - What each component expects to receicve as props
interface ExpenseFormProps {
  // omit<Expense, "id"> means all properties of Expense except id, because id is generated in the form component
  onAdd: (expense: Omit<Expense, "id">) => void;
  onAddAndContinue?: (expense: Omit<Expense, "id">) => void;
}

interface ExpenseItemProps {
  expense: Expense;
  onDelete: (id: string) => void;
}

interface ExpenseListProps {
  onDelete: (id: string) => void;
  expenses: Expense[];
}

interface SummaryProps {
  expenses: Expense[];
}

export type {
  Category,
  Expense,
  ExpenseFormProps,
  ExpenseItemProps,
  ExpenseListProps,
  SummaryProps,
};
