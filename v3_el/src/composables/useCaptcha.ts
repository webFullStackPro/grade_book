import { ref, onMounted } from 'vue';

export function useCaptcha() {
  const generatedVerificationCode = ref<string>('');

  const calculateLuminance = (r: number, g: number, b: number): number => {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const generateChannelValue = (): number => {
    return Math.floor(Math.random() * 256);
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

  const generateCaptchaText = (): string => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const drawCaptcha = (): void => {
    const canvas = document.getElementById('captchaCanvas') as HTMLCanvasElement;
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');

    const colorArr = generateColor2();

    const captchaText = generateCaptchaText();
    generatedVerificationCode.value = captchaText;
    if (context) {
      context.fillStyle = colorArr[0];
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.font = 'bold 36px Arial';
      context.textAlign = 'center';
      context.fillStyle = colorArr[1];
      context.fillText(captchaText, canvas.width / 2, canvas.height - 10);

      // 添加干扰线
      for (let i = 0; i < 10; i++) {
        context.beginPath();
        context.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        context.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);

        const strokeStyleColor: { r: number; g: number; b: number; luminance: number } = generateColor()
        context.strokeStyle = `rgb(${strokeStyleColor.r}, ${strokeStyleColor.g}, ${strokeStyleColor.b})`

        context.stroke();
      }
    }
  };

  onMounted(drawCaptcha);

  return {
    generatedVerificationCode,
    drawCaptcha,
    calculateLuminance,
    generateChannelValue,
    generateColor,
    generateColor2,
    generateCaptchaText
  };
}
