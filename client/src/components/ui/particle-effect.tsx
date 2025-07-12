import { useEffect, useRef } from 'react';

interface ParticleEffectProps {
  className?: string;
}

export default function ParticleEffect({ className = '' }: ParticleEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        createParticles();
      }
    };
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      
      constructor() {
        this.x = Math.random() * (canvas?.width || window.innerWidth);
        this.y = Math.random() * (canvas?.height || window.innerHeight);
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        
        // Generate colors in the blue to purple spectrum for the futuristic look
        const hue = Math.random() < 0.5 
          ? 190 + Math.random() * 30  // Blue range
          : 270 + Math.random() * 30; // Purple range
          
        this.color = `hsla(${hue}, 100%, 60%, `;
        this.alpha = 0.1 + Math.random() * 0.3;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce when hitting canvas borders
        if (this.x > (canvas?.width || window.innerWidth) || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > (canvas?.height || window.innerHeight) || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.color}${this.alpha})`;
        ctx.fill();
      }
    }
    
    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 50 : 100;
      particles = [];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };
    
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            if (!ctx) return;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 200, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.2;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };
    
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };
    
    // Initial setup
    resizeCanvas();
    animate();
    
    // Handle resize
    window.addEventListener('resize', resizeCanvas);
    
    // Cleanup on component unmount
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none opacity-60 ${className}`}
    />
  );
}