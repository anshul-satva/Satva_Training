import React from 'react';
import type { SummaryProps } from '../types';

const Summary: React.FC<SummaryProps> = ({ expenses }) => {
  // reduce: start from 0, add each expense's amount
  const total: number = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="summary-card">
      <span className="summary-label">Total Spent :</span>
      <div className="summary-amount">INR {total.toFixed(2)}</div>
    </div>
  );
};

export default Summary;
