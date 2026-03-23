using System;
using AutoMapper;
using System.Collections.Generic;
using Task2_BankingSystem.Exceptions;
using Task2_BankingSystem.Helpers;
using Task2_BankingSystem.Models;
using Task2_BankingSystem.Repositories;
using Task2_BankingSystem.Services;

namespace Task2_BankingSystem
{
    class Program
    {
        private static BankService _bankService = null!;
        private static IMapper _mapper = null!;

        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            Console.Title = "Configurable Banking System";
            PrintBanner();

            try
            {
                string filePath = BankConfigHelper.AccountFilePath;
                var repo = new XmlAccountRepository(filePath);
                _bankService = new BankService(repo);  
            }
            catch (Exception ex)
            {
                Console.WriteLine("Startup failed: " + ex.Message);
                Console.ReadKey();
                return;
            }

            var config = new MapperConfiguration(cfg => cfg.AddProfile<AccountMappingProfile>());
            _mapper = config.CreateMapper();

            bool running = true;
            while (running)
            {
                PrintMenu();
                string choice = Console.ReadLine()?.Trim() ?? "";
                Console.WriteLine();

                try
                {
                    switch (choice)
                    {
                        case "1": OpenAccountFlow(); break;
                        case "2": DepositFlow(); break;
                        case "3": WithdrawFlow(); break;
                        case "4": ViewAccountFlow(); break;
                        case "5": ListAllAccountsFlow(); break;
                        case "6": ApplyInterestFlow(); break;
                        case "7": running = false; break;
                        default:
                            Console.WriteLine("Invalid option. Please choose 1 to 7.");
                            break;
                    }
                }
                catch (ArgumentNullException ex)
                {
                    Console.WriteLine("ArgumentNullException: " + ex.Message);
                }
                catch (ArgumentException ex)
                {
                    Console.WriteLine("ArgumentException: " + ex.Message);
                }
                catch (InsufficientBalanceException ex)
                {
                    Console.WriteLine("InsufficientBalance: " + ex.Message);
                }
                catch (InvalidOperationException ex)
                {
                    Console.WriteLine("InvalidOperation: " + ex.Message);
                }
                catch (System.IO.FileNotFoundException ex)
                {
                    Console.WriteLine("FileNotFound: " + ex.Message);
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Error: " + ex.Message);
                }

                if (running)
                {
                    Console.WriteLine(new string('-', 60));
                }
            }

            Console.WriteLine("Thank you for using the Banking System. Goodbye!");
        }

        static void OpenAccountFlow()
        {
            Console.WriteLine("\n-- OPEN NEW ACCOUNT --");

            string name;
            while (true)
            {
                name = Prompt("Holder Name");
                if (string.IsNullOrWhiteSpace(name))
                    Console.WriteLine("Holder name cannot be empty. Please re-enter.");
                else break;
            }

            decimal deposit;
            decimal minBalance = BankConfigHelper.MinOpeningBalance;
            while (true)
            {
                string depositStr = Prompt("Initial Deposit (min " + minBalance.ToString("N0") + ")");
                if (!decimal.TryParse(depositStr, out deposit))
                    Console.WriteLine("Deposit must be a valid number. Please re-enter.");
                else if (deposit < minBalance)
                    Console.WriteLine("Initial deposit must be at least " + minBalance.ToString("N0") + ". Please re-enter.");
                else break;
            }

            Account acct = _bankService.OpenAccount(name, deposit);
            Console.WriteLine("Account created successfully!");
            Console.WriteLine("  Account Number : " + acct.AccountNumber);
            Console.WriteLine("  Holder         : " + acct.HolderName);
            Console.WriteLine("  Balance        : " + acct.Balance.ToString("N2"));
        }

        static void DepositFlow()
        {
            Console.WriteLine("\n-- DEPOSIT MONEY --");

            string acctNo;
            while (true)
            {
                acctNo = Prompt("Account Number");
                if (string.IsNullOrWhiteSpace(acctNo))
                    Console.WriteLine("Account number cannot be empty. Please re-enter.");
                else break;
            }

            decimal amount;
            while (true)
            {
                string amountStr = Prompt("Amount to Deposit");
                if (!decimal.TryParse(amountStr, out amount))
                    Console.WriteLine("Amount must be a valid number. Please re-enter.");
                else if (amount <= 0)
                    Console.WriteLine("Deposit amount must be greater than zero. Please re-enter.");
                else break;
            }

            Account acct = _bankService.Deposit(acctNo, amount);
            Console.WriteLine("Deposit successful! New Balance: " + acct.Balance.ToString("N2"));
        }

        static void WithdrawFlow()
        {
            Console.WriteLine("\n-- WITHDRAW MONEY --");

            string acctNo;
            while (true)
            {
                acctNo = Prompt("Account Number");
                if (string.IsNullOrWhiteSpace(acctNo))
                    Console.WriteLine("Account number cannot be empty. Please re-enter.");
                else break;
            }

            decimal amount;
            while (true)
            {
                string amountStr = Prompt("Amount to Withdraw");
                if (!decimal.TryParse(amountStr, out amount))
                    Console.WriteLine("Amount must be a valid number. Please re-enter.");
                else if (amount <= 0)
                    Console.WriteLine("Withdrawal amount must be greater than zero. Please re-enter.");
                else break;
            }

            Account acct = _bankService.Withdraw(acctNo, amount);
            Console.WriteLine("Withdrawal successful! New Balance: " + acct.Balance.ToString("N2"));
        }

        static void ViewAccountFlow()
        {
            Console.WriteLine("\n-- ACCOUNT DETAILS & TRANSACTION HISTORY --");

            string acctNo;
            while (true)
            {
                acctNo = Prompt("Account Number");
                if (string.IsNullOrWhiteSpace(acctNo))
                    Console.WriteLine("Account number cannot be empty. Please re-enter.");
                else break;
            }

            Account acct = _bankService.GetAccount(acctNo);
            PrintAccountDetail(acct);
        }

        static void ListAllAccountsFlow()
        {
            Console.WriteLine("\n-- ALL ACCOUNTS --");
            List<Account> accounts = _bankService.GetAllAccounts();

            if (accounts.Count == 0)
            {
                Console.WriteLine("No accounts found.");
                return;
            }

            foreach (var acct in accounts)
            {
                var dto = _mapper.Map<AccountDto>(acct);
                Console.WriteLine("  " + dto.AccountNumber + "  |  " + dto.HolderName.PadRight(20) + "  |  " + dto.Balance.ToString("N2").PadLeft(12) + "  |  Txns: " + dto.TransactionCount);
            }
        }

        static void ApplyInterestFlow()
        {
            Console.WriteLine("\n-- APPLY MONTHLY INTEREST --");

            string acctNo;
            while (true)
            {
                acctNo = Prompt("Account Number");
                if (string.IsNullOrWhiteSpace(acctNo))
                    Console.WriteLine("Account number cannot be empty. Please re-enter.");
                else break;
            }

            _bankService.ApplyMonthlyInterest(acctNo);
            Account acct = _bankService.GetAccount(acctNo);
            Console.WriteLine("Interest applied! New Balance: " + acct.Balance.ToString("N2"));
        }

        static void PrintBanner()
        {
            Console.WriteLine("--- CONFIGURABLE BANKING SYSTEM ---");
            Console.WriteLine();
        }

        static void PrintMenu()
        {
            Console.WriteLine("-------------------");
            Console.WriteLine("Main Menu");
            Console.WriteLine("-------------------");
            Console.WriteLine("1. Open New Account");
            Console.WriteLine("2. Deposit Money");
            Console.WriteLine("3. Withdraw Money");
            Console.WriteLine("4. View Account & Transactions");
            Console.WriteLine("5. List All Accounts");
            Console.WriteLine("6. Apply Monthly Interest");
            Console.WriteLine("7. Exit");
            Console.Write("\nEnter Choice: ");
        }

        static void PrintAccountDetail(Account acct)
        {
            Console.WriteLine("\n  Account Number : " + acct.AccountNumber);
            Console.WriteLine("  Holder Name    : " + acct.HolderName);
            Console.WriteLine("  Balance        : " + acct.Balance.ToString("N2"));
            Console.WriteLine("  Opened On      : " + acct.CreatedOn.ToString("yyyy-MM-dd HH:mm"));
            Console.WriteLine();

            if (acct.Transactions.Count == 0)
            {
                Console.WriteLine("  No transactions recorded.");
                return;
            }

            Console.WriteLine("  " + "Date".PadRight(22) + "Type".PadRight(18) + "Amount".PadLeft(12) + "Balance After".PadLeft(14) + "  Description");
            Console.WriteLine("  " + new string('-', 80));

            foreach (var t in acct.Transactions)
            {
                Console.WriteLine("  " + t.Date.ToString("yyyy-MM-dd HH:mm:ss").PadRight(22) + t.Type.ToString().PadRight(18) + t.Amount.ToString("N2").PadLeft(12) + t.BalanceAfter.ToString("N2").PadLeft(14) + "  " + t.Description);
            }
        }

        static string Prompt(string label)
        {
            Console.Write("  " + label + ": ");
            return Console.ReadLine()?.Trim() ?? "";
        }
    }
}