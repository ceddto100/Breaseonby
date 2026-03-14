import { useEffect, useRef } from 'react';

// Stars shoot from upper-right toward lower-left, like real shooting stars
const KEYFRAMES = `
  @keyframes star-move {
    0%   { transform: translate(0, 0); opacity: 0; }
    6%   { opacity: 1; }
    85%  { opacity: 1; }
    100% { transform: translate(-550px, 400px); opacity: 0; }
  }
`;

export default function ShootingStars() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Inject keyframe once
    const style = document.createElement('style');
    style.textContent = KEYFRAMES;
    document.head.appendChild(style);

    const createStar = () => {
      // Wrapper handles the movement (upper-right → lower-left)
      const wrapper = document.createElement('div');
      // Inner element is the visual streak, rotated to match travel direction
      const streak = document.createElement('div');

      const startX = 30 + Math.random() * 70;   // vw — bias toward right side
      const startY = Math.random() * 45;          // vh — upper half of screen
      const duration = 0.8 + Math.random() * 1.4;
      const tailLen = 140 + Math.random() * 180;  // px — long tails
      const thickness = 2 + Math.random() * 3;    // px — thicker streaks

      Object.assign(wrapper.style, {
        position: 'absolute',
        left: `${startX}vw`,
        top: `${startY}vh`,
        animation: `star-move ${duration}s ease-out forwards`,
      });

      Object.assign(streak.style, {
        width: `${tailLen}px`,
        height: `${thickness}px`,
        borderRadius: '50px',
        // Gradient: right=bright (head), left=transparent (tail)
        background: 'linear-gradient(to right, transparent, rgba(77, 232, 255, 0.4), #4DE8FF)',
        boxShadow: `0 0 ${thickness * 3}px ${thickness + 1}px rgba(77, 232, 255, 0.55)`,
        // 135deg orients the bright (right) end toward lower-left — matching travel direction
        transform: 'rotate(135deg)',
        transformOrigin: 'right center',
      });

      wrapper.appendChild(streak);
      container.appendChild(wrapper);
      setTimeout(() => wrapper.remove(), (duration + 0.15) * 1000);
    };

    let timeoutId;
    const spawn = () => {
      createStar();
      timeoutId = setTimeout(spawn, 400 + Math.random() * 1800);
    };
    timeoutId = setTimeout(spawn, 200);

    return () => {
      clearTimeout(timeoutId);
      style.remove();
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
