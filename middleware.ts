import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname !== "/signin" && req.nextUrl.pathname !== "/signup") {
    return NextResponse.redirect(new URL("/signin", req.url))
  }

  return res
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/match/:path*",
    "/resources/:path*",
    "/schedule/:path*",
    "/chat/:path*",
    "/progress/:path*",
    "/recommendations/:path*",
  ],
}

