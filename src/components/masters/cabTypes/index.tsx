'use client';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  CabType,
  getCabTypesApi,
  createCabTypeApi,
  updateCabTypeApi,
  deleteCabTypeApi,
} from '@/api/masters/cabTypesAPI';

export default function CabTypePage() {
  const [cabTypes, setCabTypes] = useState<CabType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<CabType | null>(null);

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    fare_per_km: '',
    seating_capacity: '',
    luggage_capacity: '',
    thumbnail: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, thumbnail: file }));
  };

  const fetchCabTypes = async () => {
    setLoading(true);
    try {
      const res = await getCabTypesApi();
      setCabTypes(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'Error loading cab types');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category', form.category);
      formData.append('description', form.description);
      formData.append('fare_per_km', form.fare_per_km);
      formData.append('seating_capacity', form.seating_capacity);
      formData.append('luggage_capacity', form.luggage_capacity);
      if (form.thumbnail) formData.append('thumbnail', form.thumbnail);

      if (editItem) {
        await updateCabTypeApi(editItem.id!, formData);      
      } else {
        await createCabTypeApi(formData);       
      }

      resetForm();
      fetchCabTypes();
    } catch (err: any) {
      toast.error(err?.message || 'Submission failed');
    }
  };

  const handleEdit = (item: CabType) => {
    setEditItem(item);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      fare_per_km: item.fare_per_km,
      seating_capacity: item.seating_capacity,
      luggage_capacity: item.luggage_capacity,
      thumbnail: null,
    });
  };

  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Delete Cab Type?',
      text: 'Are you sure you want to delete this cab type?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCabTypeApi(id);
        // toast.success('Deleted successfully');
        fetchCabTypes();
      } catch (err: any) {
        toast.error(err?.message || 'Failed to delete');
      }
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      category: '',
      description: '',
      fare_per_km: '',
      seating_capacity: '',
      luggage_capacity: '',
      thumbnail: null,
    });
    setEditItem(null);
  };

  useEffect(() => {
    fetchCabTypes();
  }, []);

  const columns = [
    {
      name: 'Name',
      selector: (row: CabType) => row.name,
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row: CabType) => row.category,
    },
    {
      name: 'Seating',
      selector: (row: CabType) => row.seating_capacity,
    },
    {
      name: 'Luggage',
      selector: (row: CabType) => row.luggage_capacity,
    },
    {
      name: 'Actions',
      cell: (row: CabType) => (
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
          {editItem ? 'Edit Cab Type' : 'Add New Cab Type'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" encType="multipart/form-data">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} className="border px-3 py-2 rounded" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="fare_per_km" placeholder="Fare per Km" value={form.fare_per_km} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="seating_capacity" placeholder="Seating Capacity" value={form.seating_capacity} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="luggage_capacity" placeholder="Luggage Capacity" value={form.luggage_capacity} onChange={handleChange} className="border px-3 py-2 rounded" />
          <input name="thumbnail" type="file" onChange={handleFileChange} className="border px-3 py-2 rounded" />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editItem ? 'Update' : 'Add'}
          </button>
          {editItem && (
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Right: Table */}
      <div className="w-2/3">
        <DataTable
          columns={columns}
          data={cabTypes}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No Cab Types Found"
        />
      </div>
    </div>
  );
}
