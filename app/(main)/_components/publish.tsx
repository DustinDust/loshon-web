import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useState } from 'react';

import { useOrigin } from '@/hooks/user-origin';
import { Document, HttpError, UpdateDocument } from '@/lib/types';
import { useUpdateDocument } from '../(routes)/documents/_hooks/use-document';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Check, Copy, Globe } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PublishProps {
  document: Document;
  onChange: (data: UpdateDocument) => void;
}

export const Publish = ({ document, onChange }: PublishProps) => {
  const origin = useOrigin();
  const { trigger: triggerUpdate } = useUpdateDocument(document);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${document?.id}`;

  const publish = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Publishing');
    triggerUpdate(
      {
        body: JSON.stringify({ isPublished: true }),
      },
      {
        onError: (err: HttpError) => {
          toast.dismiss(loadingToast);
          console.log(err);
          toast.error('Error publishing note\n' + err.message);
          setIsSubmitting(false);
        },
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Note published');
          onChange({ isPublished: true });
          setIsSubmitting(false);
        },
      }
    );
  };

  const unpublished = async () => {
    setIsSubmitting(true);
    const loadingToast = toast.loading('Unpublishing');
    triggerUpdate(
      {
        body: JSON.stringify({ isPublished: false }),
      },
      {
        onError: (err: HttpError) => {
          toast.dismiss(loadingToast);
          console.log(err);
          toast.error('Error unpublishing note\n' + err.message);
          setIsSubmitting(false);
        },
        onSuccess: () => {
          toast.dismiss(loadingToast);
          toast.success('Note unpublished');
          onChange({ isPublished: false });
          setIsSubmitting(false);
        },
      }
    );
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size='sm' variant='ghost'>
          Publish{' '}
          {document.isPublished && (
            <Globe className='text-sky-500 w-4 h-4 ml-2' />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='min-w-72'
        align='end'
        alignOffset={8}
        forceMount
      >
        {document.isPublished ? (
          <div className='space-y-4'>
            <div className='flex items-center gap-x-2'>
              <Globe className='text-sky-500 animate-pulse h-4 w-4' />
              <p className='text-xs font-medium text-sky-500'>
                This note is live!
              </p>
            </div>
            <div className='flex items-center'>
              <Input
                className='flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate disabled:cursor-pointer'
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className='h-8 rounded-l-none'
              >
                {copied ? (
                  <Check className='h-4 w-4 text-green-500' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>
            <Button
              size='sm'
              className='w-full text-xs'
              disabled={isSubmitting}
              onClick={unpublished}
            >
              Unpublished
            </Button>
          </div>
        ) : (
          <div className='flex flex-col justify-center items-center'>
            <Globe className='h-8 w-8 text-muted-foreground mb-2' />
            <p className='text-sm font-medium mb-2'>Publish this note</p>
            <span className='text-xs text-muted-foreground mb-4'>
              Share your work with others
            </span>
            <Button
              disabled={isSubmitting}
              onClick={publish}
              className='w-full text-xs'
              size='sm'
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
