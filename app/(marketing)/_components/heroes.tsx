import Image from 'next/image';

const Heroes = () => {
  return (
    <div className='flex flex-col items-center justify-center max-w-5xl'>
      <div className='flex items-center'>
        <div className='relative w-[240px] h-[240px] md:w-[300px] md:h-[300px]'>
          <Image
            src='/heroes/heroes_02.png'
            fill
            className='object-contain'
            alt='hero'
          />
        </div>
        <div className='relative h-[300px] w-[300px] hidden md:block'>
          <Image
            src={'/heroes/heroes_01.png'}
            fill
            className='object-contain'
            alt='hero2'
          />
        </div>
      </div>
    </div>
  );
};

export default Heroes;
