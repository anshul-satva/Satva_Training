import React from 'react';
import type { ExpenseItemProps } from '../types';

const ExpenseItem: React.FC<ExpenseItemProps> = ({ expense, onDelete }) => {
  return (
    <div className="expense-item">
      <div className="item-main">
        <span className="item-date">{expense.date}</span>
        <div className="item-title">{expense.title}</div>
        <span className={`item-badge badge-${expense.category}`}>{expense.category}</span>
      </div>
      <div className="item-meta">
        <span className="item-amount">INR {expense.amount.toFixed(2)}</span>
        <button className="ghost-button" onClick={() => onDelete(expense.id)}>Delete</button>
      </div>
    </div>
  );
};

export default ExpenseItem;
