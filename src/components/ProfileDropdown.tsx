import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { User, Settings, HelpCircle, LogOut, Shield } from 'lucide-react';

interface ProfileDropdownProps {
  type?: 'citizen' | 'admin';
}

export const ProfileDropdown = ({ type = 'citizen' }: ProfileDropdownProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth">Login</Link>
        </Button>
        <Button variant="default" size="sm" asChild>
          <Link to="/auth">Register</Link>
        </Button>
      </div>
    );
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    await signOut();
    navigate(type === 'admin' ? '/admin/login' : '/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="bg-gradient-hero text-primary-foreground">
              {getInitials(user.email || '')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 bg-background border border-border/50 shadow-xl" align="end">
        <div className="px-3 py-2 border-b border-border/50">
          <p className="font-medium text-foreground">{user.email}</p>
          <p className="text-sm text-muted-foreground">
            {type === 'admin' ? 'Administrator' : 'Citizen'}
          </p>
        </div>
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/profile" className="flex items-center px-3 py-2">
            <User className="mr-3 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        
        {type === 'citizen' && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/dashboard" className="flex items-center px-3 py-2">
              <Settings className="mr-3 h-4 w-4" />
              My Reports
            </Link>
          </DropdownMenuItem>
        )}
        
        {type === 'admin' && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link to="/admin/dashboard" className="flex items-center px-3 py-2">
              <Shield className="mr-3 h-4 w-4" />
              Admin Dashboard
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link to="/help" className="flex items-center px-3 py-2">
            <HelpCircle className="mr-3 h-4 w-4" />
            Help & Support
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};