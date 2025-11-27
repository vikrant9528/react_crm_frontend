import { useState, useEffect } from 'react';
import { LeadList } from './LeadList';
import { FollowUpPage } from './FollowUpPage';
import { ProfilePage } from './ProfilePage';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import {api} from '../api'
import type { User, Lead , Project } from '../App';
import { InventoryPage } from './InventoryPage';
import { DashboardPage } from './DashboardPage';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  authData:any
}

export type DashboardPage = 'leads' | 'followups' | 'profile' | 'inventory' | 'dashboard';

export function Dashboard({ user, onLogout , authData }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allUser , setAllUser] = useState<User[]>([])

  useEffect(()=>{
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
  },[])



  useEffect(()=>{
    api.get('/users/'+ authData._id)
    .then((res)=>{
     console.log(res);
     if(res && res.data && !res.data.error){
       setAllUser(res.data.users);
       console.log(res.data.users,'fddsaaaaaaaaaaaaa');
     }
    })
    .catch((err)=>{
      console.log(err);
    })
  },[])

  useEffect(() => {
    if (leads.length > 0) {
      localStorage.setItem('crm_leads', JSON.stringify(leads));
    }
  }, [leads]);

  const filteredLeads = leads;


  useEffect(() => {
        const storedProjects = localStorage.getItem('crm_projects');
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects));
    }
  },[])


      useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('crm_projects', JSON.stringify(projects));
    }
  }, [projects]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user} 
        onLogout={onLogout}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={onLogout}
        />
        
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">
            {currentPage === 'dashboard' && (
              <DashboardPage 
                leads={filteredLeads} 
                setLeads={setLeads}
                currentUser={user}
              />
            )}
            {currentPage === 'leads' && (
              <LeadList 
                leads={filteredLeads} 
                setLeads={setLeads}
                currentUser={user}
                allUser={allUser}
              />
            )}
            {currentPage === 'followups' && (
              <FollowUpPage 
                leads={filteredLeads}
                setLeads={setLeads}
                token={authData.token}
                currentUser={user}
                allUser={allUser}
              />
            )}
             {currentPage === 'inventory' && (
              <InventoryPage 
                projects={projects}
                setProjects={setProjects}
                currentUser={user}
              />
            )}
            {currentPage === 'profile' && (
              <ProfilePage user={user} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}