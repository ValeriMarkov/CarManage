namespace CarManage.Server.Models
{
    public class ServiceHistory
    {
        public int Id { get; set; }
        public int CarId { get; set; }  // This is the only required field for linking to the car
        public int Services { get; set; } // Bitmask field for multiple services
        public DateTime ServiceDate { get; set; }
        public int OdometerAtService { get; set; }
        public string Notes { get; set; }

        // Remove this Car navigation property if not needed
        // public Car Car { get; set; }

        public List<ServiceType> SelectedServices
        {
            get
            {
                var selectedServices = new List<ServiceType>();
                foreach (ServiceType service in Enum.GetValues(typeof(ServiceType)))
                {
                    if ((Services & (int)service) != 0)
                    {
                        selectedServices.Add(service);
                    }
                }
                return selectedServices;
            }
        }
    }
}
