using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Text;
using CarManage.Server.Models;
using System.IO;
using CsvHelper;
using System.Globalization;
using System.Collections.Generic;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Colors;
using System;
using Microsoft.EntityFrameworkCore;

namespace CarManage.Server.Controllers
{
    [Route("api/export")]
    [ApiController]
    public class ExportController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExportController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("pdf")]
        public IActionResult GeneratePdfReport([FromQuery] int[] carIds, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string serviceType = null)
        {
            // Declare parsedServiceType outside the if block
            ServiceType? parsedServiceType = null;

            if (!string.IsNullOrEmpty(serviceType))
            {
                if (Enum.TryParse(serviceType, out ServiceType result))
                {
                    parsedServiceType = result;
                }
                else
                {
                    return BadRequest("Invalid service type provided.");
                }
            }

            var query = _context.Cars
                                .Where(c => carIds.Contains(c.Id))
                                .Include(c => c.ServiceHistories) // Include ServiceHistories without SelectedServices
                                .AsQueryable();

            // Apply date filters if provided
            if (startDate.HasValue)
                query = query.Where(c => c.ServiceHistories.Any(s => s.ServiceDate >= startDate.Value));

            if (endDate.HasValue)
                query = query.Where(c => c.ServiceHistories.Any(s => s.ServiceDate <= endDate.Value));

            var cars = query.ToList(); // Execute the query

            if (!cars.Any())
                return NotFound("No cars found for the selected filters.");

            using (var memoryStream = new MemoryStream())
            {
                var pdfWriter = new PdfWriter(memoryStream);
                var pdfDocument = new PdfDocument(pdfWriter);
                var document = new Document(pdfDocument);

                // Branding: Add "CarManage" header
                document.Add(new Paragraph("CarManage - Service History Report")
                    .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER)
                    .SetFontSize(18)
                    .SetFontColor(ColorConstants.BLACK));

                document.Add(new Paragraph("\n"));

                // Add car information and service history
                foreach (var car in cars)
                {
                    document.Add(new Paragraph($"Car: {car.Brand} {car.Model} ({car.Year})"));
                    document.Add(new Paragraph($"VIN: {car.Vin}"));
                    document.Add(new Paragraph($"Odometer: {car.Odometer} km"));
                    document.Add(new Paragraph("\n"));

                    foreach (var serviceHistory in car.ServiceHistories)
                    {
                        // Filter services by the selected service type
                        if (parsedServiceType.HasValue && !serviceHistory.SelectedServices.Contains(parsedServiceType.Value))
                            continue;

                        document.Add(new Paragraph($"Service Date: {serviceHistory.ServiceDate.ToShortDateString()}"));
                        document.Add(new Paragraph($"Odometer at Service: {serviceHistory.OdometerAtService} km"));
                        document.Add(new Paragraph($"Services: {string.Join(", ", serviceHistory.SelectedServices)}"));
                        if (!string.IsNullOrEmpty(serviceHistory.Notes))
                        {
                            document.Add(new Paragraph($"Notes: {serviceHistory.Notes}"));
                        }
                        document.Add(new Paragraph("\n"));
                    }

                    document.Add(new Paragraph("----------------------------------------------------------"));
                    document.Add(new Paragraph("\n"));
                }

                document.Close();

                // Return the generated PDF as a download
                return File(memoryStream.ToArray(), "application/pdf", "ServiceHistoryReport.pdf");
            }
        }



        [HttpGet("csv")]
        public IActionResult GenerateCsvReport([FromQuery] int[] carIds, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string serviceType = null)
        {
            // Declare parsedServiceType outside the if block
            ServiceType? parsedServiceType = null;

            if (!string.IsNullOrEmpty(serviceType))
            {
                if (Enum.TryParse(serviceType, out ServiceType result))
                {
                    parsedServiceType = result;
                }
                else
                {
                    return BadRequest("Invalid service type provided.");
                }
            }

            var query = _context.Cars
                                .Where(c => carIds.Contains(c.Id))
                                .Include(c => c.ServiceHistories)  // Only include ServiceHistories, not SelectedServices
                                .AsQueryable();

            // Apply date filters if provided
            if (startDate.HasValue)
                query = query.Where(c => c.ServiceHistories.Any(s => s.ServiceDate >= startDate.Value));

            if (endDate.HasValue)
                query = query.Where(c => c.ServiceHistories.Any(s => s.ServiceDate <= endDate.Value));

            var cars = query.ToList();

            if (!cars.Any())
                return NotFound("No cars found for the selected filters.");

            using (var memoryStream = new MemoryStream())
            using (var writer = new StreamWriter(memoryStream, Encoding.UTF8))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                // Writing CSV header
                csv.WriteField("Car Brand");
                csv.WriteField("Car Model");
                csv.WriteField("Car Year");
                csv.WriteField("VIN");
                csv.WriteField("Odometer (km)");
                csv.WriteField("Service Date");
                csv.WriteField("Odometer at Service (km)");
                csv.WriteField("Services");
                csv.WriteField("Notes");
                csv.NextRecord();

                // Writing car details and service history
                foreach (var car in cars)
                {
                    foreach (var serviceHistory in car.ServiceHistories)
                    {
                        // Filter services by the selected service type if applicable
                        if (parsedServiceType.HasValue && !serviceHistory.SelectedServices.Contains(parsedServiceType.Value))
                            continue;

                        csv.WriteField(car.Brand);
                        csv.WriteField(car.Model);
                        csv.WriteField(car.Year);
                        csv.WriteField(car.Vin);
                        csv.WriteField(car.Odometer);
                        csv.WriteField(serviceHistory.ServiceDate.ToShortDateString());
                        csv.WriteField(serviceHistory.OdometerAtService);
                        csv.WriteField(string.Join(", ", serviceHistory.SelectedServices));
                        csv.WriteField(serviceHistory.Notes ?? string.Empty);
                        csv.NextRecord();
                    }
                }

                writer.Flush();
                return File(memoryStream.ToArray(), "text/csv", "ServiceHistoryReport.csv");
            }
        }
    }
}
