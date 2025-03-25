
import { FC, ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface PageLayoutProps {
  children: ReactNode;
  title?: string;
}

const PageLayout: FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      
      <div className="ml-[240px] flex-1 flex flex-col p-6">
        <TopBar title={title} />
        <main className="mt-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
