"use client";

import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "@/icons";
import { getStats, DashboardStats } from "@/api/dashboard/stats"; // ✅ Updated import

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [series, setSeries] = useState<number[]>([0]);

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getStats();
        if (res.status) {
          setStats(res.data);
          setSeries([res.data.percentageAchieved]);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    }

    fetchStats();
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target
            </h3>
            <p className="mt-1 font-normal text-gray-500 text-theme-sm dark:text-gray-400">
              Target you’ve set for each month
            </p>
          </div>
          {/* <div className="relative inline-block">
            <button onClick={toggleDropdown} className="dropdown-toggle">
              <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
            <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-40 p-2">
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                View More
              </DropdownItem>
              <DropdownItem
                tag="a"
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Delete
              </DropdownItem>
            </Dropdown>
          </div> */}
        </div>

        <div className="relative">
          <div className="max-h-[330px]">
            <ReactApexChart options={options} series={series} type="radialBar" height={330} />
          </div>

          {stats && (
            <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
              +{stats.changePercentage}%
            </span>
          )}
        </div>

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          You earn ${stats?.todayAmount.toLocaleString()} today, it&apos;s higher than last month.
          Keep up your good work!
        </p>
      </div>

      {stats && (
        <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
          <StatBox label="Target" value={`$${stats.target.toLocaleString()}`} trend="down" />
          <Divider />
          <StatBox label="Revenue" value={`$${stats.monthlyAmount.toLocaleString()}`} trend="up" />
          <Divider />
          <StatBox label="Today" value={`$${stats.todayAmount.toLocaleString()}`} trend="up" />
          <Divider />
          <StatBox label="Today Booking" value={`${stats.todayBookings.toLocaleString()}`} trend="up" />
          <Divider />
          <StatBox label="Monthly Bookings" value={`${stats.monthlyBookings.toLocaleString()}`} trend="up" />
        </div>
      )}
    </div>
  );
}

// Subcomponents

function StatBox({ label, value, trend }: { label: string; value: string; trend: "up" | "down" }) {
  const icon = trend === "up" ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243..."
        fill="#039855"
      />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176..."
        fill="#D92D20"
      />
    </svg>
  );

  return (
    <div>
      <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
        {label}
      </p>
      <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
        {value} {icon}
      </p>
    </div>
  );
}

function Divider() {
  return <div className="w-px bg-gray-200 h-7 dark:bg-gray-800" />;
}
