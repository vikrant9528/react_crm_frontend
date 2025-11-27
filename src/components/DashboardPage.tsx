import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import type { Lead, User } from '../App';

interface DashboardPageProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  currentUser: User;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function DashboardPage({ leads, currentUser }: DashboardPageProps) {
    const allLeads = JSON.parse(JSON.stringify(leads));
    console.log(leads,'we are leads in the dasboard page original component');
  // Get all users for the employee breakdown
  const allUsers = JSON.parse(localStorage.getItem('crm_users') || '[]');
  
  // Calculate stats
  const totalLeads = leads.length;
  const completedLeads = leads.filter(lead => lead.status === 'closed').length;
  const activeLeads = leads.filter(lead => lead.status !== 'closed' && lead.status !== 'not_interested').length;
  const newLeads = leads.filter(lead => lead.status === 'new').length;

  // Leads by employee
  const leadsPerEmployee = allUsers.map((user: any) => {
    const userLeads = allLeads.filter(lead => lead.assignedTo._id === user._id);
    const completedCount = userLeads.filter(lead => lead.status === 'closed').length;
    console.log(userLeads , completedCount , 'asdfjasjfkasfkjfasfhasjfhaslfashflk')
    return {
      name: user.name,
      total: userLeads.length,
      completed: completedCount,
    };
  }).filter((data: any) => data.total > 0);

  // Leads by status
  const leadsByStatus = [
    { name: 'New', value: leads.filter(l => l.status === 'new').length },
    { name: 'Interested', value: leads.filter(l => l.status === 'interested').length },
    { name: 'Site Visit', value: leads.filter(l => l.status === 'site_visit').length },
    { name: 'Closed', value: leads.filter(l => l.status === 'closed').length },
    { name: 'Not Interested', value: leads.filter(l => l.status === 'not_interested').length },
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your CRM performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <h3 className="text-gray-900 mt-2">{totalLeads}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Leads</p>
                <h3 className="text-gray-900 mt-2">{activeLeads}</h3>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="text-gray-900 mt-2">{completedLeads}</h3>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">New Leads</p>
                <h3 className="text-gray-900 mt-2">{newLeads}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Leads per Employee */}
        {currentUser.role === 'admin' && leadsPerEmployee.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Leads per Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={leadsPerEmployee}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#3b82f6" name="Total Leads" />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Leads by Status */}
        {leadsByStatus.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Leads by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={leadsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900 capitalize">{lead.status.replace('_', ' ')}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="text-center text-gray-500 py-4">No leads available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}