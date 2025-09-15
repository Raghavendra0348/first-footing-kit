import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, FileText, BarChart3, Users, HelpCircle, 
  ChevronLeft, ChevronRight, BookOpen, Bell, Settings, 
  Heart, Bookmark, History, Folder, Video, Palette,
  Zap, Globe, Search, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SidebarProps {
  type?: 'citizen' | 'admin';
}

export const Sidebar = ({ type = 'citizen' }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [myStuffOpen, setMyStuffOpen] = useState(true);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const location = useLocation();

  const citizenNavItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/report', label: 'Report Issue', icon: FileText, badge: 'NEW' },
    { path: '/district-reports', label: 'District Reports', icon: Video },
    { path: '/dashboard', label: 'My Reports', icon: BarChart3 },
  ];

  const adminNavItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { path: '/admin/issues', label: 'All Issues', icon: FileText },
    { path: '/admin/assign', label: 'Assignments', icon: Users },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const myStuffItems = [
    { path: '/dashboard', label: 'Creation History', icon: History },
    { path: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { path: '/liked', label: 'Liked', icon: Heart },
    { path: '/albums', label: 'Saved Albums', icon: Folder },
  ];

  const resourceItems = [
    { path: '/help', label: 'Tutorials', icon: BookOpen },
    { path: '/help', label: 'Help Center', icon: HelpCircle },
    { path: '/updates', label: "What's New", icon: Bell },
    { path: '/themes', label: 'Theme Gallery', icon: Palette },
  ];

  const navItems = type === 'admin' ? adminNavItems : citizenNavItems;

  const renderNavItem = (item: any) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-sidebar-accent group relative ${
          isActive 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
            : 'text-sidebar-foreground hover:text-sidebar-accent-foreground'
        }`}
      >
        <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
        {!isCollapsed && (
          <>
            <span className="flex-1">{item.label}</span>
            {item.badge && (
              <span className="px-2 py-0.5 text-xs bg-openart-yellow text-black rounded-full font-medium">
                {item.badge}
              </span>
            )}
          </>
        )}
      </Link>
    );
  };

  return (
    <div 
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col h-full ${
        isCollapsed ? 'w-16' : 'w-58'
      }`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold text-sidebar-foreground">
              CivicReport
            </span>
          )}
        </div>
      </div>

      {/* Collapse Button */}
      <div className="px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full justify-center hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <nav className="space-y-1">
          {navItems.map((item) => renderNavItem(item))}
        </nav>

        {/* My Stuff Section */}
        {type === 'citizen' && !isCollapsed && (
          <Collapsible open={myStuffOpen} onOpenChange={setMyStuffOpen} className="mt-6">
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-sidebar-foreground hover:text-sidebar-primary transition-colors">
              <span>My stuff</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${myStuffOpen ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {myStuffItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2.5 pl-6 rounded-lg text-sm font-medium transition-all hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Resources Section */}
        {!isCollapsed && (
          <Collapsible open={resourcesOpen} onOpenChange={setResourcesOpen} className="mt-6">
            <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-sidebar-foreground hover:text-sidebar-primary transition-colors">
              <span>Resources</span>
              <ChevronRight className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-90' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {resourceItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-3 px-3 py-2.5 pl-6 rounded-lg text-sm font-medium transition-all hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};