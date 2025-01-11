/* eslint-disable @typescript-eslint/no-explicit-any */
// !IMPORTANT: should only be used on server side

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const createBucketIfNotExist = async (name: string) => {
  const { error: fetchError } = await supabase.storage.getBucket(name);

  if (fetchError && fetchError.message === 'Bucket not found') {
    const { error: createError } = await supabase.storage.createBucket(name, {
      public: true,
      allowedMimeTypes: ['image/*'],
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    });

    if (createError) {
      throw createError;
    }
  }
};

// https://supabase.com/docs/guides/storage/uploads/standard-uploads
export const uploadFile = async (bucket: string, path: string, file: File) => {
  const uploadResponse = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });
  if (uploadResponse.error) {
    console.log(uploadResponse);
    throw uploadResponse.error;
  }

  return uploadResponse.data.path;
};

export const deleteFile = async (bucket: string, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.log(error);
    throw error;
  } else {
    return data[0];
  }
};
