import { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { api } from "./api";
  import "./index.css";

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
  siteVisitPhotos?: string[];
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

export interface Project {
  id: string;
  name: string;
  image: string;
  type:
    | "builder_floor"
    | "apartment"
    | "villa"
    | "plot"
    | "commercial";
  totalUnits: number;
  unitsAvailable: number;
  unitsSold: number;
  unitTypes: string[];
  amenities: string[];
  createdBy: string;
  createdAt: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const authData = JSON.parse(localStorage.getItem('authData') || '[]')

  // Initialize with demo users
  useEffect(() => {
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
