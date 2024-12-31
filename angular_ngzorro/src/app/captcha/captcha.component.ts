import {AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  standalone: true
})
export class CaptchaComponent implements AfterViewInit {

  @ViewChild('myCanvas', { static: false }) myCanvas!: ElementRef<HTMLCanvasElement>;

  @Output() verificationCodeGenerated = new EventEmitter<string>();

  generateChannelValue(): number {
    return Math.floor(Math.random() * 256);
  }

  calculateLuminance(r: number, g: number, b: number): number {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  generateColor (): { r: number; g: number; b: number; luminance: number } {
    const r = this.generateChannelValue();
    const g = this.generateChannelValue();
    const b = this.generateChannelValue();
    return { r, g, b, luminance: this.calculateLuminance(r, g, b) };
  }


  generateColor2 (): [string, string] {
    const color1 = this.generateColor();
    let color2: { r: number; g: number; b: number; luminance: number };
    // 确保生成的颜色与第一个颜色有较大的亮度差异
    do {
      color2 = this.generateColor();
    } while (Math.abs(color1.luminance - color2.luminance) < 128);
    return [
      `rgb(${color1.r}, ${color1.g}, ${color1.b})`,
      `rgb(${color2.r}, ${color2.g}, ${color2.b})`
    ];
  }


  drawCaptcha (canvas: HTMLCanvasElement, captcha: string) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colorArr = this.generateColor2();

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
  }

  generateCaptcha(length: number = 6): string {
    const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
    let captcha = '';
    for (let i = 0; i < length; i++) {
      captcha += chars.charAt(Math.random() * chars.length);
    }
    return captcha;
  }

  ngAfterViewInit(): void {
    this.onRefresh();
  }

  public onRefresh(): void {
    const verificationCode = this.generateCaptcha()
    this.verificationCodeGenerated.emit(verificationCode);
    this.drawCaptcha(this.myCanvas.nativeElement, verificationCode)
  }
}
