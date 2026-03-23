using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Task2_BankingSystem.Models;

namespace Task2_BankingSystem.Repositories
{
    public interface IAccountRepository
    {
        Account? GetByAccountNumber(string accountNumber);
        List<Account> GetAll();
        void Add(Account account);
        void Update(Account account);
        void Save();
    }
}
