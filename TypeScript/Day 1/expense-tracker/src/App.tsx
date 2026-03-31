import React, { useState } from "react";
import type { Expense } from "./types";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Summary from "./components/Summary";
import "./App.css";

const App: React.FC = () => {
  // useState<Expense[]> = state that holds an array of Expense objects
  // It starts as an empty array []
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // addExpense: receives everything EXCEPT the id
  // We generate the id here using crypto . randomUUID()
  const addExpense = (expenseData: Omit<Expense, "id">): void => {
    const newExpense: Expense = {
      ...expenseData, // spread all the fields from the form
      id: crypto.randomUUID(), // generate a unique id
    };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const deleteExpense = (id: string): void => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title">
          <span className="app-kicker">Daily money flow</span>
          <h1>Expense Tracker</h1>
        </div>
        <div className="app-accent" />
      </header>

      <section className="panel summary-panel">
        <div className="summary-row">
          <Summary expenses={expenses} />
          <div className="summary-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              Add Expense
            </button>
          </div>
        </div>
      </section>

      <section className="panel list-panel">
        <div className="panel-header">
          <h2>Recent Expenses</h2>
          <span className="chip">{expenses.length} items</span>
        </div>
        <ExpenseList expenses={expenses} onDelete={deleteExpense} />
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Add Expense</h2>
              </div>
              <button
                className="ghost-button"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
            <ExpenseForm
              onAdd={(data) => {
                addExpense(data);
                setIsModalOpen(false);
              }}
              onAddAndContinue={(data) => {
                addExpense(data);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
