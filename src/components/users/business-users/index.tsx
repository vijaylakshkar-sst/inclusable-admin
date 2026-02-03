'use client';

import { useEffect, useState, useRef } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import toast from 'react-hot-toast';
import { FaTrash, FaDownload } from 'react-icons/fa';
import { BusinessMember, getBusinessMembers, deleteUser, eventByBusiness, deleteEvent } from '@/api/users/userApi';
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

  const WrapText = ({ text }: { text: any }) => (
  <div className="whitespace-normal break-words leading-snug max-w-[300px]">
    {text || 'N/A'}
  </div>
);

  const BusinessColumns: TableColumn<BusinessMember>[] = [
  {
    name: 'Actions',
    cell: (row) => (
      <button onClick={() => handleDelete(row)} className="text-red-500 hover:text-red-700">
        <FaTrash />
      </button>
    ),
  },
  {
    name: 'Name',
    cell: (row) => <WrapText text={row.full_name} />,
    sortable: true,
  },
  {
    name: 'Business Name',
    cell: (row) => <WrapText text={row.business_name} />,
    sortable: true,
  },
  {
    name: 'Category',
    cell: (row) => <WrapText text={row.business_category} />,
    sortable: true,
    grow: 2,
  },
  {
    name: 'Business Email',
    cell: (row) => <WrapText text={row.business_email} />,
    sortable: true,
  },
  {
    name: 'ABN Number',
    selector: (row) => row.abn_number || 'N/A',
  },
  {
    name: 'Experience',
    selector: (row) => `${row.year_experience} Years`,
  },
];

  const EventColumns: TableColumn<any>[] = [
  {
    name: 'Event Name',
    cell: (e) => <WrapText text={e.event_name} />,
  },
  {
    name: 'Address',
    cell: (e) => <WrapText text={e.event_address} />,
  },
  { name: 'Start Date', selector: (e) => e.start_date },
  { name: 'End Date', selector: (e) => e.end_date },
  { name: 'Start Time', selector: (e) => e.start_time },
  { name: 'End Time', selector: (e) => e.end_time },
  { name: 'Price', selector: (e) => `${e.price || ''} AUD` },
  {
    name: 'Actions',
    cell: (row) => (
      <button className="text-red-500" onClick={() => handleDeleteEvent(row)}>
        <FaTrash />
      </button>
    ),
    width: '70px',
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


  const normalizeCategories = (category: any): string[] => {
    if (!category) return [];

    if (Array.isArray(category)) {
      return category.map((c) => String(c).trim());
    }

    if (typeof category === 'string') {
      return category.split(',').map((c) => c.trim());
    }

    return [];
  };

  const uniqueCategories = Array.from(
    new Set(
      businessMembers.flatMap((m) =>
        normalizeCategories(m.business_category)
      )
    )
  );

  const filteredData = businessMembers.filter((member) =>
    (
      member.full_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.business_name?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.business_email?.toLowerCase().includes(searchText.toLowerCase()) ||
      member.abn_number?.toLowerCase().includes(searchText.toLowerCase()) ||
      String(member.business_category || '').toLowerCase().includes(searchText.toLowerCase())
    ) &&
    (categoryFilter
      ? member.business_category
        ?.split(',')
        .map((c) => c.trim())
        .includes(categoryFilter)
      : true)
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
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full md:w-[300px] px-3 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-400"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border rounded min-w-[180px]"
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
          className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded hover:bg-blue-700 flex items-center gap-1"
        >
          <FaDownload size={14} /> Export
        </button>
      </div>
      <div className="w-full overflow-x-auto">
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
    </div>
  );
};
export default BusinessUsersPage;
