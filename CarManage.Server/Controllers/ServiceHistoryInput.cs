using CarManage.Server.Models;

namespace CarManage.Server.Controllers
{
    public class ServiceHistoryInput
    {
        public int CarId { get; set; }
        public DateTime ServiceDate { get; set; }
        public int OdometerAtService { get; set; }
        public string Notes { get; set; }
        public List<ServiceType> SelectedServicesInput { get; set; }
    }
}