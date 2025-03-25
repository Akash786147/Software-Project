
import { FC, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SemesterTabs from '@/components/SemesterTabs';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

const CourseRegistration: FC = () => {
  const [activeSemester, setActiveSemester] = useState(1);
  
  const [registrationData, setRegistrationData] = useState([
    {
      unit: '03',
      subject: 'COA',
      issuesDate: '03/02/2023',
      deadline: '03/05/2023',
      status: 'Submitted',
      selected: true,
    },
    {
      unit: '01',
      subject: 'SE',
      issuesDate: '03/09/2023',
      deadline: '03/09/2025',
      status: 'Pending',
      selected: false,
    },
    {
      unit: '01',
      subject: 'MAD',
      issuesDate: '03/02/2024',
      deadline: '03/10/2026',
      status: 'Pending',
      selected: false,
    },
    {
      unit: '01',
      subject: 'Design Thinking',
      issuesDate: '02/05/2022',
      deadline: '03/11/2023',
      status: 'Pending',
      selected: false,
    },
    {
      unit: '02',
      subject: 'Machine Learning',
      issuesDate: '02/08/2022',
      deadline: '03/10/2023',
      status: 'Late Submission',
      selected: true,
    },
  ]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'text-green-600';
      case 'Late Submission':
        return 'text-red-600';
      default:
        return 'text-black';
    }
  };
  
  const toggleSelect = (index: number) => {
    const newData = [...registrationData];
    newData[index].selected = !newData[index].selected;
    setRegistrationData(newData);
    
    toast({
      title: newData[index].selected 
        ? `Selected ${newData[index].subject}` 
        : `Deselected ${newData[index].subject}`,
      duration: 2000,
    });
  };
  
  const handleNext = () => {
    toast({
      title: "Course registration in progress",
      description: "Your selected courses are being registered",
      duration: 3000,
    });
  };
  
  return (
    <PageLayout title="Course Registration">
      <SemesterTabs activeSemester={activeSemester} onChange={setActiveSemester} />
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden appear">
        <div className="grid grid-cols-5 py-4 border-b">
          <div className="px-6 font-medium text-gray-600">Unit</div>
          <div className="px-6 font-medium text-gray-600">Subject</div>
          <div className="px-6 font-medium text-gray-600">Issues Date</div>
          <div className="px-6 font-medium text-gray-600">Deadline</div>
          <div className="px-6 font-medium text-gray-600">Status</div>
        </div>
        
        {registrationData.map((registration, index) => (
          <div 
            key={index} 
            className="grid grid-cols-5 py-5 hover:bg-gray-50 transition-colors border-b last:border-b-0"
          >
            <div className="px-6 flex items-center">
              <button
                onClick={() => toggleSelect(index)}
                className={cn(
                  "w-5 h-5 rounded-sm border flex items-center justify-center mr-3",
                  registration.selected ? "bg-green-600 border-green-600" : "border-gray-300"
                )}
                aria-label={registration.selected ? "Deselect" : "Select"}
              >
                {registration.selected && <Check className="h-3 w-3 text-white" />}
              </button>
              {registration.unit}
            </div>
            <div className="px-6 text-gray-800 font-medium">{registration.subject}</div>
            <div className="px-6 text-gray-700">{registration.issuesDate}</div>
            <div className="px-6 text-gray-700">{registration.deadline}</div>
            <div className={`px-6 font-medium ${getStatusColor(registration.status)}`}>
              {registration.status}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-4">
        <Button 
          onClick={handleNext}
          className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-200"
        >
          Next
        </Button>
      </div>
    </PageLayout>
  );
};

export default CourseRegistration;
