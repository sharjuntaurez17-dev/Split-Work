import { useEffect, useRef } from "react";
import LOGO_SRC from "../assets/logoSrc";

export default function ProcessedLogo({ size = 124 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        if (r > 220 && g > 220 && b > 220) d[i + 3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
    };
    img.src = LOGO_SRC;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, display: "block" }}
    />
  );
}
