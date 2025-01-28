using CarManage.Server.Models;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json.Serialization;

public class ServiceHistory
{
    public int Id { get; set; }

    public int CarId { get; set; }
    [JsonIgnore]
    public Car Car { get; set; }

    public int Services { get; set; }

    [Required]
    public DateTime ServiceDate { get; set; }

    [Required]
    public int OdometerAtService { get; set; }

    public string Notes { get; set; }

    [JsonPropertyName("selectedServicesInput")]
    public List<ServiceType> SelectedServicesInput { get; set; }

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

    public void ConvertSelectedServicesToBitmask()
    {
        try
        {
            if (SelectedServicesInput == null || SelectedServicesInput.Count == 0)
            {
                Services = 0;
                return;
            }

            foreach (var service in SelectedServicesInput)
            {
                if (!Enum.IsDefined(typeof(ServiceType), service))
                {
                    throw new ArgumentException($"Invalid service type {service} in SelectedServicesInput.");
                }
            }

            int servicesBitmask = 0;
            foreach (var service in SelectedServicesInput)
            {
                servicesBitmask |= (int)service;
            }

            Services = servicesBitmask;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }
}