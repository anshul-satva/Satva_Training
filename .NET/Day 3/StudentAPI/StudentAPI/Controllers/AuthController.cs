using Microsoft.AspNetCore.Mvc;
using StudentAPI.Models;
using StudentAPI.Services;

namespace StudentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }
       

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var token = _authService.GenerateToken(request);

            if (token == null)
                return Unauthorized(new { Success = false, Message = "Invalid username or password" });

            return Ok(ApiResponse<object>.Ok(new { Success = true, Token = token }));
        }
    }
}