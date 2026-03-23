using System;
using System.Collections.Generic;
using Task2_BankingSystem.Exceptions;
using Task2_BankingSystem.Helpers;
using Task2_BankingSystem.Models;
using Task2_BankingSystem.Repositories;

namespace Task2_BankingSystem.Services
{
    public class BankService
    {
        private readonly IAccountRepository _repo;
        private readonly decimal _monthlyInterestRate;
        private readonly decimal _minOpeningBalance;

        public BankService(IAccountRepository repo)
        {
            _repo = repo;
            _monthlyInterestRate = BankConfigHelper.InterestRatePercent / 100m;
            _minOpeningBalance = BankConfigHelper.MinOpeningBalance;
        }


        public Account OpenAccount(string holderName, decimal initialDeposit)
        {
            if (string.IsNullOrWhiteSpace(holderName))
                throw new ArgumentNullException(nameof(holderName),
                    "Holder name cannot be empty.");

            if (initialDeposit < _minOpeningBalance)
                throw new ArgumentException(
                    $"Initial deposit must be at least {_minOpeningBalance:N2}.");

            var account = new Account
            {
                AccountNumber = AccountNumberGenerator.Generate(),
                HolderName = holderName.Trim(),
                Balance = 0m,
                CreatedOn = DateTime.Now
            };

            PerformTransaction<decimal>(account, initialDeposit, TransactionType.Deposit,
                "Account opening deposit");

            _repo.Add(account);
            _repo.Save();
            return account;
        }


        public Account Deposit(string accountNumber, decimal amount)
        {
            if (amount <= 0)
                throw new InvalidOperationException("Deposit amount must be greater than zero.");

            Account account = GetExisting(accountNumber);
            PerformTransaction<decimal>(account, amount, TransactionType.Deposit, "Deposit");
            _repo.Update(account);
            _repo.Save();
            return account;
        }


        public Account Withdraw(string accountNumber, decimal amount)
        {
            if (amount <= 0)
                throw new InvalidOperationException("Withdrawal amount must be greater than zero.");

            Account account = GetExisting(accountNumber);

            if (account.Balance < amount)
                throw new InsufficientBalanceException(account.Balance, amount);

            PerformTransaction<decimal>(account, amount, TransactionType.Withdrawal, "Withdrawal");
            _repo.Update(account);
            _repo.Save();
            return account;
        }


        public void ApplyMonthlyInterest(string accountNumber)
        {
            Account account = GetExisting(accountNumber);
            decimal interest = Math.Round(account.Balance * _monthlyInterestRate, 2);

            if (interest > 0)
            {
                PerformTransaction<decimal>(account, interest, TransactionType.InterestCredit,
                    $"Monthly interest @ {BankConfigHelper.InterestRatePercent:0.##}%");
                _repo.Update(account);
                _repo.Save();
            }
        }


        public Account GetAccount(string accountNumber) => GetExisting(accountNumber);

        public List<Account> GetAllAccounts() => _repo.GetAll();


        private static void PerformTransaction<T>(Account account, T amount,
            TransactionType type, string description) where T : struct, IConvertible
        {
            decimal decAmount = Convert.ToDecimal(amount);

            switch (type)
            {
                case TransactionType.Deposit:
                case TransactionType.InterestCredit:
                    account.Balance += decAmount;
                    break;
                case TransactionType.Withdrawal:
                    account.Balance -= decAmount;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(type));
            }

            account.Transactions.Add(new Transaction
            {
                TransactionId = Guid.NewGuid(),
                Date = DateTime.Now,
                Type = type,
                Amount = decAmount,
                BalanceAfter = account.Balance,
                Description = description
            });
        }


        private Account GetExisting(string accountNumber)
        {
            Account? account = _repo.GetByAccountNumber(accountNumber);
            if (account == null)
                throw new ArgumentException($"Account '{accountNumber}' not found.");
            return account;
        }
    }
}