﻿using System.Text.Json.Serialization;
using System.Collections.Generic;
using AutoMapper.Configuration.Annotations;

namespace CarManage.Server.Models
{
    public class Car
    {
        public Car(string brand, string model, int year, string color, string vin, double engine, int horsePower, int odometer, string userId)
        {
            Brand = brand;
            Model = model;
            Year = year;
            Color = color;
            Vin = vin;
            Engine = engine;
            HorsePower = horsePower;
            Odometer = odometer;
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
        public int Odometer { get; set; }
        public string UserId { get; set; }

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        public List<ServiceHistory> ServiceHistories { get; set; } = new List<ServiceHistory>();

        [JsonIgnore]
        public List<NotificationSettings> NotificationSettings { get; set; } = new List<NotificationSettings>();
    }
}