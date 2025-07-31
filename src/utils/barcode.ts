// Barcode generator utility
export function generateBarcode(prefix: string): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
}
