using static StudentAPI.Enums;

namespace StudentAPI.Models
{
    public class ApiResponse<T>
    {
        public ResponseStatus ResponseStatus { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Result { get; set; }

        public static ApiResponse<T> Ok(T? data, string message = "Success")
            => new() { ResponseStatus = ResponseStatus.Success, Message = message, Result = data };

        public static ApiResponse<T> Fail(string message)
            => new() { ResponseStatus = ResponseStatus.Error, Message = message, Result = default };
    }
}