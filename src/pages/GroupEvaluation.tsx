
import { FC, useState, useRef, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Pen, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/components/AuthProvider';

const GroupEvaluation: FC = () => {
  const [activeSubject, setActiveSubject] = useState('COA');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [editingMember, setEditingMember] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewInputs, setReviewInputs] = useState<Record<number, string>>({});
  const { user } = useAuth();
  
  const subjects = ['COA', 'DT', 'ML', 'MAD'];
  
  const teamMembers = [
    {
      id: 1,
      name: 'Akash',
      srNo: 1,
      task: 'Mongo DB',
      marks: 8,
      maxMarks: 10
    },
    {
      id: 2,
      name: 'Akshit',
      srNo: 2,
      task: 'Login/Signup pages',
      marks: 9,
      maxMarks: 10
    },
    {
      id: 3,
      name: 'Palak',
      srNo: 3,
      task: '',
      marks: 7,
      maxMarks: 10
    },
    {
      id: 4,
      name: 'Ketan',
      srNo: 4,
      task: 'create Ride page',
      marks: 8,
      maxMarks: 10
    }
  ];

  const handleEditClick = (member: typeof teamMembers[0]) => {
    setEditingMember(member.id);
    setEditValue(member.task);
  };

  const handleSaveEdit = () => {
    // In a real app, we would update the backend here
    // For now, we're just updating the UI
    setEditingMember(null);
  };

  const handleReviewDialogOpen = () => {
    // Initialize with empty reviews
    const initialReviews: Record<number, string> = {};
    teamMembers.forEach(member => {
      initialReviews[member.id] = '';
    });
    setReviewInputs(initialReviews);
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    // In a real app, we would send the reviews to the backend
    console.log('Submitted reviews:', reviewInputs);
    setReviewDialogOpen(false);
  };

  // Different view for faculty
  if (user?.role === 'faculty') {
    return (
      <PageLayout title="Group Evaluation">
        <div className="flex rounded-full bg-purple-200/40 p-2 w-full mb-8 fade-in">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setActiveSubject(subject)}
              className={`
                flex-1 py-3 text-center rounded-full transition-all duration-300 text-lg font-medium
                ${activeSubject === subject ? 'bg-purple text-white shadow-lg' : 'text-purple hover:bg-purple/10'}
              `}
            >
              {subject}
            </button>
          ))}
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden appear">
          <div className="p-6">
            <div className="grid grid-cols-3 py-4 border-b">
              <div className="px-6 font-medium text-gray-600">Sr.No</div>
              <div className="px-6 font-medium text-gray-600">Name</div>
              <div className="px-6 font-medium text-gray-600">Tasks</div>
            </div>
            
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="grid grid-cols-3 py-6 hover:bg-gray-50 transition-colors border-b last:border-b-0"
              >
                <div className="px-6 text-gray-700">{member.srNo}.</div>
                <div className="px-6 text-gray-800 font-medium">{member.name}</div>
                <div className="px-6 text-gray-700">
                  {member.task ? member.task : <span className="text-gray-400">Not assigned</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageLayout>
    );
  }

  // Student view
  return (
    <PageLayout title="Group Evaluation">
      <div className="flex rounded-full bg-purple-200/40 p-2 w-full mb-8 fade-in">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setActiveSubject(subject)}
            className={`
              flex-1 py-3 text-center rounded-full transition-all duration-300 text-lg font-medium
              ${activeSubject === subject ? 'bg-purple text-white shadow-lg' : 'text-purple hover:bg-purple/10'}
            `}
          >
            {subject}
          </button>
        ))}
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden appear">
        <div className="p-6">
          <div className="grid grid-cols-4 py-4 border-b">
            <div className="px-6 font-medium text-gray-600">Sr.No</div>
            <div className="px-6 font-medium text-gray-600">Name</div>
            <div className="px-6 font-medium text-gray-600">Tasks</div>
            <div className="px-6 font-medium text-gray-600">Marks</div>
          </div>
          
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="grid grid-cols-4 py-6 hover:bg-gray-50 transition-colors border-b last:border-b-0"
              onMouseEnter={() => setHoverIndex(member.id)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <div className="px-6 text-gray-700">{member.srNo}.</div>
              <div className="px-6 text-gray-800 font-medium">{member.name}</div>
              <div className="px-6 text-gray-700 flex items-center relative">
                {editingMember === member.id ? (
                  <div className="flex w-full gap-2">
                    <Input 
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleSaveEdit}
                      className="h-8 w-8 text-green-500"
                    >
                      ✓
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setEditingMember(null)}
                      className="h-8 w-8 text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    {member.task ? (
                      <>
                        {member.task}
                        {hoverIndex === member.id && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2 h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple"
                            onClick={() => handleEditClick(member)}
                          >
                            <Pen className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">
                        Not assigned
                        {hoverIndex === member.id && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="ml-2 h-6 w-6 absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple"
                            onClick={() => handleEditClick(member)}
                          >
                            <Pen className="h-3.5 w-3.5" />
                          </Button>
                        )}
                      </span>
                    )}
                  </>
                )}
              </div>
              <div className="px-6 text-gray-700">{member.marks}/{member.maxMarks}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          className="bg-purple hover:bg-purple/90 text-white px-8 py-6 text-lg rounded-full"
          onClick={handleReviewDialogOpen}
        >
          Review Others
        </Button>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Review Team Members</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="space-y-2">
                <h3 className="font-medium text-lg">{member.name}</h3>
                <Textarea
                  placeholder={`Describe ${member.name}'s tasks and contributions...`}
                  value={reviewInputs[member.id] || ''}
                  onChange={(e) => setReviewInputs({...reviewInputs, [member.id]: e.target.value})}
                  className="min-h-[80px]"
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleReviewSubmit}>Submit Reviews</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default GroupEvaluation;
