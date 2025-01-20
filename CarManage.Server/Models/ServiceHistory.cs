using CarManage.Server.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

public class ServiceHistory
{
    public int Id { get; set; }

    [Required]
    public int CarId { get; set; }

    public int Services { get; set; }

    [Required]
    public DateTime ServiceDate { get; set; }

    [Required]
    public int OdometerAtService { get; set; }

    public string Notes { get; set; }

    [JsonIgnore]
    public Car Car { get; set; }

    [Required]
    public List<ServiceType> SelectedServicesInput { get; set; }  // Ensure this is required and validated

    // This property will convert the SelectedServicesInput into the Services bitmask value
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

    // This method will handle the conversion from SelectedServicesInput to the Services bitmask.
    public void ConvertSelectedServicesToBitmask()
    {
        // Ensure SelectedServicesInput only contains valid enum values
        foreach (var service in SelectedServicesInput)
        {
            if (!Enum.IsDefined(typeof(ServiceType), service))
            {
                throw new ArgumentException($"Invalid service type {service} in SelectedServicesInput.");
            }
        }

        // Convert selected services to a bitmask
        int servicesBitmask = 0;
        foreach (var service in SelectedServicesInput)
        {
            servicesBitmask |= (int)service;
        }

        Services = servicesBitmask;
    }
}
