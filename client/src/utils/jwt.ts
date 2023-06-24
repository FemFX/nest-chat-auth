export type TokenGeneric = {
  exp: number;
  id: number;
  role: string;
};

export function parseJwt(token: any): any {
  try {
    const data = JSON.parse(atob(token.split(".")[1]));

    return data;
  } catch (e) {
    return null;
  }
}

export function isTokenValid(token: any): boolean {
  if (!token) return false;
  const nowUnix = (+new Date() / 1e3) | 0;
  const decodedToken = parseJwt(token);
  if (decodedToken === null) return false;
  return decodedToken.exp > nowUnix;
}
