

export function checkBasicAuth(str, key) {
  const k = str.split(' ')[1];
  if (k === key) return true;
  return false;
}
