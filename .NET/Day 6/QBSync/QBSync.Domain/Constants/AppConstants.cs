namespace QBSync.Domain.Constants;

public static class AppConstants
{
    public static class Collections
    {
        public const string Users = "users";
        public const string Companies = "companies";
        public const string QBTokens = "qb_tokens";
    }

    public static class QBScopes
    {
        public const string Accounting = "com.intuit.quickbooks.accounting";
        public const string OpenId = "openid";
        public const string Profile = "profile";
        public const string Email = "email";
    }

    public static class QBEndpoints
    {
        public const string AuthorizeUrl = "https://appcenter.intuit.com/connect/oauth2";
        public const string TokenUrl = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer";
        public const string RevokeUrl = "https://developer.api.intuit.com/v2/oauth2/tokens/revoke";
        public const string SandboxBaseUrl = "https://sandbox-quickbooks.api.intuit.com/v3/company";
        public const string ProductionBaseUrl = "https://quickbooks.api.intuit.com/v3/company";

        public const string UserInfoUrl = "https://sandbox-accounts.platform.intuit.com/v1/openid_connect/userinfo";
    }
}