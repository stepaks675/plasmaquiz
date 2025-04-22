'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

export default function BouncingLogo() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [velocity, setVelocity] = useState({ x: 1, y: 1 });
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const audioRef = useRef(null);
  const animationRef = useRef(null);
  const lastUpdateTimeRef = useRef(0);
  
  useEffect(() => {
    const container = containerRef.current;
    const logo = logoRef.current;
    
    if (!container || !logo) return;
    
    const logoWidth = 60;
    const logoHeight = 60;
    
    const updateAnimation = (timestamp) => {
      if (!lastUpdateTimeRef.current) lastUpdateTimeRef.current = timestamp;
      
      // Calculate time elapsed since last frame
      const elapsed = timestamp - lastUpdateTimeRef.current;
      
      // Only update at approximately 60fps
      if (elapsed > 16) {
        lastUpdateTimeRef.current = timestamp;
        
        setPosition(prevPosition => {
          const containerRect = container.getBoundingClientRect();
          const maxX = containerRect.width - logoWidth;
          const maxY = containerRect.height - logoHeight;
          
          let newX = prevPosition.x + velocity.x;
          let newY = prevPosition.y + velocity.y;
          let newVelocityX = velocity.x;
          let newVelocityY = velocity.y;
          
          // Handle horizontal bounce
          if (newX <= 0 || newX >= maxX) {
            newVelocityX = -velocity.x;
          }
          
          // Handle vertical bounce
          if (newY <= 0 || newY >= maxY) {
            newVelocityY = -velocity.y;
          }
          
          // Update velocity if needed
          if (newVelocityX !== velocity.x || newVelocityY !== velocity.y) {
            setVelocity({ x: newVelocityX, y: newVelocityY });
          }
          
          // Ensure position stays within bounds
          newX = Math.max(0, Math.min(newX, maxX));
          newY = Math.max(0, Math.min(newY, maxY));
          
          return { x: newX, y: newY };
        });
        
        setRotation(prevRotation => (prevRotation + 1) % 360);
      }
      
      animationRef.current = requestAnimationFrame(updateAnimation);
    };
    
    animationRef.current = requestAnimationFrame(updateAnimation);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [velocity]);
  
  const handleClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };
  
  return (
    <>
      <audio 
        ref={audioRef} 
        src="/beep.mp3" 
        preload="auto"
      />
      <div 
        ref={containerRef} 
        className="fixed inset-0 z-0"
      >
        <div 
          ref={logoRef}
          onClick={handleClick}
          style={{ 
            position: 'absolute', 
            left: `${position.x}px`, 
            top: `${position.y}px`,
            transform: `rotate(${rotation}deg)`,
            willChange: 'transform, left, top',
            cursor: 'pointer'
          }}
        >
          <Image 
            src="/plasmalogo.png" 
            alt="Plasma Logo" 
            width={60} 
            height={60}
            className="opacity-80 hover:opacity-100"
          />
        </div>
      </div>
    </>
  );
} 