'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { PrivacyPolicy, getPrivacyPolicysApi, updatePrivacyPolicyApi, deletePrivacyPolicyApi, createPrivacyPolicyApi } from '@/api/legalContent/privacy_policy_api';
import Tiptap from '../Tiptap';

export default function PrivacyPolicyPage() {
  const [privacyPolicies, setPrivacyPolicies] = useState<PrivacyPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [editPrivacyPolicy, setEditPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const hasFetched = useRef(false);

  // Fetch privacyPolicies
  const fetchprivacyPolicies = async () => {
    setLoading(true);
    try {
      const res = await getPrivacyPolicysApi();
      setPrivacyPolicies(res.status ? res.data : []);
    } catch (err) {
      toast.error('Failed to load Privacy Policies.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete Privacy Policy
  const handleDelete = async (privacy: PrivacyPolicy) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${privacy.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deletePrivacyPolicyApi(privacy.id!);
      if (res.status) {
        toast.success(`Privacy Policy "${privacy.title}" deleted successfully.`);
        setPrivacyPolicies((prev) => prev.filter((t) => t.id !== privacy.id));
      } else {
        toast.error('Failed to delete: ' + res.data);
      }
    } catch (err) {
      toast.error('Error deleting Privacy Policy.');
      console.error(err);
    }
  };

  // Submit add/edit Privacy Policy
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim() || !cleanContent) {
      toast.error('Title and Content are required.');
      return;
    }

    try {
      if (editPrivacyPolicy) {
        const res = await updatePrivacyPolicyApi(editPrivacyPolicy.id!, { title, content });
        if (res.status) {
          toast.success('Privacy Policy updated successfully.');
          setPrivacyPolicies((prev) =>
            prev.map((t) =>
              t.id === editPrivacyPolicy.id ? { ...t, title, content } : t
            )
          );
        }
      } else {
        const res = await createPrivacyPolicyApi({ title, content });
        if (res.status) {
          toast.success('Privacy Policy created successfully.');
          setPrivacyPolicies((prev) => [...prev, res.data]);
        }
      }

      setTitle('');
      setContent('');
      setEditPrivacyPolicy(null);
    } catch (err) {
      toast.error('Error saving Privacy Policy.');
      console.error(err);
    }
  };

  // Start editing a term
  const handleEdit = (privacy: PrivacyPolicy) => {
    setEditPrivacyPolicy(privacy);
    setTitle(privacy.title);
    setContent(privacy.content);
  };

  // Fetch privacy Policies on mount
  useEffect(() => {
    if (!hasFetched.current) {
      fetchprivacyPolicies();
      hasFetched.current = true;
    }
  }, []);

  // DataTable columns
  const columns: TableColumn<PrivacyPolicy>[] = [
    { name: 'S.No', cell: (_row, index) => index + 1, width: '60px' },
    { name: 'Title', selector: (row) => row.title, sortable: true, grow: 2 },
    {
      name: 'Content',
      selector: (row) => row.content,
      wrap: true,
      grow: 3,
      cell: (row) => (
        <div
          className="max-h-20 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: row.content }}
        />
      )
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTrash size={18} />
          </button>
        </div>
      ),
      width: '120px'
    }
  ];

  return (
    <div className="p-6 flex gap-6">
      {/* Left side: form */}
      <div className="w-1/3 border p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-4">
          {editPrivacyPolicy ? 'Edit Term' : 'Add New Term'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <div className="mb-2 border rounded">
            <Tiptap
                key={editPrivacyPolicy?.id ?? 'new'} // remounts editor on edit
                content={content}
                onUpdate={(html) => setContent(html)}
                />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editPrivacyPolicy ? 'Update Term' : 'Add Term'}
          </button>
          {editPrivacyPolicy && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditPrivacyPolicy(null);
                setTitle('');
                setContent('');
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Right side: DataTable */}
      <div className="w-2/3">
        <DataTable
          columns={columns}
          data={privacyPolicies}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No Privacy Policies found."
        />
      </div>
    </div>
  );
}
