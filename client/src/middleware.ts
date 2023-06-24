import { NextRequest, NextResponse } from "next/server";
import { $api } from "./utils/axios";
import { isTokenValid, parseJwt } from "./utils/jwt";

export const config = {
  matcher: ["/", "/chat/:path*"],
};

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  const { cookies } = req;

  const nowUnix = (+new Date() / 1e3) | 0;
  // console.log(nowUnix);

  const token = req.cookies?.get("token")?.value;
  const refresh_token = req.cookies?.get("jid")?.value;

  const newResponse = NextResponse.next();
  let tokenIsValid = isTokenValid(token);

  if (!tokenIsValid && !!refresh_token) {
    const response = await fetch(`http://localhost:4000/auth/refresh`, {
      body: JSON.stringify({
        refresh_token: refresh_token,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const data = await response.json();

    const access_token_decoded: { exp: number } = parseJwt(data.accessToken);
    console.log("ok");
    newResponse.cookies.set("token", data.accessToken, {
      path: "/",
      maxAge: 60 * 15,
    });

    tokenIsValid = true;
    console.log(tokenIsValid);
  }

  return tokenIsValid ? newResponse : NextResponse.redirect(url);
}

// export async function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();
//   url.pathname = "/login";
//   const { cookies } = req;

//   // const nowUnix = (+new Date() / 1e3) | 0;
//   const token = req.cookies?.get("token")?.value;
//   const refresh_token = req.cookies?.get("jid")?.value;

//   const newResponse = NextResponse.next();
//   console.log(newResponse);
//   let tokenIsValid = isTokenValid(token, "customer");

//   if (!tokenIsValid && !!refresh_token) {
//     const { data } = await $api.post(`localhost:4000/auth/refresh`);
//     const { access_token } = data;

//     newResponse.cookies.set("token", access_token, {
//       path: "/",
//       maxAge: 60 * 15,
//     });

//     tokenIsValid = true;
//   }

//   return tokenIsValid ? NextResponse.next() : NextResponse.redirect(url);
// }
