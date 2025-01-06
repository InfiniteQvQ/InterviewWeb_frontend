import React, { useEffect, useRef, useState } from "react";
import "./FrontPage.css";

const FrontPage = () => {
  const canvasRef = useRef(null);
  const planetImgSrc = "/planet.png"; // 确保路径正确
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const planetImage = useRef(new Image());
  const animationFrameId = useRef(null); // 用于存储动画帧 ID

  useEffect(() => {
    // 设置图像源并监听加载事件
    planetImage.current.src = planetImgSrc;
    planetImage.current.onload = () => {
      console.log("Planet image loaded");
      setIsImageLoaded(true);
    };
  }, [planetImgSrc]); // 仅在 planetImgSrc 变化时重新执行

  useEffect(() => {
    if (!isImageLoaded) return; // 如果图像未加载完成，则不执行

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const particles = []; // 流星粒子数组
    const stars = []; // 旋转星环线段数组
    const starCount = 600; // 星环线段数量，越多环越厚

    const numberOfOrbits = 8; // 星环“跑道”数量

    const gradientOptions = [
      ["#57c9bcdc", "#1e9a8be9", "#128C7E"],
      ["#067000", "#298f23", "#6bc666"],
      ["#024a25", "#1e834f", "#48a776"],
      ["#0ac3b1", "#27bcae", "#4eb6ac"],
      ["#09776a", "#1c7067", "#2f6c66"],
      // 可以根据需要添加更多颜色组合
    ];

    const planet = {
      x: 0,
      y: 0,
      size: 30,
    };

    // 初始化星球和旋转星环线段
    const initializePlanet = () => {
      const vw = window.innerWidth / 100; // 每 vw 单位像素值
      planet.size = vw * 35; // 将星球大小设置为 35vw
      planet.x = canvas.width * 0.7; // 星球 x 位置
      planet.y = canvas.height * 0.43; // 星球 y 位置
      // 初始化旋转星环线段
      stars.length = 0; // 清空旧的星环线段
      for (let i = 0; i < starCount; i++) {
        const angle = Math.random() * Math.PI * 2; // 随机起始角度
        const orbitIndex = i % numberOfOrbits; // 循环分配到各轨道
        const gradientChoice =
          gradientOptions[Math.floor(Math.random() * gradientOptions.length)]; // 随机选择一个颜色组合

        stars.push({
          angle, // 当前角度
          speed: 0.0003, // 随机旋转速度，较慢的速度
          length: 1 * 5 + 2, // 线段长度
          width: 1 * 5 + 2, // 线段宽度，增加厚度
          alpha: 0.9, // 透明度
          gradientColors: gradientChoice, // 预先选择的渐变颜色
          orbitIndex, // 轨道索引
        });
      }
    };

    // 设置画布尺寸
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializePlanet();
    };

    // 绘制星球
    const drawPlanet = () => {
      const vw = window.innerWidth / 100;
      const radius = planet.size / 2;
      ctx.drawImage(
        planetImage.current,
        planet.x - radius,
        planet.y - radius,
        planet.size,
        planet.size-3.9*vw,
      );
    };

    // 绘制旋转的星环线段
    const drawStars = () => {
      const tiltAngle = Math.PI / 6; // 15度倾斜
      const frontStars = [];
      const backStars = [];
      const yScale = 0.3; // 增加离心率，使轨道更扁平

      // 定义轨道
      const orbitSpacing = planet.size * 0.05;
      const baseOrbitRadius = planet.size * 0.8;
      const orbits = Array.from(
        { length: numberOfOrbits },
        (_, i) => baseOrbitRadius + i * orbitSpacing
      );

      // 分离前方和后方星环线段
      stars.forEach((star) => {
        const normalizedAngle =
          (star.angle % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); // 归一化角度到 [0, 2π)
        if (normalizedAngle > Math.PI && normalizedAngle < 2 * Math.PI) {
          backStars.push(star);
        } else {
          frontStars.push(star);
        }
      });

      // 绘制后方星环线段（被星球遮挡）
      backStars.forEach((star) => {
        // 更新星环线段的角度
        star.angle += star.speed;
        star.angle = star.angle % (Math.PI * 2);

        // 获取当前轨道半径
        const orbitRadius = orbits[star.orbitIndex] || baseOrbitRadius;
        const x = planet.x + Math.cos(star.angle) * orbitRadius;
        const y =
          planet.y +
          Math.sin(star.angle + tiltAngle) * (orbitRadius * yScale);

        // 计算线段的起点和终点
        const startX = x - Math.cos(star.angle) * star.length;
        const startY = y - Math.sin(star.angle) * star.length;
        const endX = x + Math.cos(star.angle) * star.length;
        const endY = y + Math.sin(star.angle) * star.length;

        // 创建星环线段的渐变颜色，方向与线段一致
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        star.gradientColors.forEach((color, index) => {
          gradient.addColorStop(
            index / (star.gradientColors.length - 1),
            color
          );
        });

        // 绘制星环线段为线段
        ctx.strokeStyle = gradient; // 使用 gradient，而不是 star.gradient
        ctx.lineWidth = star.width; // 设置线宽，使星环线段更粗
        ctx.lineCap = "round"; // 设置线条端点为圆形，效果更好
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      // 绘制星球
      drawPlanet();

      // 绘制前方星环线段（显示在星球前面）
      frontStars.forEach((star) => {
        // 更新星环线段的角度
        star.angle += star.speed;
        star.angle = star.angle % (Math.PI * 2);

        // 获取当前轨道半径
        const orbitRadius = orbits[star.orbitIndex] || baseOrbitRadius;
        const x = planet.x + Math.cos(star.angle) * orbitRadius;
        const y =
          planet.y +
          Math.sin(star.angle + tiltAngle) * (orbitRadius * yScale);

        // 计算线段的起点和终点
        const startX = x - Math.cos(star.angle) * star.length;
        const startY = y - Math.sin(star.angle) * star.length;
        const endX = x + Math.cos(star.angle) * star.length;
        const endY = y + Math.sin(star.angle) * star.length;

        // 创建星环线段的渐变颜色，方向与线段一致
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        star.gradientColors.forEach((color, index) => {
          gradient.addColorStop(
            index / (star.gradientColors.length - 1),
            color
          );
        });

        // 绘制星环线段为线段
        ctx.strokeStyle = gradient; // 使用 gradient，而不是 star.gradient
        ctx.lineWidth = star.width; // 设置线宽，使星环线段更粗
        ctx.lineCap = "round"; // 设置线条端点为圆形，效果更好
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      ctx.globalAlpha = 1; // 重置透明度
    };

    // 更新并绘制流星粒子
    const updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.02; // 缓慢淡出

        if (p.alpha <= 0) {
          particles.splice(i, 1); // 移除淡出后的粒子
        } else {
          // 创建粒子的径向渐变颜色
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            p.size
          );
          gradient.addColorStop(0, "#57c9bcdc");
          gradient.addColorStop(0.5, "#1e9a8be9");
          gradient.addColorStop(1, "#128C7E");

          // 绘制粒子
          ctx.fillStyle = gradient;
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1; // 重置透明度
    };

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除画布

      drawStars(); // 绘制旋转星环线段
      updateParticles(); // 更新并绘制流星粒子

      // 存储动画帧 ID 以便取消
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // 处理鼠标移动事件，创建流星粒子
    //const handleMouseMove = (e) => {
    //  const rect = canvas.getBoundingClientRect();
    //  const x = e.clientX - rect.left;
    //  const y = e.clientY - rect.top;
    //  createParticle(x, y);
    //};

    // 启动动画
    const startAnimations = () => {
      animate();
    };

    // 初始化画布和事件监听
    const setup = () => {
      setCanvasSize();
      //canvas.addEventListener("mousemove", handleMouseMove);
      startAnimations();
    };

    // 窗口调整大小时重新设置画布
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
      };
    };

    const debouncedHandleResize = debounce(() => {
      setCanvasSize();
    }, 200);

    setup(); // 初始化画布和动画
    window.addEventListener("resize", debouncedHandleResize); // 添加窗口调整大小监听器

    // 清理事件监听器和动画帧
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
     //canvas.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isImageLoaded]); // 仅依赖 isImageLoaded

  return (
    <div className="front-page">
      <canvas ref={canvasRef} className="background-canvas"></canvas>
      <div className="content">
        <div className="content-section">
          <h1 className="headline animate-fade-in">FreeCareer</h1>
          <h1 className="headline animate-fade-in">真正下一代的求职助手</h1>
          <p className="subline animate-slide-up">
            可以 <span className="highlight highlight-faster"> 更快</span> 
            , <span className="highlight highlight-better"> 更好</span> 
            地帮你匹配工作机会
          </p>
        </div>
        <div className="content-section">
          <p className="subline-english animate-slide-up">The next-generation job assistant</p>
          <p className="subline-english animate-slide-up">
            Helping you find opportunities 
            <span className="highlight highlight-faster"> faster</span> and 
            <span className="highlight highlight-better"> better</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
