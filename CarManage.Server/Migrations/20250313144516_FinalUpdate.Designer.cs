﻿// <auto-generated />
using System;
using CarManage.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace CarManage.Server.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20250313144516_FinalUpdate")]
    partial class FinalUpdate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.11")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("CarManage.Server.Models.Car", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Brand")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Color")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<double>("Engine")
                        .HasColumnType("float");

                    b.Property<int>("HorsePower")
                        .HasColumnType("int");

                    b.Property<string>("Model")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Odometer")
                        .HasColumnType("int");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Vin")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Year")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.ToTable("Cars");
                });

            modelBuilder.Entity("CarManage.Server.Models.NotificationSettings", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("AverageWeeklyMileage")
                        .HasColumnType("int");

                    b.Property<int>("BrakePadsChangeInterval")
                        .HasColumnType("int");

                    b.Property<bool>("BrakePadsNotification")
                        .HasColumnType("bit");

                    b.Property<int?>("CarId")
                        .HasColumnType("int");

                    b.Property<int>("CurrentOdometer")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("FilterChangeNotification")
                        .HasColumnType("bit");

                    b.Property<bool>("IsAutomaticMileageTracking")
                        .HasColumnType("bit");

                    b.Property<int>("LastBrakePadsChangeMileage")
                        .HasColumnType("int");

                    b.Property<int>("LastOilChangeMileage")
                        .HasColumnType("int");

                    b.Property<int>("LastSparkPlugChangeMileage")
                        .HasColumnType("int");

                    b.Property<int>("LastTimingBeltChangeMileage")
                        .HasColumnType("int");

                    b.Property<int>("LastTimingChainChangeMileage")
                        .HasColumnType("int");

                    b.Property<int>("LastTireRotationMileage")
                        .HasColumnType("int");

                    b.Property<int>("LastTransmissionFluidChangeMileage")
                        .HasColumnType("int");

                    b.Property<int>("LastWaterPumpReplacementMileage")
                        .HasColumnType("int");

                    b.Property<int>("ManualOdometerEntry")
                        .HasColumnType("int");

                    b.Property<int>("OilChangeInterval")
                        .HasColumnType("int");

                    b.Property<bool>("OilChangeNotification")
                        .HasColumnType("bit");

                    b.Property<int>("SparkPlugChangeInterval")
                        .HasColumnType("int");

                    b.Property<bool>("SparkPlugChangeNotification")
                        .HasColumnType("bit");

                    b.Property<int>("TimingBeltChangeInterval")
                        .HasColumnType("int");

                    b.Property<bool>("TimingBeltNotification")
                        .HasColumnType("bit");

                    b.Property<int>("TimingChainChangeInterval")
                        .HasColumnType("int");

                    b.Property<bool>("TimingChainChangeNotification")
                        .HasColumnType("bit");

                    b.Property<int>("TireRotationInterval")
                        .HasColumnType("int");

                    b.Property<bool>("TireRotationNotification")
                        .HasColumnType("bit");

                    b.Property<int>("TransmissionFluidChangeInterval")
                        .HasColumnType("int");

                    b.Property<bool>("TransmissionFluidChangeNotification")
                        .HasColumnType("bit");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("WaterPumpReplacementInterval")
                        .HasColumnType("int");

                    b.Property<bool>("WaterPumpReplacementNotification")
                        .HasColumnType("bit");

                    b.HasKey("Id");

                    b.HasIndex("CarId");

                    b.ToTable("NotificationSettings");
                });

            modelBuilder.Entity("ServiceHistory", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int>("CarId")
                        .HasColumnType("int");

                    b.Property<string>("Notes")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("OdometerAtService")
                        .HasColumnType("int");

                    b.Property<DateTime>("ServiceDate")
                        .HasColumnType("datetime2");

                    b.Property<long>("Services")
                        .HasColumnType("bigint");

                    b.HasKey("Id");

                    b.HasIndex("CarId");

                    b.ToTable("ServiceHistories");
                });

            modelBuilder.Entity("CarManage.Server.Models.NotificationSettings", b =>
                {
                    b.HasOne("CarManage.Server.Models.Car", "Car")
                        .WithMany("NotificationSettings")
                        .HasForeignKey("CarId")
                        .OnDelete(DeleteBehavior.SetNull);

                    b.Navigation("Car");
                });

            modelBuilder.Entity("ServiceHistory", b =>
                {
                    b.HasOne("CarManage.Server.Models.Car", "Car")
                        .WithMany("ServiceHistories")
                        .HasForeignKey("CarId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Car");
                });

            modelBuilder.Entity("CarManage.Server.Models.Car", b =>
                {
                    b.Navigation("NotificationSettings");

                    b.Navigation("ServiceHistories");
                });
#pragma warning restore 612, 618
        }
    }
}
