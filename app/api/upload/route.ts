import { deleteFile, uploadFile } from '@/lib/file-storage';
import { currentUser } from '@clerk/nextjs/server';
import { randomUUID } from 'node:crypto';
import { URL } from 'node:url';

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

export async function DELETE(request: Request) {
  const user = await currentUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const path = new URL(request.url).searchParams.get('path');
  if (!path) {
    return new Response('Invalid images path', { status: 400 });
  }
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'images';
  try {
    await deleteFile(bucket, path);
  } catch (e) {
    if (e instanceof Error) {
      return new Response(e.message, { status: 500 });
    }
  }
  return new Response('Deleted', { status: 200 });
}
