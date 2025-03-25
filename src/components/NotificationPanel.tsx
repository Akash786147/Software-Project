
import { FC } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Notification {
  id: string;
  message: string;
  time: string;
  avatar: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const notifications: Notification[] = [
    {
      id: '1',
      message: 'Hey There Akshit, I had a problem',
      time: '10hrs ago',
      avatar: '/uploads/f400707f-441c-472a-8a62-aed944c55c20.png',
      read: false
    },
    {
      id: '2',
      message: 'Please Complete ',
      time: '11hrs ago',
      avatar: '/uploads/2cb4a5e1-2ec7-4be6-8a31-482ab1066973.png',
      read: false
    },
    {
      id: '3',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1day ago',
      avatar: '/uploads/f400707f-441c-472a-8a62-aed944c55c20.png',
      read: true
    },
    {
      id: '4',
      message: 'DSA Mid 11/2/25',
      time: '10hrs ago',
      avatar: '/uploads/2cb4a5e1-2ec7-4be6-8a31-482ab1066973.png',
      read: false
    },
    {
      id: '5',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '1day ago',
      avatar: '/uploads/f400707f-441c-472a-8a62-aed944c55c20.png',
      read: true
    }
  ];

  return (
    <div className="absolute right-0 top-full mt-2 w-96 z-50 bg-purple/90 text-white rounded-lg shadow-lg overflow-hidden animate-fade-in">
      <div className="p-4 font-medium text-lg border-b border-white/10">
        Notification
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`flex items-start gap-3 p-4 border-b border-white/10 hover:bg-purple-dark/20 transition-colors ${notification.read ? 'opacity-70' : ''}`}
          >
            <Avatar className="h-10 w-10 rounded-full border-2 border-white/20">
              <AvatarImage src={notification.avatar} alt="User" />
              <AvatarFallback className="bg-purple-dark text-white">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col">
              <p className="text-sm">{notification.message}</p>
              <span className="text-xs text-white/70 mt-1">{notification.time}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 text-center border-t border-white/10 hover:bg-purple-dark/20 cursor-pointer transition-colors">
        <span className="text-sm font-medium">View All</span>
      </div>
    </div>
  );
};

export default NotificationPanel;
