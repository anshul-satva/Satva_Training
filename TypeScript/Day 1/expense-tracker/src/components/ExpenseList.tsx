import React from 'react';
import type { ExpenseListProps } from '../types';
import ExpenseItem from './ExpenseItem';

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  if (expenses.length === 0) {
    return <p className="empty-state">No expenses yet. Add one above!</p>;
  }

  return (
    <div className="expense-list">
      {expenses.map((expense) => (
        // key is required by React when rendering a list
        <ExpenseItem key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default ExpenseList;
