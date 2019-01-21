using System;
namespace TodoApi.Models
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime ExpiryDate {get; set;}
        public string ImportanceLevel {get; set;}
    }
}