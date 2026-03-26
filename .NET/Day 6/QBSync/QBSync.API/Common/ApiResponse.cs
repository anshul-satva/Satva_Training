using QBSync.Domain.Enums;

namespace QBSync.API.Common;

public class ApiResponse
{
    public ResponseStatus ResponseStatus { get; set; }
    public string Message { get; set; } = string.Empty;
    public dynamic? Result { get; set; }

    public static ApiResponse CreateSuccess(dynamic? result = null, string message = "Success")
    {
        return new ApiResponse
        {
            ResponseStatus = ResponseStatus.Success,
            Message = message,
            Result = result
        };
    }

    public static ApiResponse CreateFailure(string message, dynamic? result = null)
    {
        return new ApiResponse
        {
            ResponseStatus = ResponseStatus.Error,
            Message = message,
            Result = result
        };
    }
}
