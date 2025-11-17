'use client';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Button from '@/components/ui/button/Button';

import {
  VehicleModel,
  getVehicleModelsApi,
  createVehicleModelApi,
  updateVehicleModelApi,
  deleteVehicleModelApi,
} from '@/api/masters/vehicleModelAPI';

import { VehicleMake, getVehicleMakesApi } from '@/api/masters/vehicleMakesAPI';

export default function VehicleModelsPage() {
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<VehicleModel | null>(null);

  const [form, setForm] = useState({
    make_id: '',
    name: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const fetchVehicleMakes = async () => {
    try {
      const res = await getVehicleMakesApi();
      setVehicleMakes(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'Error loading vehicle makes');
    }
  };

  const fetchVehicleModels = async () => {
    setLoading(true);
    try {
      const res = await getVehicleModelsApi();
      setVehicleModels(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'Error loading vehicle models');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.make_id || !form.name) {
      toast.error('Please select a make and enter a model name');
      return;
    }

    try {
      const payload = {
        make_id: Number(form.make_id),
        name: form.name,
      };

      if (editItem) {
        await updateVehicleModelApi(editItem.id!, payload);
        toast.success('Vehicle model updated successfully!');
      } else {
        await createVehicleModelApi(payload);
        toast.success('Vehicle model created successfully!');
      }

      resetForm();
      fetchVehicleModels();
    } catch (err: any) {
      toast.error(err?.message || 'Submission failed');
    }
  };

  const handleEdit = (item: VehicleModel) => {
    setEditItem(item);
    setForm({
      make_id: String(item.make_id),
      name: item.name,
    });
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Delete Vehicle Model?',
      text: 'Are you sure you want to delete this vehicle model?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteVehicleModelApi(id);
        toast.success('Deleted successfully');
        fetchVehicleModels();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setForm({ make_id: '', name: '' });
    setEditItem(null);
  };

  useEffect(() => {
    fetchVehicleMakes();
    fetchVehicleModels();
  }, []);

  const columns = [
    {
      name: 'Model Name',
      selector: (row: VehicleModel) => row.name,
      sortable: true,
    },
    {
      name: 'Make Name',
      selector: (row: VehicleModel) => row.make_name || '—',
    },
    {
      name: 'Actions',
      cell: (row: VehicleModel) => (
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
    <div className="p-6 flex gap-6">
      {/* Left: Form */}
      <div className="w-1/3 border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {editItem ? 'Edit Vehicle Model' : 'Add New Vehicle Model'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <select
            name="make_id"
            value={form.make_id}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          >
            <option value="">Select Vehicle Make</option>
            {vehicleMakes.map(make => (
              <option key={make.id} value={make.id}>
                {make.name}
              </option>
            ))}
          </select>

          <input
            name="name"
            placeholder="Vehicle Model Name"
            value={form.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <Button type="submit">{editItem ? 'Update' : 'Add'}</Button>

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
      <div className="w-2/3">
        <DataTable
          columns={columns}
          data={vehicleModels}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No Vehicle Models Found"
        />
      </div>
    </div>
  );
}
