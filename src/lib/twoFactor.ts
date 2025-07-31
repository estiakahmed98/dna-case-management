// 2FA generator and verifier
import { authenticator } from "otplib";
import QRCode from "qrcode";

export async function generate2FASecret(email: string) {
  const secret = authenticator.generateSecret();
  const otpauth = authenticator.keyuri(email, "DNA Archive", secret);
  const qrCode = await QRCode.toDataURL(otpauth);
  return { secret, qrCode };
}

export function verify2FACode(secret: string, token: string) {
  return authenticator.verify({ token, secret });
}
