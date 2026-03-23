using System.Net;

namespace QuickBooksAuth.DTOs;

public class CreateVendorDto
{
    public string DisplayName { get; set; } = "";

    public QbEmailAddr? PrimaryEmailAddr { get; set; }

    public QbPhone? PrimaryPhone { get; set; }

    public QbAddress? BillAddr { get; set; }

    public string? WebAddr { get; set; }
}

public class UpdateVendorDto
{
    public string SyncToken { get; set; } = "";

    public string DisplayName { get; set; } = "";

    public QbEmailAddr? PrimaryEmailAddr { get; set; }

    public QbPhone? PrimaryPhone { get; set; }

    public QbAddress? BillAddr { get; set; }
}


public class DeleteVendorDto
{
    public string SyncToken { get; set; } = "";

    public string DisplayName { get; set; } = "";
}