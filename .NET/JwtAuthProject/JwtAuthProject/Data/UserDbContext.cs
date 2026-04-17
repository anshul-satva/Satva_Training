using Microsoft.EntityFrameworkCore;
using JwtAuthProject.Entities;

namespace JwtAuthProject.Data
{
    public class UserDbContext(DbContextOptions<UserDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
    }
}
