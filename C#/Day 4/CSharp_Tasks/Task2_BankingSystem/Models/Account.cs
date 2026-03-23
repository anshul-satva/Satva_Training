using System;
using System.Collections.Generic;
using System.Xml.Serialization;

namespace Task2_BankingSystem.Models
{
    public enum TransactionType
    {
        Deposit,
        Withdrawal,
        InterestCredit
    }

    [XmlRoot("Transaction")]
    public class Transaction
    {
        [XmlElement("TransactionId")]
        public Guid TransactionId { get; set; } = Guid.NewGuid();

        [XmlElement("Date")]
        public DateTime Date { get; set; } = DateTime.Now;

        [XmlElement("Type")]
        public TransactionType Type { get; set; }

        [XmlElement("Amount")]
        public decimal Amount { get; set; }

        [XmlElement("BalanceAfter")]
        public decimal BalanceAfter { get; set; }

        [XmlElement("Description")]
        public string Description { get; set; } = string.Empty;
    }

    [XmlRoot("Account")]
    public class Account
    {
        [XmlElement("AccountNumber")]
        public string AccountNumber { get; set; } = string.Empty;

        [XmlElement("HolderName")]
        public string HolderName { get; set; } = string.Empty;

        [XmlElement("Balance")]
        public decimal Balance { get; set; }

        [XmlElement("CreatedOn")]
        public DateTime CreatedOn { get; set; } = DateTime.Now;

        [XmlArray("Transactions")]
        [XmlArrayItem("Transaction")]
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }

    [XmlRoot("AccountStore")]
    public class AccountStore
    {
        [XmlArray("Accounts")]
        [XmlArrayItem("Account")]
        public List<Account> Accounts { get; set; } = new List<Account>();
    }
}
