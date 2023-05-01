import { useEffect, useRef } from 'react';

function useScaleContainer(targetWidth: number): React.RefObject<HTMLDivElement> {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function scaleContainer() {
      const screenWidth = window.innerWidth;
      if (screenWidth < targetWidth) {
        const scaleFactor = screenWidth / targetWidth;
        if (containerRef.current) {
          containerRef.current.style.transform = `scale(${scaleFactor})`;
        }
      } else {
        if (containerRef.current) {
          containerRef.current.style.transform = 'none';
        }
      }
    }

    scaleContainer();
    window.addEventListener('resize', scaleContainer);

    return () => {
      window.removeEventListener('resize', scaleContainer);
    };
  }, [targetWidth]);

  return containerRef;
}

export default useScaleContainer;