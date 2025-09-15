'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { BusinessMember, getBusinessMembers, deleteUser, eventByBusiness,deleteEvent } from '@/api/users/userApi';
import Papa from 'papaparse';
import Swal from 'sweetalert2';

const BusinessUsersPage = () => {
  const [businessMembers, setBusinessMembers] = useState<BusinessMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const hasFetched = useRef(false);
  const [expandedRows, setExpandedRows] = useState<{ [key: number]: any[] }>({});

  const fetchBusinessMembers = async () => {
    setLoading(true);
    try {
      const res = await getBusinessMembers();
      setBusinessMembers(res.status ? res.data : []);
    } catch (err) {
      toast.error('Failed to load Business Members');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchBusinessMembers();
      hasFetched.current = true;
    }
  }, []);

const handleDelete = async (row: BusinessMember) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Delete Business Member: ${row.full_name}?`,
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
          setBusinessMembers(businessMembers.filter((m) => m.id !== row.id));
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

  const fetchEvents = async (row: BusinessMember) => {
    if (!expandedRows[row.id]) {
      try {
        const res = await eventByBusiness(row.id);
        setExpandedRows((prev) => ({
          ...prev,
          [row.id]: res.status && res.data.events ? res.data.events : [],
        }));
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch events');
      }
    }
  };

  const BusinessColumns: TableColumn<BusinessMember>[] = [
    {
      name: 'Actions',
      cell: (row) => (
        <button onClick={() => handleDelete(row)} className="text-red-500 hover:text-red-700">
          <FaTrash />
        </button>
      ),
      width: '80px',
    },
    { name: 'Name', selector: (row) => row.full_name, sortable: true },
    { name: 'Business Name', selector: (row) => row.business_name, sortable: true },
    {
      name: 'Category',
      selector: (row) => row.business_category,
      sortable: true,
    },
    { name: 'Business Email', selector: (row) => row.business_email || 'N/A', sortable: true },
    { name: 'ABN Number', selector: (row) => row.abn_number || 'N/A', sortable: true },
    { name: 'Year Experience', selector: (row) => `${row.year_experience} Years`, sortable: true },
  ];

  const EventColumns: TableColumn<any>[] = [    
    { name: 'Event Name', selector: (e) => e.event_name, sortable: true },
    { name: 'Start Date', selector: (e) => e.start_date, sortable: true },
    { name: 'End Date', selector: (e) => e.end_date, sortable: true },
    { name: 'Start Time', selector: (e) => e.start_time, sortable: true },
    { name: 'End Time', selector: (e) => e.end_time, sortable: true },
    { name: 'Address', selector: (e) => e.event_address, sortable: true },
    { name: 'Price', selector: (e) => `${e.price || ''} AUD`, sortable: true },
    { name: 'Price Type', selector: (e) => `${e.price_type}`, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => handleDeleteEvent(row)}
        >
          <FaTrash />
        </button>
      ),
      width: '80px',
    },
  ];

  const ExpandedComponent = ({ data }: { data: BusinessMember }) => {
    const events = expandedRows[data.id] || [];
    return (
      <div className="p-2 bg-gray-50 rounded-md border mt-2">
        <DataTable
          columns={EventColumns}
          data={events}
          noHeader
          pagination
          paginationPerPage={5}
          striped
          highlightOnHover
          className="bg-gray-50"
        />
      </div>
    );
  };

  const uniqueCategories = [...new Set(businessMembers.map((m) => m.business_category).filter(Boolean))];

  const filteredData = businessMembers.filter((member) =>
    (member.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.business_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.business_email?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.abn_number?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.business_category?.toLowerCase().includes(searchText.toLowerCase())) &&
    (categoryFilter ? member.business_category === categoryFilter : true)
  );

  const handleDeleteEvent = async (event: any) => {
  Swal.fire({
    title: 'Are you sure?',
    text: `Delete Event: ${event.event_name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await deleteEvent(event.event_id);
        if (res.status) {
          toast.success('Event deleted successfully');
          setExpandedRows((prev) => {
            const updated = { ...prev };
            for (const businessId in updated) {
              updated[businessId] = updated[businessId].filter((e) => e.event_id !== event.event_id);
            }
            return updated;
          });
        } else {
          toast.error(res.message || 'Failed to delete event');
        }
      } catch (err) {
        console.error(err);
        toast.error('Error deleting event');
      }
    }
  });
};

 const handleExport = async () => {
    const allData: any[] = [];
    let serial = 1;

    for (const member of filteredData) {
        let events: any[] = [];

        // Fetch events if not already fetched
        if (!expandedRows[member.id]) {
        try {
            const res = await eventByBusiness(member.id);
            if (res.status && res.data.events) {
            events = res.data.events;
            setExpandedRows((prev) => ({ ...prev, [member.id]: events }));
            }
        } catch (err) {
            console.error('Error fetching events for export:', err);
        }
        } else {
        events = expandedRows[member.id];
        }

        // Flatten: 1 row per event (or 1 row if no event)
        if (events.length) {
        events.forEach((event) => {
            allData.push({
            SNo: serial++,
            MemberName: member.full_name,
            BusinessName: member.business_name,
            Category: member.business_category,
            Email: member.business_email,
            ABN: member.abn_number,
            Experience: `${member.year_experience} Years`,

            EventName: event.event_name,
            StartDate: event.start_date,
            EndDate: event.end_date,
            StartTime: event.start_time,
            EndTime: event.end_time,
            Address: event.event_address,
            Price: `${event.price || ''} AUD`,
            PriceType: event.price_type,
            });
        });
        } else {
        allData.push({
            SNo: serial++,
            MemberName: member.full_name,
            BusinessName: member.business_name,
            Category: member.business_category,
            Email: member.business_email,
            ABN: member.abn_number,
            Experience: `${member.year_experience} Years`,

            EventName: '',
            StartDate: '',
            EndDate: '',
            StartTime: '',
            EndTime: '',
            Address: '',
            Price: '',
            PriceType: '',
        });
        }
    }

    const csv = Papa.unparse(allData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'business_members_with_events.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Business Members</h2>

      {/* 🔍 Search and Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name, business, email, ABN, category..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button
          onClick={handleExport}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <FaDownload /> Export
        </button>
      </div>

      <DataTable
        columns={BusinessColumns}
        data={filteredData}
        progressPending={loading}
        pagination
        expandableRows
        expandableRowsComponent={ExpandedComponent}
        onRowExpandToggled={(expanded, row) => {
          if (expanded) fetchEvents(row);
        }}
        striped
        highlightOnHover
        customStyles={{
          headRow: {
            style: {
              backgroundColor: '#E5E7EB',
            },
          },
          rows: {
            style: {
              backgroundColor: '#FFFFFF',
            },
          },
        }}
      />
    </div>
  );
};

export default BusinessUsersPage;
