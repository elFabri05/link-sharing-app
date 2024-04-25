import { useEffect, useState } from 'react';

const useMediaQuery = (breakpoint: number): boolean => {
  const [screenSize, setScreenSize] = useState<boolean>(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth >= breakpoint);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [breakpoint]);

  return screenSize;
}

export default useMediaQuery;