"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import {
  MonthlyBookingChartData,
  getMonthlyBookingChartData,
} from "@/api/dashboard/monthlyBookingChart";

// ✅ Dynamically import ApexCharts
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function StatisticsChart() {
  const [chartData, setChartData] = useState<MonthlyBookingChartData>({
    labels: [],
    eventData: [],
    cabData: [],
    totalData: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getMonthlyBookingChartData();
        console.log(res);
        
        if (res.status) {
          setChartData(res.data);
        }
      } catch (err) {
        console.error("Error fetching monthly revenue:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Chart Configuration
  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#4F46E5", "#22C55E"], // Purple = Event, Green = Cab
    stroke: {
      curve: "smooth",
      width: 2,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      labels: { colors: "#6B7280" },
      markers: {
        size: 8,
        strokeWidth: 0,
        fillColors: ["#4F46E5", "#22C55E"],
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    grid: {
      borderColor: "#f1f1f1",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: chartData.labels,
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: "#6B7280", fontSize: "12px" },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "light",
      y: {
        formatter: (val) => `AUD ${val.toFixed(2)}`,
      },
    },
  };

  // ✅ Dual-Line Data
  const series = [
    {
      name: "Event Revenue (AUD)",
      data: chartData.eventData,
    },
    {
      name: "Cab Revenue (AUD)",
      data: chartData.cabData,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Monthly Booking Revenue
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Comparison between Cab & Event bookings
          </p>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="area"
            height={310}
          />
        </div>
      </div>
    </div>
  );
}
