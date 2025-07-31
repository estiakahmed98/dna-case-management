// API input validators
export function validateRequiredFields(body: any, fields: string[]): string[] {
  const missing = [];
  for (const field of fields) {
    if (!body[field]) missing.push(field);
  }
  return missing;
}
