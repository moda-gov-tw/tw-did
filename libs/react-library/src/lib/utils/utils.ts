const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

export function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

export function validateNationId(nationID: string) {
  const regex = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
  return regex.test(nationID);
}

export function maskString(str: string) {
  const length = str.length;

  if (length <= 4) {
    return '****';
  }

  const firstTwo = str.substring(0, 2);
  const lastTwo = str.substring(length - 2, length);

  const masked = '*'.repeat(length - 4);

  return firstTwo + masked + lastTwo;
}

export function truncateAddress(address: string) {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}
