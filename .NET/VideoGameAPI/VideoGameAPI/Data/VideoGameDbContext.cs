using Microsoft.EntityFrameworkCore;
using VideoGameAPI;

namespace VideoGameAPI.Data
{
    public class VideoGameDbContext : DbContext
    {
        public VideoGameDbContext(DbContextOptions<VideoGameDbContext> options)
            : base(options)
        {
        }

        public DbSet<VideoGame> VideoGames { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //modelBuilder.Entity<VideoGame>().HasData(
            //    new VideoGame
            //    {
            //        Id = 1,
            //        Title = "Spider-Man 2",
            //        Platform = "PS5"
            //    },
            //    new VideoGame
            //    {
            //        Id = 2,
            //        Title = "The Legend of Zelda: Breath of the Wild",
            //        Platform = "Nintendo Switch"
            //    },
            //    new VideoGame
            //    {
            //        Id = 3,
            //        Title = "Cyberpunk 2077",
            //        Platform = "PC"
            //    }
            //);

        }
    }
}
