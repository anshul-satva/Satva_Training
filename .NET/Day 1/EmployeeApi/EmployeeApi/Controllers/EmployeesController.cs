using EmployeeApi.Models;
using EmployeeApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            this.employeeService = employeeService;
        }

        [HttpGet("getEmployee")]
        [Authorize]
        public IActionResult GetAll()
        {
            return Ok(employeeService.GetAll());
        }

        [HttpGet("getEmployee/{id}")]
        [Authorize]
        public IActionResult GetById(int id)
        {
            var emp = employeeService.GetById(id);
            if (emp == null)
                return NotFound(new { message = "Employee not found with id " + id });
            return Ok(emp);
        }

        [HttpPost("postEmployee")]
        [Authorize(Roles = "Admin")]
        public IActionResult Create([FromBody] Employee emp)
        {
            return Ok(employeeService.Add(emp));
        }

        [HttpPut("updateEmployee")]
        [Authorize(Roles = "Admin")]
        public IActionResult Put([FromBody] Employee emp)
        {
            var existing = employeeService.GetById(emp.Id);
            if (existing == null)
                return NotFound(new { message = "Employee not found with id " + emp.Id });

            employeeService.Put(emp);
            return Ok(employeeService.GetById(emp.Id));
        }

        [HttpPatch("patchEmployee/{id}")]                     
        [Authorize(Roles = "Admin")]
        public IActionResult Patch(int id, [FromBody] Employee emp)
        {
            var existing = employeeService.GetById(id);
            if (existing == null)
                return NotFound(new { message = "Employee not found with id " + id });

            employeeService.Patch(id, emp);
            return Ok(employeeService.GetById(id));
        }

        [HttpDelete("deleteEmployee/{id}")]
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)                  
        {
            var existing = employeeService.GetById(id);
            if (existing == null)
                return NotFound(new { message = "Employee not found with id " + id });

            employeeService.Delete(id);
            return Ok(new { message = "Employee deleted successfully", id });
        }
    }
}