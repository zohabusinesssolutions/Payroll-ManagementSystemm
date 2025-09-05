import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const protectedPaths = [
    '/api/department/*',
]

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if the current request path matches a protected route
    const isProtected = protectedPaths.some((path) =>
        new RegExp(`^${path.replace('*', '.*')}$`).test(pathname)
    )

    if (!isProtected) {
        return NextResponse.next()
    }

    // Get session token (requires NEXTAUTH_SECRET)
    const token = await getToken({ req: request })

    if (!token) {
        return new NextResponse(
            JSON.stringify({ message: 'Unauthorized' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
        )
    }

    return NextResponse.next()
}
