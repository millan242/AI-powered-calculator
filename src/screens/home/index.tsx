import { useState, useRef, useEffect } from "react";
import { SWATCHES } from '@/constants';
import { ColorSwatch, Group } from "@mantine/core";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setDrawing] = useState(false);
  const [color, setColor] = useState('rgb(255,255,255')

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.style.background = 'black';
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        const { offsetX, offsetY } = getEventPosition(e);
        ctx.moveTo(offsetX, offsetY);
        setDrawing(true);
      }
    }
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) {
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { offsetX, offsetY } = getEventPosition(e);
        ctx.strokeStyle = color;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
      }
    }
  };

  const getEventPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (e.nativeEvent instanceof MouseEvent) {
      return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
    } else if (e.nativeEvent instanceof TouchEvent) {
      const touch = e.nativeEvent.touches[0];
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      return { offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top };
    }
    return { offsetX: 0, offsetY: 0 };
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => startDrawing(e)}
        onMouseUp={(e) => stopDrawing(e)}
        onMouseOut={(e) => stopDrawing(e)}
        onMouseMove={(e) => draw(e)}
        onTouchStart={(e) => startDrawing(e)}
        onTouchEnd={(e) => stopDrawing(e)}
        onTouchMove={(e) => draw(e)}
        id="canvas"
        className="absolute top-0 left-0 w-full h-full"
      ></canvas>
    </div>
  );
}