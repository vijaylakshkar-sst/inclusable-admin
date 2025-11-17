'use client';

import React, { useEffect, useState } from 'react';
import { getCabOwnerDetails, CabOwnerDetails } from '@/api/users/userApi';
import { useParams } from 'next/navigation';
import {
    Loader2,
    Phone,
    Mail,
    MapPin,
    Car,
    CheckCircle2,
    XCircle,
    Calendar,
    FileImage,
    List,
    Clock,
    DollarSign,
    User as UserIconLucide,
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function UserMetaCard() {
    const { id } = useParams();
    const [data, setData] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch Cab Owner Details
    const fetchDetails = async (userId: number) => {
        try {
            const res = await getCabOwnerDetails(userId);
            if (res.status) setData(res.data);
            else toast.error('Failed to load Cab Owner details');
        } catch (err) {
            console.error(err);
            toast.error('Error loading details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetails(Number(id));
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center text-gray-600 mt-12">
                <p>No Cab Owner data found.</p>
            </div>
        );
    }

    return (
        <div className="w-full my-6 p-8 bg-white rounded-2xl shadow-lg border border-gray-100 space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{data.full_name}</h1>
                    <p className="text-gray-500 text-sm mt-1">{data.role}</p>
                </div>
                <div className="flex items-center gap-2 mt-4 md:mt-0">
                    {data.is_verified ? (
                        <span className="flex items-center text-green-600 font-semibold">
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Verified
                        </span>
                    ) : (
                        <span className="flex items-center text-red-500 font-semibold">
                            <XCircle className="w-4 h-4 mr-1" /> Not Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                        <UserIconLucide className="w-5 h-5 mr-2 text-blue-600" /> Personal Details
                    </h3>
                    <div className="space-y-2 text-gray-700">
                        <p className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-blue-500" /> {data.email}
                        </p>
                        <p className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" /> {data.phone_number}
                        </p>
                        <p className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" /> Joined:{" "}
                            {new Date(data.created_at || Date.now()).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="p-5 bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                        <Car className="w-5 h-5 mr-2 text-yellow-600" /> Vehicle Information
                    </h3>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Vehicle:</strong> {data.vehicle_make} {data.vehicle_model}</p>
                        <p><strong>Cab Type:</strong> {data.cab_type || "N/A"}</p>
                        <p><strong>Vehicle No:</strong> {data.vehicle_number}</p>
                        <p><strong>Manufacturing Year:</strong> {data.manufacturing_year || "N/A"}</p>
                        <p><strong>License No:</strong> {data.license_number || "N/A"}</p>
                    </div>
                </div>
            </div>

            {/* Status and Location */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-5 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-gray-700 mb-3">Status</h3>
                    <p>
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${data.status === 'online'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-200 text-gray-600'
                                }`}
                        >
                            {data.status}
                        </span>
                    </p>
                    <p className="mt-2">
                        <strong>Available:</strong> {data.is_available ? 'Yes' : 'No'}
                    </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border">
                    <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <MapPin className="w-5 h-5 mr-2 text-purple-600" /> Location
                    </h3>
                    <p><strong>Latitude:</strong> {data.current_location.lat || 'N/A'}</p>
                    <p><strong>Longitude:</strong> {data.current_location.lng || 'N/A'}</p>
                </div>
            </div>

            {/* Documents Section */}
            {/* Documents Section */}
            <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <FileImage className="w-5 h-5 mr-2 text-gray-600" /> Uploaded Documents
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.entries(data.images as Record<string, string | null>).map(([key, url]) => (
                        <div
                            key={key}
                            className="relative group text-center border rounded-xl p-4 bg-white hover:shadow-lg transition"
                        >
                            {/* Title */}
                            <p className="capitalize font-medium text-sm mb-3 text-gray-700 truncate">
                                {key.replace(/_/g, ' ')}
                            </p>

                            {/* Download Button */}
                            {url && (
                                <button
                                    onClick={() => window.open(url, '_blank')}
                                    title="Download Image"
                                    className="absolute top-3 right-3 bg-white border border-gray-300 rounded-full p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                                        />
                                    </svg>
                                </button>
                            )}

                            {/* Image or Placeholder */}
                            {url ? (
                                <div className="relative w-full aspect-[4/2] overflow-hidden rounded-lg border">
                                    <Image
                                        src={url}
                                        alt={key}
                                        fill
                                        className="object-contain object-center transition-transform duration-200 group-hover:scale-[1.03]"
                                    />
                                </div>
                            ) : (
                                <div className="w-full aspect-[4/3] flex items-center justify-center border rounded-lg bg-gray-100 text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Booking History Section */}
            <div className="p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <List className="w-5 h-5 mr-2 text-indigo-600" /> Booking History
                </h3>

                {data.bookings && data.bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg text-sm">
                            <thead className="bg-indigo-100 text-gray-700">
                                <tr>
                                    <th className="p-3 text-left">Passenger</th>
                                    <th className="p-3 text-left">Type</th>
                                    <th className="p-3 text-left">Pickup</th>
                                    <th className="p-3 text-left">Drop</th>
                                    <th className="p-3 text-left">Fare</th>
                                    <th className="p-3 text-left">Status</th>
                                    <th className="p-3 text-left">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.bookings.map((booking: any, index: number) => (
                                    <tr
                                        key={index}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3">{booking.passenger_name}</td>
                                        <td className="p-3 capitalize">{booking.booking_type}</td>
                                        <td className="p-3">{booking.pickup_address}</td>
                                        <td className="p-3">{booking.drop_address}</td>
                                        <td className="p-3 flex items-center gap-1">
                                            <DollarSign className="w-3 h-3 text-green-500" />{" "}
                                            {booking.estimated_fare?.toFixed(2) || '-'}
                                        </td>
                                        <td className="p-3">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${booking.status === 'completed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : booking.status === 'cancelled'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-3 flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-gray-500" />{" "}
                                            {new Date(booking.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 italic">No bookings found for this owner.</p>
                )}
            </div>
        </div>
    );
}
