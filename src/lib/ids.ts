export function generateApplicationNo() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `APP-${year}-${rand}`;
}

export function generateVoucherNo() {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `FV-${year}-${rand}`;
}

export function generateRollNo(classPrefix: string) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${classPrefix.replace(/\s+/g, "").toUpperCase().slice(0, 3)}-${rand}`;
}
