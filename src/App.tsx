import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { api } from "./api";

export type UserRole = 'admin' | 'employee';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  profileImage?: string;
}

export interface Lead {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'not_interested' | 'interested' | 'closed' | 'site_visit';
  source : 'website' | 'walkin' | 'referral',
  time:string,
  followUp: string;
  budget:string,
  notes: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  // siteVisitPhotos?: string[];
  timeline: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  userId?: string;
  userName: string;
  action: string;
  details: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const authData = JSON.parse(localStorage.getItem('authData') || '[]')

  // Initialize with demo users
  useEffect(() => {
    // const storedUsers = localStorage.getItem('crm_users');
    // if (!storedUsers) {
    //   const demoUsers = [
    //     {
    //       id: '1',
    //       email: 'admin@realestate.com',
    //       password: 'admin123',
    //       name: 'Admin User',
    //       role: 'admin' as UserRole,
    //     },
    //     {
    //       id: '2',
    //       email: 'employee@realestate.com',
    //       password: 'employee123',
    //       name: 'John Employee',
    //       role: 'employee' as UserRole,
    //     },
    //   ];
      
    //   localStorage.setItem('crm_users', JSON.stringify(demoUsers));
    // }
    api.get('/users/'+authData._id)
    .then((res)=>{
      if(res && res.data && !res.data.error){
        const users = res.data.users;
        localStorage.setItem('crm_users',JSON.stringify(users))
      }
      console.log(res);
    })
    .catch((err)=>{
      console.log(err);
    })
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'login' && (
        <LoginPage
          onLogin={handleLogin}
          onSignupClick={() => setCurrentPage('signup')}
        />
      )}
      {currentPage === 'signup' && (
        <SignupPage
          onSignup={handleLogin}
          onLoginClick={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard authData={authData} user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
