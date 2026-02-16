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

import Button from '@/components/ui/button/Button';

export default function CabTypePage() {
  const [cabTypes, setCabTypes] = useState<CabType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<CabType | null>(null);

  const [form, setForm] = useState({
    name: '',
    standard_price: '',
    disability_feature_price: '',
    thumbnail: null as File | null,
  });

  // ========================
  // FORM HANDLERS
  // ========================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, thumbnail: file }));
  };

  // ========================
  // FETCH CAB TYPES
  // ========================
  const fetchCabTypes = async () => {
    setLoading(true);
    try {
      const res = await getCabTypesApi();
      setCabTypes(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load cab types');
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // SUBMIT FORM
  // ========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('standard_price', form.standard_price);
      formData.append(
        'disability_feature_price',
        form.disability_feature_price
      );

      if (form.thumbnail) {
        formData.append('thumbnail', form.thumbnail);
      }

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

  // ========================
  // EDIT CAB TYPE
  // ========================
  const handleEdit = (item: CabType) => {
    setEditItem(item);
    setForm({
      name: item.name,
      standard_price: item.standard_price,
      disability_feature_price: item.disability_feature_price,
      thumbnail: null,
    });
  };

  // ========================
  // DELETE CAB TYPE
  // ========================
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Delete Cab Type?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCabTypeApi(id);
        fetchCabTypes();
      } catch (err: any) {
        toast.error(err?.message || 'Delete failed');
      }
    }
  };

  // ========================
  // RESET FORM
  // ========================
  const resetForm = () => {
    setForm({
      name: '',
      standard_price: '',
      disability_feature_price: '',
      thumbnail: null,
    });
    setEditItem(null);
  };

  useEffect(() => {
    fetchCabTypes();
  }, []);

  // ========================
  // DATATABLE COLUMNS
  // ========================
  const columns = [
    {
      name: 'Name',
      selector: (row: CabType) => row.name,
      sortable: true,
    },
    {
      name: 'Standard Price',
      selector: (row: CabType) => row.standard_price,
    },
    {
      name: 'Disability Price',
      selector: (row: CabType) => row.disability_feature_price,
    },
    {
      name: 'Thumbnail',
      cell: (row: CabType) =>
        row.thumbnail_url ? (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGES_URL}/${row.thumbnail_url}`}
            alt={row.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          '—'
        ),
    },
    {
      name: 'Actions',
      cell: (row: CabType) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row.id!)}
            className="text-red-600"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

  // ========================
  // UI
  // ========================
  return (
    <div className="p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
      {/* FORM */}
      <div className="w-full lg:w-1/3 border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {editItem ? 'Edit Cab Type' : 'Add Cab Type'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          encType="multipart/form-data"
        >
          <input
            name="name"
            placeholder="Cab Type Name"
            value={form.name}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            name="standard_price"
            type="number"
            placeholder="Standard Price"
            value={form.standard_price}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            name="disability_feature_price"
            type="number"
            placeholder="Disability Feature Price"
            value={form.disability_feature_price}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border px-3 py-2 rounded"
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

      {/* TABLE */}
      <div className="w-full lg:w-2/3">
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
