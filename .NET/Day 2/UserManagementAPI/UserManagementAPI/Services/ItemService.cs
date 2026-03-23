using MongoDB.Driver;
using UserManagementAPI.Models;

namespace UserManagementAPI.Services
{
    public class ItemService
    {
        private readonly IMongoCollection<Item> _items;

        public ItemService(MongoService mongoService, IConfiguration config)
        {
            var collectionName = config["MongoDBSettings:ItemsCollection"]!;
            _items = mongoService.GetCollection<Item>(collectionName);
        }

        public List<Item> GetAllItems()
        {
            return _items.Find(_ => true).ToList();
        }

        public Item GetItemById(string id)
        {
            var item = _items.Find(i => i.Id == id).FirstOrDefault();
            if (item == null)
                throw new KeyNotFoundException($"Item with ID '{id}' not found.");
            return item;
        }

        public Item CreateItem(Item item)
        {
            // [Range] annotation already handles price/quantity validation
            _items.InsertOne(item);
            return item;
        }

        public Item UpdateItem(string id, Item updatedItem)
        {
            GetItemById(id); // throws 404 if not found

            var update = Builders<Item>.Update
                .Set(i => i.Name, updatedItem.Name)
                .Set(i => i.Price, updatedItem.Price)
                .Set(i => i.Quantity, updatedItem.Quantity);

            _items.UpdateOne(i => i.Id == id, update);
            updatedItem.Id = id;
            return updatedItem;
        }

        // PATCH — uses ItemPatch (all nullable, all optional)
        public Item PatchItem(string id, ItemPatch patchData)
        {
            var item = GetItemById(id); // throws 404 if not found

            var updateDefinitions = new List<UpdateDefinition<Item>>();

            if (!string.IsNullOrEmpty(patchData.Name))
            {
                updateDefinitions.Add(Builders<Item>.Update.Set(i => i.Name, patchData.Name));
                item.Name = patchData.Name;
            }

            // .HasValue checks if nullable decimal was actually sent
            if (patchData.Price.HasValue)
            {
                updateDefinitions.Add(Builders<Item>.Update.Set(i => i.Price, patchData.Price.Value));
                item.Price = patchData.Price.Value;
            }

            // .HasValue checks if nullable int was actually sent
            if (patchData.Quantity.HasValue)
            {
                updateDefinitions.Add(Builders<Item>.Update.Set(i => i.Quantity, patchData.Quantity.Value));
                item.Quantity = patchData.Quantity.Value;
            }

            if (updateDefinitions.Count == 0)
                throw new ArgumentException("No fields provided to update.");

            var combined = Builders<Item>.Update.Combine(updateDefinitions);
            _items.UpdateOne(i => i.Id == id, combined);

            return item;
        }

        public void DeleteItem(string id)
        {
            var result = _items.DeleteOne(i => i.Id == id);
            if (result.DeletedCount == 0)
                throw new KeyNotFoundException($"Item with ID '{id}' not found.");
        }
    }
}