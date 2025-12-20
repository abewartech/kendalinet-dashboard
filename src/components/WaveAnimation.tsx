import { useEffect, useRef } from "react";

interface WaveAnimationProps {
  speed: number;
  color?: string;
}

const WaveAnimation = ({ speed, color = "hsl(187, 92%, 50%)" }: WaveAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let offset = 0;

    // Convert hsl to hsla for canvas compatibility
    const toHsla = (hslColor: string, alpha: number) => {
      // Handle "hsl(h, s%, l%)" format
      const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (match) {
        return `hsla(${match[1]}, ${match[2]}%, ${match[3]}%, ${alpha})`;
      }
      return hslColor;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const amplitude = 10 + (speed / 100) * 15;
      const frequency = 0.02;
      const animationSpeed = 0.05 + (speed / 100) * 0.1;

      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, toHsla(color, 0.1));
      gradient.addColorStop(0.5, toHsla(color, 0.4));
      gradient.addColorStop(1, toHsla(color, 0.1));

      // Draw wave
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x++) {
        const y = height / 2 + Math.sin(x * frequency + offset) * amplitude;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Second wave (slightly offset)
      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width; x++) {
        const y = height / 2 + Math.sin(x * frequency + offset + 2) * (amplitude * 0.6);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();
      ctx.fillStyle = toHsla(color, 0.2);
      ctx.fill();

      offset += animationSpeed;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [speed, color]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={60}
      className="w-full h-12 rounded-lg opacity-80"
    />
  );
};

export default WaveAnimation;
