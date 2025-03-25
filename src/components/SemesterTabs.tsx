
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface SemesterTabsProps {
  activeSemester: number;
  onChange: (semester: number) => void;
  className?: string;
}

const SemesterTabs: FC<SemesterTabsProps> = ({ activeSemester, onChange, className }) => {
  const semesters = [1, 2, 3, 4];
  
  return (
    <div className={cn("flex rounded-full bg-purple-200/40 p-2 w-full mb-8 fade-in", className)}>
      {semesters.map((semester) => (
        <button
          key={semester}
          onClick={() => onChange(semester)}
          className={cn(
            "flex-1 py-3 text-center rounded-full transition-all duration-300 text-lg font-medium",
            activeSemester === semester 
              ? "bg-purple text-white shadow-lg" 
              : "text-purple hover:bg-purple/10"
          )}
        >
          Semester {semester}
        </button>
      ))}
    </div>
  );
};

export default SemesterTabs;
