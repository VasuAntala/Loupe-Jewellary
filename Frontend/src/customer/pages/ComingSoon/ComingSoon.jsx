import React, { useEffect, useRef } from "react";
import "./ComingSoon.css";

const ComingSoon = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="cs-wrapper">
      <canvas ref={canvasRef} className="cs-canvas" />
      <div className="cs-content">
        <div className="cs-logo-ring">
          <span className="cs-logo-text">L</span>
        </div>
        <p className="cs-brand">LOUPE JEWELLERY</p>
        <h1 className="cs-headline">Something Extraordinary<br />is Coming</h1>
        <p className="cs-sub">
          We're crafting a luxurious experience for you.<br />
          Stay tuned for our grand reveal.
        </p>
        <div className="cs-divider">
          <span className="cs-diamond">◆</span>
        </div>
        <div className="cs-notify">
          <p className="cs-notify-label">Be the first to know</p>
          <div className="cs-input-row">
            <input
              type="email"
              className="cs-input"
              placeholder="Enter your email address"
            />
            <button className="cs-btn">Notify Me</button>
          </div>
        </div>
        <p className="cs-footer">© 2025 Loupe Jewellery. All rights reserved.</p>
      </div>
    </div>
  );
};

export default ComingSoon;
