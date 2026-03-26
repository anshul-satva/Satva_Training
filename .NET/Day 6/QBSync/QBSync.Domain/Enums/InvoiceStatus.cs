namespace QBSync.Domain.Enums;

public enum InvoiceStatus
{
    Draft,
    Sent,
    Paid,
    Overdue,
    Void
}

public enum ResponseStatus
{
    Error = 0,
    Success = 1,
    Unauthorized = 401,
    NoContent = 204
}
