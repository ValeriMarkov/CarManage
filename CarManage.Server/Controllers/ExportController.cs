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
using iText.Layout.Properties;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using System;
using Microsoft.EntityFrameworkCore;
using iText.Kernel.Pdf.Canvas.Draw;

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
            ServiceType? parsedServiceType = null;
            if (!string.IsNullOrEmpty(serviceType) && Enum.TryParse(serviceType, out ServiceType parsedType))
            {
                parsedServiceType = parsedType;
            }
            else if (!string.IsNullOrEmpty(serviceType))
            {
                return BadRequest("Invalid service type provided.");
            }

            var query = _context.Cars
                                .Where(c => carIds.Contains(c.Id))
                                .Include(c => c.ServiceHistories)
                                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(c => c.ServiceHistories.Any(s => s.ServiceDate >= startDate.Value));
            if (endDate.HasValue)
                query = query.Where(c => c.ServiceHistories.Any(s => s.ServiceDate <= endDate.Value));

            var cars = query.ToList();
            if (!cars.Any())
                return NotFound("No cars found for the selected filters.");

            using (var memoryStream = new MemoryStream())
            {
                var pdfWriter = new PdfWriter(memoryStream);
                var pdfDocument = new PdfDocument(pdfWriter);
                var document = new Document(pdfDocument);
                var boldFont = PdfFontFactory.CreateFont(iText.IO.Font.Constants.StandardFonts.HELVETICA_BOLD);

                document.Add(new Paragraph("CarManage - Service History Report")
                    .SetFont(boldFont)
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetFontSize(20)
                    .SetFontColor(ColorConstants.BLACK));
                document.Add(new Paragraph("\n"));

                foreach (var car in cars)
                {
                    document.Add(new Paragraph($"Car: {car.Brand} {car.Model} ({car.Year})")
                        .SetFont(boldFont)
                        .SetFontSize(14)
                        .SetFontColor(ColorConstants.DARK_GRAY));
                    document.Add(new Paragraph($"VIN: {car.Vin}")
                        .SetFontSize(12));
                    document.Add(new Paragraph($"Odometer: {car.Odometer} km")
                        .SetFontSize(12));
                    document.Add(new Paragraph("\n"));

                    Table table = new Table(4).UseAllAvailableWidth();
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Service Date").SetFont(boldFont)));
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Odometer (km)").SetFont(boldFont)));
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Services Performed").SetFont(boldFont)));
                    table.AddHeaderCell(new Cell().Add(new Paragraph("Notes").SetFont(boldFont)));

                    foreach (var serviceHistory in car.ServiceHistories)
                    {
                        if (parsedServiceType.HasValue && !serviceHistory.SelectedServices.Contains(parsedServiceType.Value))
                            continue;

                        table.AddCell(new Cell().Add(new Paragraph(serviceHistory.ServiceDate.ToShortDateString())));
                        table.AddCell(new Cell().Add(new Paragraph(serviceHistory.OdometerAtService.ToString())));
                        table.AddCell(new Cell().Add(new Paragraph(string.Join(", ", serviceHistory.SelectedServices))));
                        table.AddCell(new Cell().Add(new Paragraph(serviceHistory.Notes ?? "-")));
                    }

                    document.Add(table);
                    document.Add(new Paragraph("\n"));
                    document.Add(new LineSeparator(new SolidLine()));
                    document.Add(new Paragraph("\n"));
                }

                document.Close();
                return File(memoryStream.ToArray(), "application/pdf", "ServiceHistoryReport.pdf");
            }
        }

            [HttpGet("csv")]
        public IActionResult GenerateCsvReport([FromQuery] int[] carIds, [FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] string serviceType = null)
        {
            ServiceType? parsedServiceType = null;
            if (!string.IsNullOrEmpty(serviceType) && Enum.TryParse(serviceType, out ServiceType parsedType))
            {
                parsedServiceType = parsedType;
            }
            else if (!string.IsNullOrEmpty(serviceType))
            {
                return BadRequest("Invalid service type provided.");
            }

            var query = _context.Cars
                                .Where(c => carIds.Contains(c.Id))
                                .Include(c => c.ServiceHistories)
                                .AsQueryable();

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

                foreach (var car in cars)
                {
                    foreach (var serviceHistory in car.ServiceHistories)
                    {
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
