'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaEye, FaTrash } from 'react-icons/fa';
import { CabOwner, getCabOwners, deleteCabOwner } from '@/api/users/userApi';

const CabOwnersPage = () => {
  const [cabOwners, setCabOwners] = useState<CabOwner[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);
  const router = useRouter();

  // ✅ Fetch Cab Owners
  const fetchCabOwners = async () => {
    setLoading(true);
    try {
      const res = await getCabOwners();
      setCabOwners(res.status ? res.data : []);
      console.log(res);
      
    } catch (err) {
      toast.error('Failed to load Cab Owners');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchCabOwners();
      hasFetched.current = true;
    }
  }, []);

  // ✅ Handle Delete
  const handleDelete = (row: CabOwner) => {
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
          const res = await deleteCabOwner(row.id);
          if (res.status) {
            setCabOwners(cabOwners.filter((owner) => owner.id !== row.id));
          } else {
            toast.error(res.message || 'Failed to delete Cab Owner');
          }
        } catch (err) {
          console.error(err);
          toast.error('Error deleting Cab Owner');
        }
      }
    });
  };

// ✅ Handle View (Navigate to Details Page)
  const handleView = (id: number) => {
    router.push(`/admin/cab-owners/${id}`);
  };


  // ✅ DataTable Columns
  const columns: TableColumn<CabOwner>[] = [
    {
      name: 'S.No',
      cell: (_row, index) => index + 1,
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
      name: 'Vehicle',
      selector: (row) =>
        row.vehicle_make_name && row.vehicle_model_name
          ? `${row.vehicle_make_name} ${row.vehicle_model_name}`
          : 'N/A',
      sortable: true,
    },
    {
      name: 'Cab Type',
      selector: (row) => row.cab_type_name || 'N/A',
      sortable: true,
    },
    {
      name: 'Status',
      selector: (row) => row.status || 'offline',
      sortable: true,
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            row.status === 'online'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          {row.status || 'offline'}
        </span>
      ),
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
          {/* 👁️ View Button */}
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => handleView(row.user_id)}
          >
            <FaEye />
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="p-6 flex gap-6">
      <div className="w-full">
        <h2 className="text-xl font-bold mb-4">Cab Owners</h2>
        <DataTable
          columns={columns}
          data={cabOwners}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No Cab Owners Found"
        />
      </div>
    </div>
  );
};

export default CabOwnersPage;
