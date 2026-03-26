using AutoMapper;
using QBSync.Application.DTOs.Invoice;
using QBSync.Domain.Entities;

namespace QBSync.Application.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Invoice, InvoiceResponseDto>();
        CreateMap<InvoiceLineItem, InvoiceLineItemResponseDto>();
    }
}