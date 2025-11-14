import { useEffect, useState } from 'react';
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { EditLeadDialog } from './EditLeadDialog';
import type { Lead, User } from '../App';
import { api } from '../api';

interface FollowUpPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  currentUser: User;
  token:string;
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

export function FollowUpPage({ leads, setLeads, currentUser , token , allUser }: FollowUpPageProps) {
    useEffect(()=>{
    api.get('/followups/'+ currentUser._id , {
      headers : {
        Authorization : `Bearer ${token}`
      }
    })
    .then((res)=>{
      if(res && res.data && !res.data.error){
        const followUpData = res.data.followups;
        setFollowUp(followUpData);
        setodayLeads(followUpData.today);
        settomorrowLeads(followUpData.tomorrow);
        setupcomingLeads(followUpData.dayAfterTomorrow)
      }
    })
    .catch((err)=>{
      console.log(err);
    })
  },[])
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [followup , setFollowUp] = useState<any>('');
  const [todayLeads , setodayLeads] = useState<any>('');
  const [tomorrowLeads , settomorrowLeads] = useState<any>('');
  const [upcomingLeads , setupcomingLeads] = useState<any>('')
  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = (phone: string) => {
    const phoneNumber = phone.replace(/[^\d]/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prev => {
      const updated = prev.map(lead => lead._id === updatedLead._id ? updatedLead : lead);
      localStorage.setItem('crm_leads', JSON.stringify(updated));
      return updated;
    });
  };

  const renderLeadCard = (lead: Lead) => (
    <Card key={lead._id} className="p-4 hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-500">{lead.phone}</p>
            <p className="text-sm text-gray-500">{lead.email}</p>
          </div>
          <Badge className={statusColors[lead.status]}>
            {statusLabels[lead.status]}
          </Badge>
        </div>

        {lead.notes && (
          <p className="text-sm text-gray-600">{lead.notes}</p>
        )}

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCall(lead.phone)}
            className="flex-1"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleWhatsApp(lead.phone)}
            className="flex-1"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            WhatsApp
          </Button>
          <Button
            size="sm"
            onClick={() => {const leads = JSON.parse(JSON.stringify(lead));const id = leads.assignedTo._id;console.log(id,'i am id here okkay');delete leads.assignedTo;leads['assignedTo'] = id ; setEditingLead(leads) }}
            className="flex-1"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Follow-ups</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your scheduled follow-ups
        </p>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">
            Today ({todayLeads.length})
          </TabsTrigger>
          <TabsTrigger value="tomorrow">
            Tomorrow ({tomorrowLeads.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            Next 3 Days ({upcomingLeads.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-6">
          {todayLeads.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {todayLeads.map(renderLeadCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No follow-ups scheduled for today</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tomorrow" className="space-y-4 mt-6">
          {tomorrowLeads.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tomorrowLeads.map(renderLeadCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No follow-ups scheduled for tomorrow</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4 mt-6">
          {upcomingLeads.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingLeads.map(renderLeadCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No follow-ups in the next 3 days</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {editingLead && (
        <EditLeadDialog
        allUser={allUser}
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