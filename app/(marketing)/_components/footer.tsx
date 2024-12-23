import { Button } from '@/components/ui/button';
import Logo from './logo';

const Footer = () => {
  return (
    <div className='flex items-center w-full px-6 py-2 bg-background dark:bg-[--background]'>
      <Logo />
      <div className='md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground'>
        <Button variant='ghost' size='sm'>
          Privacy Policy
        </Button>
        <Button variant='ghost' size='sm'>
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
