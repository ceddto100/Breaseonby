import { useEffect, useRef } from 'react';

export default function ShootingStars() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createStar = () => {
      // Travel direction: mostly upward with slight horizontal drift
      const dx = (Math.random() - 0.5) * 200;        // -100 to 100 px
      const dy = -(400 + Math.random() * 250);         // -400 to -650 px (upward)
      const angle = Math.atan2(dy, dx) * (180 / Math.PI);

      const startX = Math.random() * 95;               // vw
      const startY = 30 + Math.random() * 60;          // vh — lower/mid area
      const duration = 0.9 + Math.random() * 1.3;
      const tailLen = 160 + Math.random() * 200;       // px — long tail
      const thickness = 2 + Math.random() * 3;         // px
      const headSize = thickness * 2.5 + 3;            // bright head circle

      // Unique keyframe per star so each has its own exact translation
      const animName = `s${Math.random().toString(36).substr(2, 9)}`;
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        @keyframes ${animName} {
          0%   { transform: translate(0px, 0px); opacity: 0; }
          7%   { opacity: 1; }
          82%  { opacity: 1; }
          100% { transform: translate(${dx}px, ${dy}px); opacity: 0; }
        }
      `;
      document.head.appendChild(styleEl);

      // Wrapper handles the movement animation
      const wrapper = document.createElement('div');
      Object.assign(wrapper.style, {
        position: 'absolute',
        left: `${startX}vw`,
        top: `${startY}vh`,
        animation: `${animName} ${duration}s ease-out forwards`,
      });

      // Rotate container aligns the visual streak with the travel direction
      const rotateEl = document.createElement('div');
      Object.assign(rotateEl.style, {
        display: 'flex',
        alignItems: 'center',
        transform: `rotate(${angle}deg)`,
      });

      // Tail: long streak fading from transparent → bright cyan at the head end
      const tailEl = document.createElement('div');
      Object.assign(tailEl.style, {
        width: `${tailLen}px`,
        height: `${thickness}px`,
        background: `linear-gradient(
          to right,
          transparent 0%,
          rgba(77, 232, 255, 0.08) 20%,
          rgba(77, 232, 255, 0.45) 65%,
          rgba(200, 242, 255, 0.85) 100%
        )`,
        borderRadius: '50px 0 0 50px',
        flexShrink: '0',
      });

      // Head: bright glowing comet-head dot
      const headEl = document.createElement('div');
      Object.assign(headEl.style, {
        width: `${headSize}px`,
        height: `${headSize}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle, #ffffff 0%, #d8f5ff 30%, #4DE8FF 65%, rgba(77, 232, 255, 0.05) 100%)`,
        boxShadow: `
          0 0 ${headSize * 1.5}px ${headSize * 0.6}px rgba(255, 255, 255, 0.9),
          0 0 ${headSize * 4}px ${headSize * 1.5}px rgba(77, 232, 255, 0.8),
          0 0 ${headSize * 9}px ${headSize * 3}px rgba(77, 232, 255, 0.3)
        `,
        flexShrink: '0',
      });

      rotateEl.appendChild(tailEl);
      rotateEl.appendChild(headEl);
      wrapper.appendChild(rotateEl);
      container.appendChild(wrapper);

      setTimeout(() => {
        wrapper.remove();
        styleEl.remove();
      }, (duration + 0.15) * 1000);
    };

    let timeoutId;
    const spawn = () => {
      createStar();
      timeoutId = setTimeout(spawn, 350 + Math.random() * 1700);
    };
    timeoutId = setTimeout(spawn, 100);

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
