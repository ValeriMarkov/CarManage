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
    }
}
