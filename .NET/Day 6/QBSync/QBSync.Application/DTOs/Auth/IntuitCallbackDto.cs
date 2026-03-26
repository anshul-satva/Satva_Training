namespace QBSync.Application.DTOs.Auth;

// Used for Intuit SSO callback
public class IntuitSsoCallbackDto
{
    public string Code { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string? RealmId { get; set; }
}