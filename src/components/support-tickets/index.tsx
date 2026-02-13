'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import { getSupportTicktetApi, updateStatus } from '@/api/legalContent/support_ticket_api';
import Button from '../ui/button/Button';
import { SupportTicket } from '@/api/legalContent/support_ticket_api';

export default function SupportTicketPage() {
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  // ✅ Fetch all support tickets
  const fetchSupportTickets = async () => {
    setLoading(true);
    try {
      const res = await getSupportTicktetApi();
      setSupportTickets(res.status ? res.data : []);
    } catch (err) {
      toast.error('Failed to load Support Tickets.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update ticket status
  const handleStatusChange = async (ticket: SupportTicket, newStatus: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Change status of "${ticket.subject}" to "${newStatus}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, change it'
    });

    if (!result.isConfirmed) return;

    try {
      const res = await updateStatus(ticket.id!, { ...ticket, status: newStatus });
      if (res.status) {
        setSupportTickets((prev) =>
          prev.map((t) =>
            t.id === ticket.id ? { ...t, status: newStatus } : t
          )
        );
      } else {
        toast.error('Failed to update status.');
      }
    } catch (err) {
      toast.error('Error updating ticket status.');
      console.error(err);
    }
  };

  // ✅ Fetch tickets on mount
  useEffect(() => {
    if (!hasFetched.current) {
      fetchSupportTickets();
      hasFetched.current = true;
    }
  }, []);

  // ✅ DataTable Columns
  const columns: TableColumn<SupportTicket>[] = [
    { name: 'S.No', cell: (_row, index) => index + 1, width: '60px' },
    { name: 'Subject', selector: (row) => row.subject, sortable: true, grow: 2 },
    {
      name: 'Message',
      selector: (row) => row.message,
      wrap: true,
      grow: 3,
      cell: (row) => (
        <div className="max-h-20 overflow-hidden text-gray-700">
          {row.message}
        </div>
      )
    },
    {
      name: 'Status',
      selector: (row) => row.status,
      grow: 1,
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      )
    },
    {
      name: 'Created At',
      selector: (row) => new Date(row.created_at || '').toLocaleString(),
      width: '200px'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Support Tickets</h2>

      <div className="bg-white p-4 rounded shadow">
        <DataTable
          columns={columns}
          data={supportTickets}
          progressPending={loading}
          pagination
          highlightOnHover
          persistTableHead
          noDataComponent="No Support Tickets found."
        />
      </div>
    </div>
  );
}
