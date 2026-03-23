using MongoDB.Driver;
using UserManagementAPI.Models;

namespace UserManagementAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(MongoService mongoService, IConfiguration config)
        {
            var collectionName = config["MongoDBSettings:UsersCollection"]!;
            _users = mongoService.GetCollection<User>(collectionName);
        }

        // ── PRIVATE HELPERS ───────────────────────────────

        // Returns full User WITH password — internal use only
        private User? FindUserById(string id)
        {
            return _users.Find(u => u.Id == id).FirstOrDefault();
        }

        // Strips password before sending to controller
        private UserDTO ToDTO(User user)
        {
            return new UserDTO
            {
                Id = user.Id,
                Name = user.Name,
                EmailID = user.EmailID,
                Role = user.Role
            };
        }

        // ── PUBLIC METHODS ────────────────────────────────

        public List<UserDTO> GetAllUsers()
        {
            var users = _users.Find(_ => true).ToList();
            return users.Select(u => ToDTO(u)).ToList();
        }

        // Returns UserDTO — no password exposed
        public UserDTO GetUserById(string id)
        {
            var user = FindUserById(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID '{id}' not found.");
            return ToDTO(user);
        }

        // Returns full User — needed for login password check
        public User? GetUserByEmail(string email)
        {
            return _users.Find(u => u.EmailID == email).FirstOrDefault();
        }

        public User CreateUser(User user)
        {
            var existing = GetUserByEmail(user.EmailID);
            if (existing != null)
                throw new InvalidOperationException("Email already exists.");

            // Role validation already done by [RegularExpression] annotation
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            _users.InsertOne(user);
            return user;
        }

        // PUT — replace all fields
        public UserDTO UpdateUser(string id, User updatedUser)
        {
            var existing = FindUserById(id);
            if (existing == null)
                throw new KeyNotFoundException($"User with ID '{id}' not found.");

            var emailOwner = GetUserByEmail(updatedUser.EmailID);
            if (emailOwner != null && emailOwner.Id != id)
                throw new InvalidOperationException("Email already in use by another user.");

            var update = Builders<User>.Update
                .Set(u => u.Name, updatedUser.Name)
                .Set(u => u.EmailID, updatedUser.EmailID)
                .Set(u => u.Role, updatedUser.Role);

            _users.UpdateOne(u => u.Id == id, update);

            updatedUser.Id = id;
            return ToDTO(updatedUser);
        }

        // PATCH — UserPatch has all nullable fields, no [Required]
        public UserDTO PatchUser(string id, UserPatch patchData)
        {
            // Use private FindUserById — returns full User not UserDTO
            var user = FindUserById(id);
            if (user == null)
                throw new KeyNotFoundException($"User with ID '{id}' not found.");

            var updateDefinitions = new List<UpdateDefinition<User>>();

            if (!string.IsNullOrEmpty(patchData.Name))
            {
                updateDefinitions.Add(Builders<User>.Update.Set(u => u.Name, patchData.Name));
                user.Name = patchData.Name;
            }

            if (!string.IsNullOrEmpty(patchData.EmailID))
            {
                var emailOwner = GetUserByEmail(patchData.EmailID);
                if (emailOwner != null && emailOwner.Id != id)
                    throw new InvalidOperationException("Email already in use by another user.");

                updateDefinitions.Add(Builders<User>.Update.Set(u => u.EmailID, patchData.EmailID));
                user.EmailID = patchData.EmailID;
            }

            if (!string.IsNullOrEmpty(patchData.Role))
            {
                updateDefinitions.Add(Builders<User>.Update.Set(u => u.Role, patchData.Role));
                user.Role = patchData.Role;
            }

            if (!string.IsNullOrEmpty(patchData.Password))
            {
                var hashed = BCrypt.Net.BCrypt.HashPassword(patchData.Password);
                updateDefinitions.Add(Builders<User>.Update.Set(u => u.Password, hashed));
            }

            if (updateDefinitions.Count == 0)
                throw new ArgumentException("No fields provided to update.");

            var combined = Builders<User>.Update.Combine(updateDefinitions);
            _users.UpdateOne(u => u.Id == id, combined);

            return ToDTO(user);
        }

        public void DeleteUser(string id)
        {
            var result = _users.DeleteOne(u => u.Id == id);
            if (result.DeletedCount == 0)
                throw new KeyNotFoundException($"User with ID '{id}' not found.");
        }

        public bool VerifyPassword(string plain, string hashed)
        {
            return BCrypt.Net.BCrypt.Verify(plain, hashed);
        }
    }
}