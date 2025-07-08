/**
 * Validates a Romanian CNP (Cod Numeric Personal) using the checksum algorithm.
 */
export const isValidCNP = (cnp: string): boolean => {
  if (!/^\d{13}$/.test(cnp)) {
    return false;
  }
  const checksumConstant = '279146358279';
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i], 10) * parseInt(checksumConstant[i], 10);
  }
  const controlDigit = sum % 11;
  const lastDigit = parseInt(cnp[12], 10);

  if (controlDigit === 10) {
    return lastDigit === 1;
  }
  return lastDigit === controlDigit;
};
