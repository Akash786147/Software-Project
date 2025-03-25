
import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Clock, MessageSquare, BarChart2, FolderOpen, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/AuthProvider';

const Sidebar: FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      { icon: Home, label: 'Home', path: '/' },
      { icon: Clock, label: 'TimeTable', path: '/timetable' },
      { icon: MessageSquare, label: 'Messages', path: '/messages' },
      { icon: Calendar, label: 'Attendance', path: '/attendance' },
    ];
    
    // Faculty-specific items
    if (user?.role === 'faculty') {
      return [
        ...commonItems,
        { icon: FolderOpen, label: 'Courses', path: '/courses' },
        { icon: Users, label: 'Group Evaluation', path: '/group-evaluation' },
      ];
    }
    
    // Student-specific items
    return [
      ...commonItems,
      { icon: BarChart2, label: 'Result', path: '/result' },
      { icon: FolderOpen, label: 'Courses', path: '/courses' },
      { icon: Users, label: 'Group Evaluation', path: '/group-evaluation' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="w-[240px] h-screen bg-sidebar fixed left-0 top-0 rounded-tr-[24px] rounded-br-[24px] overflow-hidden shadow-xl z-10">
      <div className="p-6">
        <div className="flex items-center justify-center mb-12">
          <img src="/uploads/image.png" alt="BMU Logo" className="h-16" />
        </div>
        
        <nav className="space-y-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 text-white/90 hover:text-white py-2 px-4 rounded-lg transition-all duration-200 ease-in-out",
                isActive(item.path) ? 'bg-white/10 text-white font-medium' : 'hover:bg-white/5'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-lg">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
