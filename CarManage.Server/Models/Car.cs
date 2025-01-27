using System.Text.Json.Serialization;

namespace CarManage.Server.Models
{
    public class Car
    {
        public Car(string brand, string model, int year, string color, string vin, double engine, int horsePower, string userId)
        {
            Brand = brand;
            Model = model;
            Year = year;
            Color = color;
            Vin = vin;
            Engine = engine;
            HorsePower = horsePower;
            UserId = userId;
        }

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
        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<ServiceHistory> ServiceHistories { get; set; } = new List<ServiceHistory>();
    }
}
