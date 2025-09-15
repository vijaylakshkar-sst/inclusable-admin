'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { NdisMember, getNdisMembers, deleteUser } from '@/api/users/userApi';

const NdisUsersPage = () => {
    const [ndisMembers, setNdisMembers] = useState<NdisMember[]>([]);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    // Fetch NDIS Members
    const fetchNdisMembers = async () => {
        setLoading(true);
        try {
            const res = await getNdisMembers();
            setNdisMembers(res.status ? res.data : []);
        } catch (err) {
            toast.error('Failed to load NDIS Members');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasFetched.current) {
            fetchNdisMembers();
            hasFetched.current = true;
        }
    }, []);

   const columns: TableColumn<NdisMember>[] = [
    {
        name: 'S.No',
        cell: (_row, index) => index + 1,
        width: '70px',
        sortable: false,
    },
    {
        name: 'Profile',
        cell: (row) => (
        <img
            src={
            row.profile_image
                ? `${process.env.NEXT_PUBLIC_IMAGES_URL}/uploads/${row.profile_image}`
                : '/images/avatar.png'
            }
            alt={row.full_name}
            className="w-10 h-10 rounded-full object-cover"
        />
        ),
        width: '70px',
    },
    {
        name: 'Name',
        selector: (row) => row.full_name,
        sortable: true,
    },
    {
        name: 'Email',
        selector: (row) => row.email,
        sortable: true,
    },
    {
        name: 'Phone',
        selector: (row) => row.phone_number,
        sortable: true,
    },
    {
        name: 'Gender',
        selector: (row) => row.gender || 'N/A',
        sortable: true,
    },
    {
        name: 'Actions',
        cell: (row) => (
        <div className="flex items-center space-x-2">
            <button
            className="text-red-500 hover:text-red-700"
            onClick={() => handleDelete(row)}
            >
            <FaTrash />
            </button>
        </div>
        ),
    },
    ];

    const handleEdit = (row: NdisMember) => {
        console.log('Edit NDIS Member:', row);
    };

    const handleDelete = (row: NdisMember) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${row.full_name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await deleteUser(row.id);
                    if (res.status) {
                        toast.success('Member deleted successfully');
                        setNdisMembers(ndisMembers.filter((m) => m.id !== row.id));
                    } else {
                        toast.error(res.message || 'Failed to delete member');
                    }
                } catch (err) {
                    console.error(err);
                    toast.error('Error deleting member');
                }
            }
        });
    };

    return (
        <div className="p-6 flex gap-6">
            <div className="w-full ">
                <h2 className="text-xl font-bold mb-4">NDIS Members</h2>
                <DataTable
                    columns={columns}
                    data={ndisMembers}
                    progressPending={loading}
                    pagination
                />
            </div>
        </div>
    );
};

export default NdisUsersPage;
