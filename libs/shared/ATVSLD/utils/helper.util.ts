export function generateRandomPassword (length = 10): string {

    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const numbers = '23456789';
    const symbols = '!@#$%^&*';
    const all = upper + lower + numbers + symbols;
  
    const pick = (set: string) => set[Math.floor(Math.random() * set.length)];
  
    let password = [
      pick(upper),
      pick(lower),
      pick(numbers),
      pick(symbols),
    ];
  
    while (password.length < length) {
      password.push(pick(all));
    }
  
    return password
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  export function validatePhone(phone: string): boolean {
    const phoneRegex = /^0\d{9}$/; //  số bắt đầu bằng 0, theo sau 9 chữ số
    return phoneRegex.test(phone);
  }
  
