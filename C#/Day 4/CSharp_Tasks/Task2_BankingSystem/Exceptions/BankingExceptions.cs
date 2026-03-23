using System;

namespace Task2_BankingSystem.Exceptions
{
    public class InsufficientBalanceException : Exception
    {
        public decimal CurrentBalance { get; }
        public decimal RequestedAmount { get; }

        public InsufficientBalanceException(decimal currentBalance, decimal requestedAmount)
            : base($"Insufficient balance. Current: {currentBalance:N2}, Requested: {requestedAmount:N2}.")
        {
            CurrentBalance = currentBalance;
            RequestedAmount = requestedAmount;
        }

        public InsufficientBalanceException(string message) : base(message) { }
    }
}