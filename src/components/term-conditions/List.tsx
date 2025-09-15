'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import {
  TermCondition,
  getTermsApi,
  deleteTermApi,
  createTermApi,
  updateTermApi
} from '@/api/legalContent/term_condition_api';
import Tiptap from '../Tiptap';

export default function TermsListPage() {
  const [terms, setTerms] = useState<TermCondition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTerm, setEditingTerm] = useState<TermCondition | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const hasFetched = useRef(false);

  // Fetch terms
  const fetchTerms = async () => {
    setLoading(true);
    try {
      const res = await getTermsApi();
      setTerms(res.status ? res.data : []);
    } catch (err) {
      toast.error('Failed to load terms.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete term
  const handleDelete = async (term: TermCondition) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${term.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteTermApi(term.id!);
      if (res.status) {
        toast.success(`Term "${term.title}" deleted successfully.`);
        setTerms((prev) => prev.filter((t) => t.id !== term.id));
      } else {
        toast.error('Failed to delete: ' + res.data);
      }
    } catch (err) {
      toast.error('Error deleting term.');
      console.error(err);
    }
  };

  // Submit add/edit term
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanContent = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim() || !cleanContent) {
      toast.error('Title and Content are required.');
      return;
    }

    try {
      if (editingTerm) {
        const res = await updateTermApi(editingTerm.id!, { title, content });
        if (res.status) {
          toast.success('Term updated successfully.');
          setTerms((prev) =>
            prev.map((t) =>
              t.id === editingTerm.id ? { ...t, title, content } : t
            )
          );
        }
      } else {
        const res = await createTermApi({ title, content });
        if (res.status) {
          toast.success('Term created successfully.');
          setTerms((prev) => [...prev, res.data]);
        }
      }

      setTitle('');
      setContent('');
      setEditingTerm(null);
    } catch (err) {
      toast.error('Error saving term.');
      console.error(err);
    }
  };

  // Start editing a term
  const handleEdit = (term: TermCondition) => {
    setEditingTerm(term);
    setTitle(term.title);
    setContent(term.content);
  };

  // Fetch terms on mount
  useEffect(() => {
    if (!hasFetched.current) {
      fetchTerms();
      hasFetched.current = true;
    }
  }, []);

  // DataTable columns
  const columns: TableColumn<TermCondition>[] = [
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
          {editingTerm ? 'Edit Term' : 'Add New Term'}
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
                key={editingTerm?.id ?? 'new'} // remounts editor on edit
                content={content}
                onUpdate={(html) => setContent(html)}
                />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingTerm ? 'Update Term' : 'Add Term'}
          </button>
          {editingTerm && (
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditingTerm(null);
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
          data={terms}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No terms found."
        />
      </div>
    </div>
  );
}
