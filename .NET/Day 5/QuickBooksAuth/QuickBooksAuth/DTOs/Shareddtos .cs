namespace QuickBooksAuth.DTOs;

public class QbRef
{
    public string value { get; set; } = "";
    public string? name { get; set; }
}

public class QbEmailAddr
{
    public string Address { get; set; } = "";
}

public class QbPhone
{
    public string FreeFormNumber { get; set; } = "";
}

public class QbAddress
{
    public string? Line1 { get; set; }
    public string? Line2 { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? CountrySubDivisionCode { get; set; }
    public string? PostalCode { get; set; }
}

public class DeleteByTokenRequest
{
    public string SyncToken { get; set; } = "";
}