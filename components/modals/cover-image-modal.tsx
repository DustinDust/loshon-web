'use client';

import { useState } from 'react';

import { Dialog, DialogHeader, DialogContent } from '@/components/ui/dialog';
import { useCoverImage } from '@/hooks/use-cover-image';
import { SingleImageDropzone } from '@/components/single-image-dropzone';
import { useParams } from 'next/navigation';
import { useUpdateDocument } from '@/hooks/documents/use-remote-document';
import { HttpError } from '@/lib/types';
import { toast } from 'sonner';
import { useLocalDocument } from '@/hooks/documents/use-local-document';
import { useFileUpload } from '@/hooks/use-file-upload';

export const CoverImageModal = () => {
  const params = useParams();
  const { currentDocument } = useLocalDocument();
  const { trigger: triggerUpdate } = useUpdateDocument(
    currentDocument || { id: params.documentId as string }
  );
  const coverImage = useCoverImage();
  const [upload] = useFileUpload();

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

      const publicUrl = await upload(file);
      if (!publicUrl) {
        toast.error('Failed to upload image');
        return;
      }

      triggerUpdate(
        { body: JSON.stringify({ coverImage: publicUrl }) },
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
