'use client';

import React, { useEffect, useState } from "react";
import Badge from "../ui/badge/Badge";
import { GroupIcon, BoxIconLine } from "@/icons";
import { getCardCounts } from "@/api/dashboard/cardsCount";

export const EcommerceMetrics = () => {
  const [ndisCount, setNdisCount] = useState(0);
  const [businessCount, setBusinessCount] = useState(0);
  const [cabOwners, setCabOwners] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const res = await getCardCounts();
        if (res.status) {
          setNdisCount(Number(res.data["NDIS Member"] || 0));
          setBusinessCount(Number(res.data["Company"] || 0));
          setCabOwners(Number(res.data["Cab Owner"] || 0));
        }
      } catch (err) {
        console.error("Error fetching card counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* NDIS Members */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-15 h-15 bg-blue-100 rounded-lg dark:bg-gray-800">
              <GroupIcon className="text-blue-600 size-5 dark:text-white/90" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                NDIS Members
              </span>
              <h4 className="font-bold text-gray-800 text-base dark:text-white/90">
                {loading ? "..." : ndisCount}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Business Members */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-15 h-15 bg-green-100 rounded-lg dark:bg-gray-800">
              <BoxIconLine className="text-green-600 size-5 dark:text-white/90" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                Business Members
              </span>
              <h4 className="font-bold text-gray-800 text-base dark:text-white/90">
                {loading ? "..." : businessCount}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Cab Owners */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-15 h-15 bg-yellow-100 rounded-lg dark:bg-gray-800">
              <BoxIconLine className="text-yellow-600 size-5 dark:text-white/90" />
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                Cab Owners
              </span>
              <h4 className="font-bold text-gray-800 text-base dark:text-white/90">
                {loading ? "..." : cabOwners}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
