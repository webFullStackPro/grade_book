export function generateCaptcha(length: number = 6): string {
  const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789';
  let captcha = '';
  for (let i = 0; i < length; i++) {
    captcha += chars.charAt(Math.random() * chars.length);
  }
  return captcha;
}