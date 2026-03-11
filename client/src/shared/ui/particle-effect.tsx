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

    const canvasEl = canvas;
    const context = ctx;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      createParticles();
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
        this.x = Math.random() * canvasEl.width;
        this.y = Math.random() * canvasEl.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;

        const hue = Math.random() < 0.5
          ? 190 + Math.random() * 30
          : 270 + Math.random() * 30;

        this.color = `hsla(${hue}, 100%, 60%, `;
        this.alpha = 0.1 + Math.random() * 0.3;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvasEl.width || this.x < 0) {
          this.speedX = -this.speedX;
        }

        if (this.y > canvasEl.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fillStyle = `${this.color}${this.alpha})`;
        context.fill();
      }
    }

    const createParticles = () => {
      const particleCount = window.innerWidth < 768 ? 50 : 100;
      particles = [];

      for (let i = 0; i < particleCount; i += 1) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            context.beginPath();
            context.strokeStyle = `rgba(0, 200, 255, ${0.1 * (1 - distance / 100)})`;
            context.lineWidth = 0.2;
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }
    };

    const animate = () => {
      context.clearRect(0, 0, canvasEl.width, canvasEl.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      drawConnections();
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();
    window.addEventListener('resize', resizeCanvas);

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
