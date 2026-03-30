import React, { useState } from 'react';
import type { ExpenseFormProps, Category, Expense } from '../types';

// All the categories as an array for the dropdown
const CATEGORIES: Category[] = ['food', 'transport', 'utilities', 'entertainment', 'other'];

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd, onAddAndContinue }) => {
  // useState<string> means: this state holds a string
  const [title, setTitle]       = useState<string>('');
  const [amount, setAmount]     = useState<string>('');  // string because input gives string
  const [category, setCategory] = useState<Category>('food');
  const [date, setDate]         = useState<string>('');

  const resetForm = (): void => {
    setTitle('');
    setAmount('');
    setCategory('food');
    setDate('');
  };

  const buildExpense = (): Omit<Expense, 'id'> | null => {
    if (!title || !amount || !date) return null;
    return {
      title,
      amount: parseFloat(amount),
      category,
      date,
    };
  };

  // React.FormEvent<HTMLFormElement> = the event type when a form is submitted
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();  // stop the page from refreshing

    const expense = buildExpense();
    if (!expense) return;

    onAdd(expense);
    resetForm();
  };

  const handleSaveAndContinue = (): void => {
    const expense = buildExpense();
    if (!expense) return;

    if (onAddAndContinue) {
      onAddAndContinue(expense);
    } else {
      onAdd(expense);
    }
    resetForm();
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      {/* React.ChangeEvent<HTMLInputElement> = event when input changes */}
      <label className="field">
        <span>Title</span>
        <input
          type="text"
          placeholder="Coffee with team"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
        />
      </label>
      <label className="field">
        <span>Amount</span>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
        />
      </label>
      {/* React.ChangeEvent<HTMLSelectElement> = event when select changes */}
      <label className="field">
        <span>Category</span>
        <select
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as Category)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Date</span>
        <input
          type="date"
          value={date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
        />
      </label>
      <div className="form-actions">
        <button className="secondary-button" type="button" onClick={handleSaveAndContinue}>
          Save & Continue
        </button>
        <button className="primary-button" type="submit">Save & Cancel</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
