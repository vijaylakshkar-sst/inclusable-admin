'use client';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  VehicleMake,
  getVehicleMakesApi,
  createVehicleMakeApi,
  updateVehicleMakeApi,
  deleteVehicleMakeApi,
} from '@/api/masters/vehicleMakesAPI';
import Button from '@/components/ui/button/Button';

export default function VehicleMakesPage() {
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<VehicleMake | null>(null);
  const [form, setForm] = useState({ name: '' });

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Fetch all Vehicle Makes
  const fetchVehicleMakes = async () => {
    setLoading(true);
    try {
      const res = await getVehicleMakesApi();
      setVehicleMakes(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'Error loading vehicle makes');
    } finally {
      setLoading(false);
    }
  };

  // Create or Update Vehicle Make
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);

      if (editItem) {
        await updateVehicleMakeApi(editItem.id!, formData);
      } else {
        await createVehicleMakeApi(formData);
      }

      resetForm();
      fetchVehicleMakes();
    } catch (err: any) {
      toast.error(err?.message || 'Submission failed');
    }
  };

  // Edit Vehicle Make
  const handleEdit = (item: VehicleMake) => {
    setEditItem(item);
    setForm({ name: item.name });
  };

  // Delete Vehicle Make
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Delete Vehicle Make?',
      text: 'Are you sure you want to delete this vehicle make?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteVehicleMakeApi(id);
        fetchVehicleMakes();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setForm({ name: '' });
    setEditItem(null);
  };

  useEffect(() => {
    fetchVehicleMakes();
  }, []);

  // DataTable Columns
  const columns = [
    {
      name: 'Name',
      selector: (row: VehicleMake) => row.name,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row: VehicleMake) => new Date(row.created_at || '').toLocaleString(),
    },
    {
      name: 'Actions',
      cell: (row: VehicleMake) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(row)} className="text-blue-600">
            <FaEdit />
          </button>
          <button onClick={() => handleDelete(row.id!)} className="text-red-600">
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
      {/* Left: Form */}
      <div className="w-full lg:w-1/3 border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {editItem ? 'Edit Vehicle Make' : 'Add New Vehicle Make'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Vehicle Make Name"
            value={form.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <Button type="submit">
            {editItem ? 'Update' : 'Add'}
          </Button>

          {editItem && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Right: Table */}
      <div className="w-full lg:w-2/3">
        <DataTable
          columns={columns}
          data={vehicleMakes}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No Vehicle Makes Found"
        />
      </div>
    </div>
  );
}
