'use client';

import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';

import {
  CancellationRule,
  getCancellationRulesApi,
  createCancellationRuleApi,
  updateCancellationRuleApi,
  deleteCancellationRuleApi,
} from '@/api/masters/cancellationRulesAPI';

import Button from '@/components/ui/button/Button';

export default function CancellationRules() {
  const [rules, setRules] = useState<CancellationRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [editItem, setEditItem] = useState<CancellationRule | null>(null);

  const [form, setForm] = useState({
    deduction_percentage: '',
    minimum_deduction_amount: '',
    active: true,
  });

  // ========================
  // FORM HANDLERS
  // ========================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ========================
  // FETCH RULES
  // ========================
  const fetchRules = async () => {
    setLoading(true);
    try {
      const res = await getCancellationRulesApi();
      setRules(res.data);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to load cancellation rules');
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
      const payload = {
        deduction_percentage: form.deduction_percentage,
        minimum_deduction_amount: form.minimum_deduction_amount,
        active: form.active,
      };

      if (editItem) {
        await updateCancellationRuleApi(editItem.id!, payload);
      } else {
        await createCancellationRuleApi(payload);
      }

      resetForm();
      fetchRules();
    } catch (err: any) {
      toast.error(err?.message || 'Submission failed');
    }
  };

  // ========================
  // EDIT
  // ========================
  const handleEdit = (item: CancellationRule) => {
    setEditItem(item);
    setForm({
      deduction_percentage: item.deduction_percentage,
      minimum_deduction_amount: item.minimum_deduction_amount,
      active: item.active,
    });
  };

  // ========================
  // DELETE
  // ========================
  const handleDelete = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'Delete Cancellation Rule?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteCancellationRuleApi(id);
        fetchRules();
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
      deduction_percentage: '',
      minimum_deduction_amount: '',
      active: true,
    });
    setEditItem(null);
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // ========================
  // DATATABLE COLUMNS
  // ========================
  const columns = [
    {
      name: 'Deduction (%)',
      selector: (row: CancellationRule) =>
        `${row.deduction_percentage}%`,
      sortable: true,
    },
    {
      name: 'Minimum Amount',
      selector: (row: CancellationRule) =>
        `₹${row.minimum_deduction_amount}`,
    },
    {
      name: 'Status',
      selector: (row: CancellationRule) =>
        row.active ? 'Active' : 'Inactive',
      cell: (row: CancellationRule) => (
        <span
          className={`px-2 py-1 rounded text-xs ${row.active
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-200 text-gray-700'
            }`}
        >
          {row.active ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      name: 'Actions',
      cell: (row: CancellationRule) => (
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
          {editItem
            ? 'Edit Cancellation Rule'
            : 'Add Cancellation Rule'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            name="deduction_percentage"
            type="number"
            step="0.01"
            placeholder="Deduction Percentage (%)"
            value={form.deduction_percentage}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <input
            name="minimum_deduction_amount"
            type="number"
            step="0.01"
            placeholder="Minimum Deduction Amount"
            value={form.minimum_deduction_amount}
            onChange={handleChange}
            className="border px-3 py-2 rounded"
            required
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Active
          </label>

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
          data={rules}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No Cancellation Rules Found"
        />
      </div>
    </div>
  );
}
