import { useState } from 'react';
import { Plus, Search, Filter } from "lucide-react";
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { AddLeadDialog } from './AddLeadDialog';
import { EditLeadDialog } from './EditLeadDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import type { Lead, User } from '../App';
import {api} from '../api';

interface LeadListProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  currentUser: User;
  allUser:User[];
}

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  interested: 'bg-green-100 text-green-800',
  not_interested: 'bg-red-100 text-red-800',
  closed: 'bg-purple-100 text-purple-800',
  site_visit: 'bg-orange-100 text-orange-800',
};

const statusLabels = {
  new: 'New',
  interested: 'Interested',
  not_interested: 'Not Interested',
  closed: 'Closed',
  site_visit: 'Site Visit',
};

export function LeadList({ leads, setLeads, currentUser , allUser }: LeadListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
    const authData = JSON.parse(localStorage.getItem('authData') || '[]')

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'createdAt' | 'timeline'>) => {
    const lead: Lead = {
      ...newLead,
      createdAt: new Date().toISOString(),
      timeline: [
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          userId: currentUser._id,
          userName: currentUser.name,
          action: 'Lead Created',
          details: 'Initial contact established',
        },
      ],
    };
    console.log(lead,'fsdfasfsafasfasfasfasdsfad');
    setLeads(prev => {
      const updated = [...prev, lead];
      localStorage.setItem('crm_leads', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    console.log(updatedLead,'i am the updated lead');
    api.put(`/leads/${updatedLead._id}`,updatedLead,{
      headers : {
        Authorization : `Bearer ${authData.token}`
      }
    })
    .then((res)=>{
      // setLeads(res.data.lead)
      getLeadsAndUpdate();
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    })
    // setLeads(prev => {
    //   const updated = prev.map(lead => lead._id === updatedLead._id ? updatedLead : lead);
    //   localStorage.setItem('crm_leads', JSON.stringify(updated));
    //   return updated;
    // });
  };

  const getLeadsAndUpdate = () => {
      api.get('/leads/',{
      headers : {
        Authorization : `Bearer ${authData.token}`
      }
    })
    .then((res)=>{
      setLeads(res.data.leads)
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Leads</h2>
          <p className="text-sm text-gray-500 mt-1">
            {currentUser.role === 'admin' ? 'All leads in the system' : 'Your assigned leads'}
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="interested">Interested</TabsTrigger>
          <TabsTrigger value="not_interested" className="text-xs lg:text-sm">Not Interested</TabsTrigger>
          <TabsTrigger value="site_visit" className="text-xs lg:text-sm">Site Visit</TabsTrigger>
          <TabsTrigger value="closed">Closed</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
          <Card
            key={lead._id}
            className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setEditingLead(lead)}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-gray-900">{lead.name}</h3>
                  <p className="text-sm text-gray-500">{lead.phone}</p>
                </div>
                <Badge className={statusColors[lead.status]}>
                  {statusLabels[lead.status]}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{lead.email}</p>
                <p className="text-sm text-gray-500">
                  Follow-up: {new Date(lead.followUp).toLocaleDateString()}
                </p>
              </div>

              {lead.notes && (
                <p className="text-sm text-gray-600 line-clamp-2">{lead.notes}</p>
              )}

              {/* {lead.siteVisitPhotos && lead.siteVisitPhotos.length > 0 && (
                <div className="flex gap-2">
                  {lead.siteVisitPhotos.slice(0, 3).map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt={`Site visit ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ))}
                </div>
              )} */}
            </div>
          </Card>
        ))}
      </div>

      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found</p>
        </div>
      )}

      <AddLeadDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddLead={handleAddLead}
        currentUser={currentUser}
        allUser={allUser}
      />

      {editingLead && (
        <EditLeadDialog allUser={allUser}
          open={!!editingLead}
          onOpenChange={(open) => !open && setEditingLead(null)}
          lead={editingLead}
          onUpdateLead={handleUpdateLead}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}