using Newtonsoft.Json;

namespace CarManage.Server.Models
{
    public class Car
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string Color { get; set; }
        public string Vin { get; set; }
        public double Engine { get; set; }
        public int HorsePower { get; set; }
        public string UserId { get; set; }

        // If you want to include ServiceHistories in responses, remove this
        // Otherwise, keep it as it is for not including them
        [JsonIgnore]
        public List<ServiceHistory> ServiceHistories { get; set; } = new List<ServiceHistory>();
    }
}
