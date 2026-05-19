import { useEffect, useState, useRef } from 'react';
import { leadService } from '../features/leads/LeadService';
import type { LeadFilterParams } from '../features/leads/LeadService';
import type { Lead } from '../types';
import gsap from 'gsap';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { LeadForm } from '../components/LeadForm';

export const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<LeadFilterParams>({ page: 1, limit: 10 });
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(params.search || "");
  const tableRef = useRef<HTMLDivElement>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLeads(params);
      setLeads(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.pages || Math.ceil(res.pagination.total / (params.limit || 10)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [params]);

  useEffect(() => {
    if (leads.length > 0 && tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      gsap.fromTo(rows,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [leads]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (params.search !== searchTerm) {
        setParams(prev => ({ ...prev, search: searchTerm, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadService.deleteLead(id);
        fetchLeads();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsFormOpen(true);
  };

  const handleNew = () => {
    setLeadToEdit(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and track your leads</p>
        </div>
        <button onClick={handleNew} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          <span>New Lead</span>
        </button>
      </div>

      <div className="card p-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <select 
              className="input-field"
              value={params.status || ""}
              onChange={(e) => setParams(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="lost">Lost</option>
            </select>
            <select 
              className="input-field"
              value={params.source || ""}
              onChange={(e) => setParams(prev => ({ ...prev, source: e.target.value, page: 1 }))}
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="instagram">Instagram</option>
              <option value="referral">Referral</option>
            </select>
            <select 
              className="input-field"
              value={params.sort || "latest"}
              onChange={(e) => setParams(prev => ({ ...prev, sort: e.target.value, page: 1 }))}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto" ref={tableRef}>
          {loading ? (
            <div className="py-10 text-center text-gray-500">Loading leads...</div>
          ) : leads.length === 0 ? (
            <div className="py-10 text-center text-gray-500">No leads found.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Source</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900 dark:text-gray-100 font-medium">{lead.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{lead.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize
                        ${lead.status === 'new' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
                        ${lead.status === 'qualified' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${lead.status === 'lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : ''}
                      `}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400 capitalize">{lead.source}</td>
                    <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(lead)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(lead._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-medium">{leads.length}</span> of <span className="font-medium">{total}</span> leads
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Page <span className="font-medium">{params.page}</span> of <span className="font-medium">{totalPages || 1}</span>
            </span>
            <div className="flex gap-2">
              <button 
                disabled={params.page === 1}
                onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) - 1 }))}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Prev
              </button>
              <button 
                disabled={params.page === totalPages || totalPages === 0}
                onClick={() => setParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-md disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <LeadForm 
        isOpen={isFormOpen} 
        onClose={() => {
          setIsFormOpen(false);
          setLeadToEdit(null);
        }} 
        onSuccess={fetchLeads}
        leadToEdit={leadToEdit}
      />
    </div>
  );
};
