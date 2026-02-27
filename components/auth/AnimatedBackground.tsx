"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  pulse: number;
  pulseSpeed: number;
}

interface Commit {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  opacity: number;
  size: number;
  color: string;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    let animationId: number;
    let width = (canvas.width = window.innerWidth / 2);
    let height = (canvas.height = window.innerHeight);

    const nodes: Node[] = [];
    const commits: Commit[] = [];
    const colors = ["#00d4ff", "#00ff88", "#a855f7", "#3b82f6"];

    // Create nodes
    for (let i = 0; i < 25; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: 0,
        pulseSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    function spawnCommit() {
      commits.push({
        x: Math.random() * width,
        y: height + 10,
        targetY: -20,
        speed: Math.random() * 1.5 + 0.5,
        opacity: 0,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function drawGrid() {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    function animate() {
      ctx.fillStyle = "rgba(9, 9, 20, 0.15)";
      ctx.fillRect(0, 0, width, height);

      drawGrid();

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.15;
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulse += node.pulseSpeed;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        const pulseRadius = node.radius + Math.sin(node.pulse) * 1.5;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, pulseRadius * 4
        );
        gradient.addColorStop(0, node.color + "40");
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius * 4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Spawn commits periodically
      if (Math.random() < 0.03) spawnCommit();

      // Update & draw commits (flowing upward)
      for (let i = commits.length - 1; i >= 0; i--) {
        const c = commits[i];
        c.y -= c.speed;
        c.opacity = c.y > height * 0.7 ? Math.min(c.opacity + 0.02, 0.8)
          : c.y < height * 0.2 ? Math.max(c.opacity - 0.02, 0) : c.opacity;

        // Small commit block
        ctx.fillStyle =
          c.color +
          Math.floor(c.opacity * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fillRect(
          c.x - c.size / 2,
          c.y - c.size / 2,
          c.size,
          c.size * 0.6
        );

        if (c.y < -20) commits.splice(i, 1);
      }

      // Hex decorations
      const time = Date.now() * 0.001;
      ctx.save();
      ctx.translate(width * 0.5, height * 0.4);
      ctx.rotate(time * 0.1);
      drawHexagon(ctx, 0, 0, 80 + Math.sin(time) * 10, "rgba(0, 212, 255, 0.05)");
      ctx.restore();

      ctx.save();
      ctx.translate(width * 0.3, height * 0.7);
      ctx.rotate(-time * 0.08);
      drawHexagon(ctx, 0, 0, 50 + Math.cos(time) * 8, "rgba(0, 255, 136, 0.04)");
      ctx.restore();

      animationId = requestAnimationFrame(animate);
    }

    function drawHexagon(
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      r: number,
      color: string
    ) {
      c.strokeStyle = color;
      c.lineWidth = 1;
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
      c.stroke();
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth / 2;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    // Initial clear
    ctx.fillStyle = "#090914";
    ctx.fillRect(0, 0, width, height);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Overlay content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-8">
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            Live Tracking Active
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight">
            <span className="text-gradient-cyber">Commit</span>
            <span className="text-white">Lens</span>
          </h1>
          <p className="text-zinc-400 max-w-md text-lg leading-relaxed">
            Real-time commit intelligence for hackathons.
            <br />
            <span className="text-neon-blue/80">Fairness.</span>{" "}
            <span className="text-neon-green/80">Compliance.</span>{" "}
            <span className="text-neon-purple/80">Transparency.</span>
          </p>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-sm mx-auto">
            {[
              { label: "Commits Tracked", value: "2.4M+" },
              { label: "Hackathons", value: "380+" },
              { label: "Fairness Score", value: "99.7%" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-3 text-center">
                <div className="text-lg font-bold text-neon-blue glow-text-blue">
                  {stat.value}
                </div>
                <div className="text-[10px] text-zinc-500 mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
    </div>
  );
}
