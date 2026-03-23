namespace StudentAPI.Middleware
{
    public class RequestLoggingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<RequestLoggingMiddleware> _logger;

        public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var watch = System.Diagnostics.Stopwatch.StartNew();

            _logger.LogInformation(
                "Request: {Method} {Path} | Started: {Time}",
                context.Request.Method,
                context.Request.Path,
                DateTime.Now.ToString("HH:mm:ss")
            );

            await _next(context);

            watch.Stop();

            _logger.LogInformation(
                "Response: {Method} {Path} | Status: {StatusCode} | Time: {ElapsedMs}ms",
                context.Request.Method,
                context.Request.Path,
                context.Response.StatusCode,
                watch.ElapsedMilliseconds
            );
        }
    }
}