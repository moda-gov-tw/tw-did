export function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

export function validateNationId(nationID: string) {
  const regex = /^[A-Z]{1}[1-2]{1}[0-9]{8}$/;
  return regex.test(nationID);
}
