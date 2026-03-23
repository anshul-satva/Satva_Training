using System;
using System.Collections.Generic;
using System.Linq;
using Task2_BankingSystem.Helpers;
using Task2_BankingSystem.Models;

namespace Task2_BankingSystem.Repositories
{
    public class XmlAccountRepository : IAccountRepository
    {
        private readonly string _filePath;
        private List<Account> _cache;

        public XmlAccountRepository(string filePath)
        {
            _filePath = filePath;
            _cache    = Load();
        }

        public Account? GetByAccountNumber(string accountNumber) =>
            _cache.FirstOrDefault(a => a.AccountNumber == accountNumber);

        public List<Account> GetAll() => new List<Account>(_cache); 

        public void Add(Account account)
        {
            if (_cache.Any(a => a.AccountNumber == account.AccountNumber))
                throw new InvalidOperationException(
                    $"Account '{account.AccountNumber}' already exists.");
            _cache.Add(account);
        }

        public void Update(Account updated)
        {
            int idx = _cache.FindIndex(a => a.AccountNumber == updated.AccountNumber);
            if (idx == -1)
                throw new InvalidOperationException(
                    $"Account '{updated.AccountNumber}' not found for update.");
            _cache[idx] = updated;
        }

        public void Save()
        {
            var store = new AccountStore { Accounts = _cache };
            XmlHelper.SerializeToXml(store, _filePath);
        }

        private List<Account> Load()
        {
            try
            {
                var store = XmlHelper.DeserializeFromXml<AccountStore>(_filePath);
                return store.Accounts ?? new List<Account>();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"[WARNING] Could not load account data: {ex.Message}");
                Console.ResetColor();
                return new List<Account>();
            }
        }
    }
}
