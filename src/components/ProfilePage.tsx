import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Mail, Shield } from "lucide-react";
import type { User } from '../App';

interface ProfilePageProps {
  user: User;
}

export function ProfilePage({ user }: ProfilePageProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-gray-900">Profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          Your account information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.profileImage} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-gray-900">{user.name}</h3>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-600" />
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                  {user.role === 'admin' ? 'Administrator' : 'Employee'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-gray-900">{user._id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Type</p>
                <p className="text-gray-900">{user.role === 'admin' ? 'Admin Account' : 'Employee Account'}</p>
              </div>
            </div>

            {user.role === 'admin' && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  As an administrator, you have access to all leads and can manage the entire system.
                </p>
              </div>
            )}

            {user.role === 'employee' && (
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-900">
                  As an employee, you can create leads, view leads assigned to you, and manage your follow-ups.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}