import * as jose from 'jose';

export const jwks = jose.createLocalJWKSet({
  keys: [
    {
      alg: 'RS256',
      kty: 'RSA',
      use: 'sig',
      n: 'u4f-mDNV-KfFIfEueIbRquTwl9ok3LzJ13gLGe6KTC3tr3-I4pdSkWr5o_m9qGlT5ICXkubmJI7HMS6nRZJh9F6wQIFQqNsYwfNW6oXCjilOYpVX2XPLnpVbD8Vu0apac5c8pR-GGiWpM168xLPbDuekX9kd0ClzhIjMFOjYiCS3DsbWFy3efGwo9btrNALYzze413jgeaRYS2VQVqTPbdKvHTUnhKwdEG2o2MOP7TN3p4EaM1WLBAZRCqwByUh9ey10Ux7Yuf2AEM131d-EojOkFUnHa2TrnQSgYWn5DOST4Nsn7xI3qhOMyQUatu-XkJmUVfi79kHUoi1VZVaAyQ',
      e: 'AQAB',
      kid: 'pvkaoMQT4IUK4ta1v80OJ',
      x5t: 'YoYZEh4ajdRTQzlNydypyUZaLBs',
      x5c: [
        'MIIDCTCCAfGgAwIBAgIJaVQ8grPK/VMPMA0GCSqGSIb3DQEBCwUAMCIxIDAeBgNVBAMTF2thcnJvdC11eHMuanAuYXV0aDAuY29tMB4XDTIyMDUyNzAzNDg1NFoXDTM2MDIwMzAzNDg1NFowIjEgMB4GA1UEAxMXa2Fycm90LXV4cy5qcC5hdXRoMC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC7h/6YM1X4p8Uh8S54htGq5PCX2iTcvMnXeAsZ7opMLe2vf4jil1KRavmj+b2oaVPkgJeS5uYkjscxLqdFkmH0XrBAgVCo2xjB81bqhcKOKU5ilVfZc8uelVsPxW7RqlpzlzylH4YaJakzXrzEs9sO56Rf2R3QKXOEiMwU6NiIJLcOxtYXLd58bCj1u2s0AtjPN7jXeOB5pFhLZVBWpM9t0q8dNSeErB0QbajYw4/tM3engRozVYsEBlEKrAHJSH17LXRTHti5/YAQzXfV34SiM6QVScdrZOudBKBhafkM5JPg2yfvEjeqE4zJBRq275eQmZRV+Lv2QdSiLVVlVoDJAgMBAAGjQjBAMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFOWyZu4QR1ZneFrY0lylQNLGyAFnMA4GA1UdDwEB/wQEAwIChDANBgkqhkiG9w0BAQsFAAOCAQEAoNYRQdIOS3s+fKw1ecXY42XEo1RFNAwKtQcn8LRaYh6oDFDBBqX3cG4GPOAz1qzoGCXh/xgobh2eb0LHNpZQBnddiCzZEvlXkkRZF99Etj11q/4s0mC8yzH7joiz57lmymTHPdW3LYOVcJiPd8QR51eBNZio4T2hwZiunsKC2WYJepgOJc4JFiE/y7l6LcjrCFV2+YKrCgpKC/sPiLHoCIz8sdAyHQ9TYmZWB351CaO9Gppk7wHjPWu9qh7HaWcCFGCIo1dfNn0syitzBsEC4NaaaH06RRMk1sePkRQrM3PcO+3J1qqr7g+zjaw4hPvJrbLawCBfj2WoAbk6XYx9mA==',
      ],
    },
  ],
});

export function getJwt(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || authHeader.substring(0, 6) !== 'Bearer') {
    return null;
  }
  return authHeader.substring(6).trim();
}

export async function validateAuth(request: Request) {
  const jwt = getJwt(request);
  if (!jwt) {
    throw new BadRequestException('No JWT found in Authorization header');
  }
  console.log(JSON.stringify(jose.decodeJwt(jwt), null, 2));

  try {
    const result = await jose.jwtVerify(jwt, jwks);
    return result;
  } catch (err) {
    if (err instanceof jose.errors.JOSEError) {
      throw new BadRequestException(err.message);
    }
    throw err;
  }
}
