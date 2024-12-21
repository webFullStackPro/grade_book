// captchaMixin.js
export default {
    data() {
        return {
            generatedVerificationCode: ''
        }
    },
    mounted() {
        this.drawCaptcha()
    },
    methods: {
        calculateLuminance (r, g, b) {
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        },
        generateChannelValue () {
            return Math.floor(Math.random() * 256);
        },
        generateColor (flag) {
            let r = this.generateChannelValue()
            let g = this.generateChannelValue()
            let b = this.generateChannelValue()
            if (flag) {
              return `rgb(${r}, ${g}, ${b})`
            } else {
              return {r, g, b, luminance: this.calculateLuminance(r, g, b)}
            }
        },
        generateColor2 () {
            let color1 = this.generateColor(false)
            let color2
            // 确保生成的颜色与第一个颜色有较大的亮度差异
            do {
                color2 = this.generateColor(false)
            } while (Math.abs(color1.luminance - color2.luminance) < 128)
            return [
                `rgb(${color1.r}, ${color1.g}, ${color1.b})`,
                `rgb(${color2.r}, ${color2.g}, ${color2.b})`
            ]
        },
        generateCaptchaText () {
            const possible = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
            let text = '';
            for (let i = 0; i < 6; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
            return text;
        },
        drawCaptcha () {
            const canvas = document.getElementById('captchaCanvas');
            const context = canvas.getContext('2d');

            var colorArr = this.generateColor2()

            const captchaText = this.generateCaptchaText();
            this.generatedVerificationCode = captchaText
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
                context.strokeStyle = this.generateColor(true);
                context.stroke();
            }
        }
    }
}
