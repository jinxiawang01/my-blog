import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, message: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/')
  revalidatePath('/work/[slug]', 'page')

  return NextResponse.json({ ok: true, revalidatedAt: new Date().toISOString() })
}
