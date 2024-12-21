import {useEffect, useRef} from 'react';

type CaptchaProps = {
  captcha: string;
  onRefresh: () => void;
};

const generateChannelValue = (): number => {
  return Math.floor(Math.random() * 256);
};

const calculateLuminance = (r: number, g: number, b: number): number => {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const generateColor = (): { r: number; g: number; b: number; luminance: number } => {
  const r = generateChannelValue();
  const g = generateChannelValue();
  const b = generateChannelValue();
  return { r, g, b, luminance: calculateLuminance(r, g, b) };
};

const generateColor2 = (): [string, string] => {
  const color1 = generateColor();
  let color2: { r: number; g: number; b: number; luminance: number };
  // 确保生成的颜色与第一个颜色有较大的亮度差异
  do {
    color2 = generateColor();
  } while (Math.abs(color1.luminance - color2.luminance) < 128);
  return [
    `rgb(${color1.r}, ${color1.g}, ${color1.b})`,
    `rgb(${color2.r}, ${color2.g}, ${color2.b})`
  ];
};

const drawCaptcha = (canvas: HTMLCanvasElement, captcha: string) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const colorArr = generateColor2();

  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 设置字体样式
  ctx.fillStyle = colorArr[0];
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 36px Arial';

  // 绘制验证码
  const charWidth = canvas.width / captcha.length;
  for (let i = 0; i < captcha.length; i++) {
    ctx.save();
    ctx.translate(charWidth * i + 10, 35);
    ctx.rotate(Math.PI / 8 * (Math.random() - 0.5)); // 随机旋转
    ctx.fillStyle = colorArr[1];
    ctx.fillText(captcha[i], 0, 0);
    ctx.restore();
  }

  // 绘制干扰线
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random()})`;
    ctx.stroke();
  }

  // 绘制干扰点
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = `rgba(0, 0, 0, ${Math.random()})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
  }
};

const Captcha: React.FC<CaptchaProps> = ({ captcha, onRefresh }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawCaptcha(canvasRef.current, captcha);
    }
  }, [captcha]);

  const captchaStyle = {
    display: 'flex',
    justifyContent: 'center'
  }

  return (
    <div style={captchaStyle}>
      <canvas ref={canvasRef} width="200" height="60" onClick={onRefresh}/>
    </div>
  );
};

export default Captcha;