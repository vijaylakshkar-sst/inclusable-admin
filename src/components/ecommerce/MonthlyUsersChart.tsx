"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { getMonthlyRoleChartData } from "@/api/dashboard/monthlyRoleChart";

// ✅ Dynamically import ReactApexChart
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyUsersChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [ndisData, setNdisData] = useState<number[]>([]);
  const [businessData, setBusinessData] = useState<number[]>([]);
  const [cabOwners, setCabOwners] = useState<number[]>([]);

  useEffect(() => {
    const fetchChart = async () => {
      const res = await getMonthlyRoleChartData();
      if (res.status) {
        setLabels(res.data.labels);
        setNdisData(res.data.ndis);
        setBusinessData(res.data.business);
        setCabOwners(res.data.cabOwners);
      }
    };
    fetchChart();
  }, []);

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 280,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      dropShadow: {
        enabled: true,
        top: 3,
        left: 3,
        blur: 5,
        opacity: 0.1,
      },
    },
    colors: ["#3B82F6", "#10B981", "#8B5CF6"], // blue, green, purple
    stroke: {
      curve: "smooth", // Smooth curved lines
      width: 3,
      dashArray: [0, 6, 4], // 👈 makes some lines dotted/dashed
    },
    markers: {
      size: 5,
      strokeWidth: 2,
      strokeColors: "#fff",
      hover: { size: 7 },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
      padding: { left: 20, right: 20 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    },
    tooltip: {
      theme: "light",
      marker: { show: true },
      y: {
        formatter: (val: number) => `${val} users`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "13px",
      fontWeight: 500,
      labels: { colors: "#6B7280" },
      markers: {
        size: 10, // ✅ use size instead of width/height
        strokeWidth: 0,
        shape: "circle",
      },
      itemMargin: { horizontal: 10 },
    },
  };

  const series = [
    {
      name: "NDIS Members",
      data: ndisData,
    },
    {
      name: "Business Members",
      data: businessData,
    },
    {
      name: "Cab Owners",
      data: cabOwners,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly User Growth
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Insights by user role
        </p>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[600px] xl:min-w-full">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={280}
          />
        </div>
      </div>
    </div>
  );
}
