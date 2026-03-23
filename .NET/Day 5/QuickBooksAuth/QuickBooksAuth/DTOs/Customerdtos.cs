using System.Net;

namespace QuickBooksAuth.DTOs;

public class CreateCustomerDto
{
    public string DisplayName { get; set; } = "";

    public QbEmailAddr? PrimaryEmailAddr { get; set; }

    public QbPhone? PrimaryPhone { get; set; }

    public QbPhone? Mobile { get; set; }

    public QbAddress? BillAddr { get; set; }

    public QbAddress? ShipAddr { get; set; }
}

public class UpdateCustomerDto
{
    public string SyncToken { get; set; } = "";

    public string DisplayName { get; set; } = "";

    public QbEmailAddr? PrimaryEmailAddr { get; set; }

    public QbPhone? PrimaryPhone { get; set; }

    public QbAddress? BillAddr { get; set; }
}

public class DeleteCustomerDto
{
    public string SyncToken { get; set; } = "";

    public string DisplayName { get; set; } = "";
}