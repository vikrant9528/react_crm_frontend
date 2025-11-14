import { useState , useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Building2, AlertCircle, Users } from "lucide-react";
import { Alert, AlertDescription } from './ui/alert';
import type { User } from '../App';
import { api } from "../api";

interface LoginPageProps {
  onLogin: (user: User) => void;
  onSignupClick: () => void;
}

export function LoginPage({ onLogin, onSignupClick }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
const details = JSON.parse(localStorage.getItem('crm_users') || '[]');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  };

  const loadIt = () => {
    api
    .post('/auth/login', {email,password})
    .then((res)=> {
      if(res && res.data){
        onLogin(res.data.details);
        const params = res.data.details;
        params['token'] = res.data.token;
        localStorage.setItem('authData',JSON.stringify(params))
      }else{
        setError('Envalid email or password');
      }
    })
    .catch((err)=>{
      console.log(err);
      setError('wrong credentials')
    })
  }


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your Real Estate CRM account</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@realestate.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" onClick={loadIt}>
              Sign In
            </Button>
          </form>
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={onSignupClick}
                className="text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-600">Demo credentials:</p>
            <p className="text-xs text-gray-700">Admin: admin@realestate.com / admin123</p>
            <p className="text-xs text-gray-700">Employee: employee@realestate.com / employee123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}