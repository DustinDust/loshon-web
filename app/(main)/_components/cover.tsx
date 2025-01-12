'use client';

import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useMemo, useState } from 'react';

import { useUpdateDocument } from '../../../hooks/documents/use-remote-document';
import { Button } from '@/components/ui/button';
import { useCoverImage } from '@/hooks/use-cover-image';
import { cn } from '@/lib/utils';
import { HttpError } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteFile } from '@/hooks/use-file-upload';
import { useSupabase } from '@/hooks/use-supabase';
import { Spinner } from '@/components/spinner';

interface CoverImageProps {
  path?: string | null;
  preview?: boolean;
}

export const Cover = ({ path, preview }: CoverImageProps) => {
  const [loading, setLoading] = useState(false);
  const coverImage = useCoverImage();
  const { supabase } = useSupabase();
  const params = useParams();

  const [removeImage] = useDeleteFile();

  const { trigger: triggerUpdate } = useUpdateDocument({
    id: params.documentId as string,
  });

  const url = useMemo(() => {
    if (!path || !supabase) return undefined;

    return supabase?.storage
      .from(process.env.NEXT_PUBLIC_SUPABASE_BUCKET! || 'images')
      .getPublicUrl(path).data.publicUrl;
  }, [path, supabase]);

  const onRemove = async () => {
    setLoading(true);
    if (!path || preview) {
      return;
    }
    removeImage(path);
    triggerUpdate(
      { body: JSON.stringify({ coverImage: null }) },
      {
        onSuccess: () => setLoading(false),
        onError: (err: HttpError) => {
          console.log(err);
          setLoading(false);
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <div
      className={cn(
        'relative w-full h-[35vh] group',
        !url && 'h-[12vh]',
        url && 'bg-muted'
      )}
    >
      {loading && (
        <div className='z-40 absolute inset-0 flex items-center justify-center bg-slate-200 bg-opacity-50'>
          <Spinner size='icon' />
        </div>
      )}
      {path && url && (
        <Image src={url} fill alt='Cover' className='object-cover' priority />
      )}
      {path && url && !preview && (
        <div className='opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2'>
          <Button
            onClick={() => coverImage.onReplace(url)}
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'
          >
            <ImageIcon className='h-4 w-4 mr-2' />
            Change cover
          </Button>

          <Button
            onClick={onRemove}
            className='text-muted-foreground text-xs'
            variant='outline'
            size='sm'
          >
            <X className='h-4 w-4 mr-2' />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

Cover.Skeleton = function CoverSkeleton() {
  return (
    <div>
      <Skeleton className='w-full h-[12vh]' />
    </div>
  );
};
