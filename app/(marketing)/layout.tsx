import { NavBar } from './_components/navbar';

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='h-full'>
      <NavBar />
      {children}
    </div>
  );
};

export default MarketingLayout;
