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
  