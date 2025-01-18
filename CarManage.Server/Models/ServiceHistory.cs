using CarManage.Server.Models;
using System.ComponentModel.DataAnnotations.Schema;

public class ServiceHistory
{
    public int Id { get; set; }
    public int CarId { get; set; }  // This is the only required field for linking to the car
    public int Services { get; set; } // Bitmask field for multiple services
    public DateTime ServiceDate { get; set; }
    public int OdometerAtService { get; set; }
    public string Notes { get; set; }

    // Remove the ForeignKey attribute, it's not needed
    public Car Car { get; set; }  // Define the relationship explicitly if needed.

    // This calculated property will convert the bitmask into a list of selected services
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

    [NotMapped]
    public List<ServiceType> SelectedServicesInput { get; set; }
}
