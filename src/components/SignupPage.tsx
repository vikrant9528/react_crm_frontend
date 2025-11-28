import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Building2, Upload, Camera, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { User, UserRole } from '../App';
import {api} from '../api';

interface SignupPageProps {
  onSignup: (user: User) => void;
  onLoginClick: () => void;
}

export function SignupPage({ onSignup, onLoginClick }: SignupPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [file, setProfileImage] = useState<File>();
  const [phone , setPhone] = useState('')
  const [error, setError] = useState('');
  const [empCode , setEmpCode] = useState('')
  const [review , setReview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      
      setProfileImage(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setReview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const newUser = {
      email,
      password,
      name,
      role,
      file,
      empCode,
      phone,
      _id:'0'
    };
    registerUser(newUser)
  };

  const registerUser = (payload:any) =>{ 
       const formData = new FormData();

  Object.keys(payload).forEach(key => {
    if (key !== '_id' && payload[key] !== undefined && payload[key] !== null) {
      const value = payload[key];
      formData.append(key, value);
    }
  });
    api.post('/auth/signup' , formData)
    .then((res)=>{
      console.log(res);
      if(res && res.data && !res.data.error && res.data.user){
        // Registration successful
           const { password: _, ...userWithoutPassword } = res.data.user;
          onSignup(userWithoutPassword);
        console.log('User registered successfully');
      } else {
        setError(res.data.error || 'Registration failed');
      }
    })
    .catch((err)=>{
      console.log(err);
      setError(err)
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
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Sign up for Real Estate CRM</CardDescription>
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
            
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {review ? (
                    <img src={review} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
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

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="98....."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

              <div className="space-y-2">
              <Label htmlFor="empCode">Employee Code</Label>
              <Input
                id="empCode"
                type="text"
                placeholder="Ex. 123"
                value={empCode}
                onChange={(e) => setEmpCode(e.target.value)}
                required
              />
            </div>
         </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={(value:any) => setRole(value as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onLoginClick}
                className="text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}