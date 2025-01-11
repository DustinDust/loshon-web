import { uploadFile } from '@/lib/file-storage';
import { currentUser } from '@clerk/nextjs/server';
import { randomUUID } from 'node:crypto';

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File;
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images';
  let path = '';
  try {
    path = await uploadFile(bucket, `${user.id}/${randomUUID()}`, file);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 400 });
    }
  }
  return new Response(JSON.stringify({ path }), {
    status: 200,
  });
}

// TODO: implement this
export async function DELETE() {
  const user = await currentUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }
  return new Response('Not implemented', { status: 501 });
}
