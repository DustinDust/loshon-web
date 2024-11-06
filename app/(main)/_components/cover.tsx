'use client';

import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';

import { useUpdateDocument } from '../(routes)/documents/_hooks/use-document';
import { Button } from '@/components/ui/button';
import { useCoverImage } from '@/hooks/use-cover-image';
import { cn } from '@/lib/utils';
import { HttpError } from '@/lib/types';
import { toast } from 'sonner';
import { useEdgeStore } from '@/lib/edgestore';

interface CoverImageProps {
  url?: string | null;
  preview?: boolean;
}

export const Cover = ({ url, preview }: CoverImageProps) => {
  const coverImage = useCoverImage();
  const params = useParams();
  const { trigger: triggerUpdate } = useUpdateDocument({
    id: params.documentId as string,
  });
  const { edgestore } = useEdgeStore();

  const onRemove = async () => {
    if (!url) {
      return;
    }
    edgestore.publicFiles.delete({
      url: url,
    });
    triggerUpdate(
      { body: JSON.stringify({ coverImage: null }) },
      {
        onError: (err: HttpError) => {
          console.log(err);
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
      {!!url && <Image src={url} fill alt='Cover' className='object-cover' />}
      {url && !preview && (
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
