
import { FC, useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send } from 'lucide-react';

const Messages: FC = () => {
  const [activeChat, setActiveChat] = useState('');
  
  const contacts = [
    {
      name: 'Mr. Gautam Gupta',
      role: 'MAD Professor',
      avatar: '/uploads/c4ec9c9a-66d9-480b-b586-345ceb182b6f.png',
      online: true,
      lastMessage: 'Please submit your assignment by tomorrow.',
      time: '5m ago',
      unread: 2,
    },
    {
      name: 'Dr. Nishtha Phutela',
      role: 'SE Professor',
      avatar: '/uploads/de81a2e4-513b-4ec7-a75b-a23cd02cef0f.png',
      online: true,
      lastMessage: 'The class is rescheduled to 2 PM.',
      time: '1h ago',
      unread: 0,
    },
    {
      name: 'Prof. Anantha Rao',
      role: 'ML Professor',
      avatar: '/uploads/c4ec9c9a-66d9-480b-b586-345ceb182b6f.png',
      online: false,
      lastMessage: 'Great work on the last project.',
      time: '1d ago',
      unread: 0,
    },
    {
      name: 'Dr. Satyendr Singh',
      role: 'COA Professor',
      avatar: '/uploads/de81a2e4-513b-4ec7-a75b-a23cd02cef0f.png',
      online: false,
      lastMessage: 'Please check the updated course material.',
      time: '2d ago',
      unread: 0,
    },
  ];
  
  // Different message conversations for each teacher
  const conversationsMap = {
    'Mr. Gautam Gupta': [
      {
        sender: 'Mr. Gautam Gupta',
        text: 'Hello Akshit, I wanted to follow up on your MAD project progress.',
        time: '10:30 AM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Hello sir, I\'ve completed the initial design and working on the implementation now.',
        time: '10:35 AM',
        received: false,
      },
      {
        sender: 'Mr. Gautam Gupta',
        text: 'That sounds good. Please make sure to implement all the required features we discussed in class.',
        time: '10:40 AM',
        received: true,
      },
      {
        sender: 'Mr. Gautam Gupta',
        text: 'Also, don\'t forget to submit your weekly report by tomorrow.',
        time: '10:42 AM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Yes sir, I\'ll make sure to include all features. And I\'ll submit the report by tomorrow.',
        time: '10:45 AM',
        received: false,
      },
      {
        sender: 'Mr. Gautam Gupta',
        text: 'Great! If you have any questions or need assistance, feel free to message me.',
        time: '10:50 AM',
        received: true,
      },
      {
        sender: 'Mr. Gautam Gupta',
        text: 'Please submit your assignment by tomorrow.',
        time: '11:00 AM',
        received: true,
      },
    ],
    'Dr. Nishtha Phutela': [
      {
        sender: 'Dr. Nishtha Phutela',
        text: 'Good morning Akshit, I need to inform you about the Software Engineering class timing.',
        time: '9:00 AM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Good morning ma\'am. Is there any change?',
        time: '9:05 AM',
        received: false,
      },
      {
        sender: 'Dr. Nishtha Phutela',
        text: 'Yes, the class is rescheduled to 2 PM today due to a faculty meeting.',
        time: '9:10 AM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Thank you for letting me know. I\'ll be there at 2 PM.',
        time: '9:15 AM',
        received: false,
      },
      {
        sender: 'Dr. Nishtha Phutela',
        text: 'Also, please prepare for the presentation on agile methodologies.',
        time: '9:20 AM',
        received: true,
      },
      {
        sender: 'You',
        text: 'I\'ve already started working on it. It will be ready by the class.',
        time: '9:25 AM',
        received: false,
      },
      {
        sender: 'Dr. Nishtha Phutela',
        text: 'The class is rescheduled to 2 PM.',
        time: '9:30 AM',
        received: true,
      },
    ],
    'Prof. Anantha Rao': [
      {
        sender: 'Prof. Anantha Rao',
        text: 'Hello Akshit, I wanted to discuss your Machine Learning project.',
        time: '2:00 PM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Hello Professor, I\'m available to discuss it. What aspects would you like to focus on?',
        time: '2:05 PM',
        received: false,
      },
      {
        sender: 'Prof. Anantha Rao',
        text: 'I was reviewing your implementation of the neural network model, and I\'m impressed with your approach.',
        time: '2:10 PM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Thank you, sir. I spent a lot of time optimizing the hyperparameters.',
        time: '2:15 PM',
        received: false,
      },
      {
        sender: 'Prof. Anantha Rao',
        text: 'It shows. Your model has achieved better accuracy than most of your peers. Great work on the last project.',
        time: '2:20 PM',
        received: true,
      },
      {
        sender: 'You',
        text: 'I appreciate the feedback. I\'m planning to improve it further by implementing cross-validation.',
        time: '2:25 PM',
        received: false,
      },
      {
        sender: 'Prof. Anantha Rao',
        text: 'That\'s an excellent next step. Let me know if you need any assistance with that.',
        time: '2:30 PM',
        received: true,
      },
    ],
    'Dr. Satyendr Singh': [
      {
        sender: 'Dr. Satyendr Singh',
        text: 'Hello Akshit, I\'ve updated the Computer Architecture course materials.',
        time: '4:00 PM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Thank you for letting me know, sir. Where can I find the updated materials?',
        time: '4:05 PM',
        received: false,
      },
      {
        sender: 'Dr. Satyendr Singh',
        text: 'They\'re uploaded on the course portal. The new materials include detailed processor architecture diagrams.',
        time: '4:10 PM',
        received: true,
      },
      {
        sender: 'You',
        text: 'I\'ll check them out right away. Are there any specific sections I should focus on for the upcoming test?',
        time: '4:15 PM',
        received: false,
      },
      {
        sender: 'Dr. Satyendr Singh',
        text: 'Focus on pipelining concepts and cache coherence protocols. These will be key areas in the mid-term.',
        time: '4:20 PM',
        received: true,
      },
      {
        sender: 'You',
        text: 'Understood, sir. I\'ll prioritize those sections in my preparation.',
        time: '4:25 PM',
        received: false,
      },
      {
        sender: 'Dr. Satyendr Singh',
        text: 'Please check the updated course material. Let me know if you have any questions.',
        time: '4:30 PM',
        received: true,
      },
    ],
  };

  // Set default active chat on component mount
  useEffect(() => {
    if (contacts.length > 0 && !activeChat) {
      setActiveChat(contacts[0].name);
    }
  }, [contacts, activeChat]);
  
  const activeContact = contacts.find(contact => contact.name === activeChat);
  const currentMessages = activeChat ? conversationsMap[activeChat as keyof typeof conversationsMap] || [] : [];
  
  return (
    <PageLayout title="Messages">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="shadow-md rounded-2xl overflow-hidden h-[calc(100vh-200px)] flex flex-col appear">
            <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
              <Search className="text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search messages..." 
                className="border-0 focus-visible:ring-0 bg-transparent"
              />
            </div>
            
            <div className="overflow-y-auto flex-1">
              {contacts.map((contact) => (
                <div 
                  key={contact.name}
                  onClick={() => setActiveChat(contact.name)}
                  className={`p-4 border-b last:border-b-0 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeChat === contact.name ? 'bg-purple/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">{contact.name}</h3>
                      <span className="text-xs text-gray-500">{contact.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                  </div>
                  
                  {contact.unread > 0 && (
                    <div className="bg-purple text-white text-xs font-medium rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                      {contact.unread}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="shadow-md rounded-2xl overflow-hidden h-[calc(100vh-200px)] flex flex-col appear">
            {activeContact && (
              <>
                <div className="p-4 border-b flex items-center gap-3 bg-gray-50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activeContact.avatar} alt={activeContact.name} />
                    <AvatarFallback>{activeContact.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-medium">{activeContact.name}</h3>
                    <p className="text-xs text-gray-600">{activeContact.role}</p>
                  </div>
                  
                  <div className={`ml-2 h-2.5 w-2.5 rounded-full ${activeContact.online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.received ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-xl p-3 ${
                          message.received 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-purple text-white'
                        }`}
                      >
                        <p>{message.text}</p>
                        <div 
                          className={`text-xs mt-1 ${
                            message.received ? 'text-gray-500' : 'text-purple-100'
                          }`}
                        >
                          {message.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t flex items-center gap-2">
                  <Input 
                    placeholder="Type a message..." 
                    className="border-gray-200 focus-visible:ring-purple"
                  />
                  <button className="p-2 bg-purple text-white rounded-lg">
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Messages;
