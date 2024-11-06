'use client';

import { useState } from 'react';

import { Dialog, DialogHeader, DialogContent } from '@/components/ui/dialog';
import { useCoverImage } from '@/hooks/use-cover-image';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import { useEdgeStore } from '@/lib/edgestore';
import { useParams } from 'next/navigation';
import { useUpdateDocument } from '@/app/(main)/(routes)/documents/_hooks/use-document';
import { HttpError } from '@/lib/types';
import { toast } from 'sonner';
import { useCurrentDocument } from '@/hooks/use-current-document';

export const CoverImageModal = () => {
  const params = useParams();
  const { currentDocument } = useCurrentDocument();
  const { trigger: triggerUpdate } = useUpdateDocument(
    currentDocument || { id: params.documentId as string }
  );
  const coverImage = useCoverImage();
  const { edgestore } = useEdgeStore();

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
    coverImage.onClose();
  };

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);

      const res = await edgestore.publicFiles.upload({
        file,
        options: { replaceTargetUrl: coverImage?.url },
      });

      triggerUpdate(
        { body: JSON.stringify({ coverImage: res.url }) },
        {
          onSuccess: () => {
            onClose();
          },
          onError: (err: HttpError) => {
            console.log(err);
            toast.error(err.message);
          },
        }
      );
    }
  };

  return (
    <Dialog open={coverImage.isOpen} onOpenChange={coverImage.onClose}>
      <DialogContent>
        <DialogHeader>
          <h2 className='text-center text-large font-semibold'>Cover image</h2>
        </DialogHeader>
        <SingleImageDropzone
          className='w-full outline-none'
          disabled={isSubmitting}
          onChange={onChange}
          value={file}
        />
      </DialogContent>
    </Dialog>
  );
};
