using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentAPI.Filters;
using StudentAPI.Models;
using StudentAPI.Services;

namespace StudentAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]   
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _efService;
        private readonly StudentAdoService _adoService;

        public StudentController(IStudentService efService, StudentAdoService adoService)
        {
            _efService = efService;
            _adoService = adoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var students = await _efService.GetAllAsync();
            return Ok(ApiResponse<List<Student>>.Ok(students));
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)   
        {
            var student = await _efService.GetByIdAsync(id);
            if (student == null)
                return NotFound(ApiResponse<Student>.Fail($"Student with ID {id} not found"));

            return Ok(ApiResponse<Student>.Ok(student));
        }

        [HttpPost]
        [ServiceFilter(typeof(ValidationFilter))]  
        public async Task<IActionResult> Create([FromBody] Student student)
        {
            var created = await _efService.CreateAsync(student);
            return CreatedAtAction(nameof(GetById), new { id = created.Id },
                ApiResponse<Student>.Ok(created, "Student created successfully"));
        }

        [HttpPut("{id}")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<IActionResult> Update(Guid id, [FromBody] Student student)
        {
            var updated = await _efService.UpdateAsync(id, student);
            if (updated == null)
                return NotFound(ApiResponse<Student>.Fail($"Student with ID {id} not found"));

            return Ok(ApiResponse<Student>.Ok(updated, "Student updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _efService.DeleteAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<bool>.Fail($"Student with ID {id} not found"));

            return Ok(ApiResponse<bool>.Ok(true, "Student deleted successfully"));
        }


        [HttpGet("ado/all")]
        public async Task<IActionResult> GetAllAdo()
        {
            var students = await _adoService.GetAllStudentsAsync();
            return Ok(ApiResponse<List<Student>>.Ok(students, "Fetched using ADO.NET"));
        }

        [HttpPost("ado/create")]
        [ServiceFilter(typeof(ValidationFilter))]
        public async Task<IActionResult> CreateAdo([FromBody] Student student)
        {
            var result = await _adoService.CreateStudentAsync(student);
            if (!result)
                return StatusCode(500, ApiResponse<bool>.Fail("Failed to insert student"));

            return Ok(ApiResponse<bool>.Ok(true, "Student created using ADO.NET"));
        }
    }
}