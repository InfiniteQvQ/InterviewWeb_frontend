import React, { useEffect, useRef } from "react";
import "./FrontPage.css";

const FrontPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = [];

    const createParticle = (x, y) => {
      for (let i = 0; i < 5; i++) { // Reduce particle count for a more subtle effect
        particles.push({
          x,
          y,
          dx: Math.random() * 3.5 - 1.5,
          dy: Math.random() * 3.5 - 1.5,
          alpha: 1,
          size: Math.random() * 2 + 2, 
          gradient: ctx.createLinearGradient(x, y, x + 10, y + 10),
        });
      }
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.02; // Slow fade-out for better visibility
        if (p.alpha <= 0) {
          particles.splice(index, 1);
        } else {
          p.gradient.addColorStop(0, "#57c9bcdc");
          p.gradient.addColorStop(0.5, "#1e9a8be9");
          p.gradient.addColorStop(1, "#128C7E");
          ctx.fillStyle = p.gradient;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1; // Reset alpha to default for other drawing operations
        }
      });
      requestAnimationFrame(updateParticles);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createParticle(x, y);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.addEventListener("mousemove", handleMouseMove);
    updateParticles();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="front-page">
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      <div className="content">
        <h1 className="headline animate-fade-in">真正下一代的求职助手</h1>
        <p className="subline animate-slide-up">可以 <span className="highlight highlight-faster">更快</span> <span className="highlight highlight-better">更好</span> 地帮你匹配工作机会</p>
        <p className="subline-english animate-slide-up">The next-generation job assistant, helping you find opportunities <span className="highlight highlight-faster">faster</span> and <span className="highlight highlight-better">better</span>.</p>
      </div>
    </div>
  );
};

export default FrontPage;
