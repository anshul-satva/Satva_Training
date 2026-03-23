using AutoMapper;
using System;
using Task2_BankingSystem.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Task2_BankingSystem.Helpers
{
    public class AccountMappingProfile : Profile
    {
        public AccountMappingProfile()
        {
            CreateMap<Account, AccountDto>()
                .ForMember(dest => dest.TransactionCount,
                           opt => opt.MapFrom(src => src.Transactions.Count));
        }
    }

    public class AccountDto
    {
        public string AccountNumber { get; set; } = string.Empty;
        public string HolderName { get; set; } = string.Empty;
        public decimal Balance { get; set; }
        public DateTime CreatedOn { get; set; }
        public int TransactionCount { get; set; }
    }
}