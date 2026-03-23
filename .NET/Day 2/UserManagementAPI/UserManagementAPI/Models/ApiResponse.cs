using static UserManagementAPI.Enums;

namespace UserManagementAPI.Models
{
    public class ApiResponse<T>
    {
        public ResponseStatus ResponseStatus { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Result { get; set; }

        public static ApiResponse<T> Ok(string message, T? data = default)
            => new() { ResponseStatus = ResponseStatus.Success, Message = message, Result = data };

        public static ApiResponse<T> Fail(string message)
            => new() { ResponseStatus = ResponseStatus.Error, Message = message, Result = default };
    }
}