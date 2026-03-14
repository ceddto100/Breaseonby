import { useEffect, useRef } from 'react';

export default function ShootingStars() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      const star = document.createElement('div');
      star.className = 'shooting-star';

      // Random start position across the full viewport
      star.style.left = Math.random() * 100 + 'vw';
      star.style.top = Math.random() * 60 + 'vh';

      // Vary size and speed
      const duration = 1 + Math.random() * 1.5;
      const size = 1 + Math.random() * 2;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.animationDuration = duration + 's';

      container.appendChild(star);

      setTimeout(() => {
        star.remove();
      }, duration * 1000);
    };

    // Spawn shooting stars at random intervals
    const spawn = () => {
      createStar();
      const nextDelay = 600 + Math.random() * 2000;
      timeoutId = setTimeout(spawn, nextDelay);
    };

    let timeoutId = setTimeout(spawn, 500);

    return () => {
      clearTimeout(timeoutId);
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 50 }}
    />
  );
}
