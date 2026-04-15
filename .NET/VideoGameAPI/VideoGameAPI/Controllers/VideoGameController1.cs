using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace VideoGameAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideoGameController1 : ControllerBase
    {
        static private List<VideoGame> videoGames = new List<VideoGame>
        {
            new VideoGame
    {
        Id = 1,
        Title = "Grand Theft Auto V",
        Platform = "PC",
        Developer = "Rockstar North",
        Publisher = "Rockstar Games"
    },
    new VideoGame
    {
        Id = 2,
        Title = "God of War Ragnarök",
        Platform = "PlayStation 5",
        Developer = "Santa Monica Studio",
        Publisher = "Sony Interactive Entertainment"
    },
    new VideoGame
    {
        Id = 3,
        Title = "Minecraft",
        Platform = "Multi-platform",
        Developer = "Mojang Studios",
        Publisher = "Xbox Game Studios"
    },
    new VideoGame
    {
        Id = 4,
        Title = "The Legend of Zelda: Tears of the Kingdom",
        Platform = "Nintendo Switch",
        Developer = "Nintendo EPD",
        Publisher = "Nintendo"
    },
    new VideoGame
    {
        Id = 5,
        Title = "Elden Ring",
        Platform = "PC / PS5 / Xbox",
        Developer = "FromSoftware",
        Publisher = "Bandai Namco Entertainment"
    }
        };
        [HttpGet]
        public ActionResult<List<VideoGame>> GetVideoGames()
        {
            return Ok(videoGames);
        }

        [HttpGet("{id}")]
        public ActionResult<VideoGame> GetVideoGamesById(int id)
        {
            var game = videoGames.FirstOrDefault(g => g.Id == id);
            if (game is null)
            {
                return NotFound();
            }
            return Ok(game);
        }

        [HttpPost]
        public ActionResult<VideoGame> AddVideoGame(VideoGame newGame)
        {
            if (newGame is null)
            {
                return BadRequest();
            }
            newGame.Id = videoGames.Max(g => g.Id) + 1;
            videoGames.Add(newGame);
            return CreatedAtAction(nameof(GetVideoGamesById), new { id = newGame.Id }, newGame);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateVideoGame(int id, VideoGame Updatedgame)
        {
            var game = videoGames.FirstOrDefault(g => g.Id == id);
            if (game is null)
            {
                return NotFound();
            }
            game.Title = Updatedgame.Title;
            game.Platform = Updatedgame.Platform;
            game.Developer = Updatedgame.Developer;
            game.Publisher = Updatedgame.Publisher;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult<List<VideoGame>> DeleteVideoGameById(int id)
        {
            var game = videoGames.FirstOrDefault(g => g.Id == id);
            if (game is null)
            {
                return NotFound();
            }
            videoGames.Remove(game);
            return videoGames;
        }

    }
}
