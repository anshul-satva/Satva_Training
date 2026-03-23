using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UserManagementAPI.Helpers;
using UserManagementAPI.Models;
using UserManagementAPI.Services;

namespace UserManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly JwtHelper _jwtHelper;

        public UserController(UserService userService, JwtHelper jwtHelper)
        {
            _userService = userService;
            _jwtHelper = jwtHelper;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            var created = _userService.CreateUser(user);
            return Ok(ApiResponse<object>.Ok("User registered successfully.",
                new { userId = created.Id, emailID = created.EmailID, role = created.Role }));
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var user = _userService.GetUserByEmail(request.EmailID);
            if (user == null || !_userService.VerifyPassword(request.Password, user.Password))
                throw new UnauthorizedAccessException("Invalid email or password.");

            var token = _jwtHelper.GenerateToken(user);
            return Ok(ApiResponse<object>.Ok("Login successful.",
                new { token, role = user.Role, name = user.Name }));
        }

        [HttpGet]
        [Authorize]
        public IActionResult GetAllUsers()
        {
            var users = _userService.GetAllUsers();
            return Ok(ApiResponse<List<UserDTO>>.Ok($"{users.Count} users found.", users));
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetUserById(string id)
        {
            var user = _userService.GetUserById(id);
            return Ok(ApiResponse<UserDTO>.Ok("User found.", user));
        }

        [HttpPut("{id}")]
        [Authorize]
        public IActionResult UpdateUser(string id, [FromBody] User user)
        {
            var updated = _userService.UpdateUser(id, user);
            return Ok(ApiResponse<UserDTO>.Ok("User updated successfully.", updated));
        }

        // ✅ PATCH uses UserPatch — no Required fields
        [HttpPatch("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult PatchUser(string id, [FromBody] UserPatch patchData)
        {
            var updated = _userService.PatchUser(id, patchData);
            return Ok(ApiResponse<UserDTO>.Ok("User partially updated.", updated));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult DeleteUser(string id)
        {
            _userService.DeleteUser(id);
            return Ok(ApiResponse<object>.Ok("User deleted successfully."));
        }
    }
}