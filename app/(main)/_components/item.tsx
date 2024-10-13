'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useMutateClerkSWR } from '@/hooks/use-clerk-swr';
import { CreateDocument, Document } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, LucideIcon, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ItemProps {
  id?: string;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

export const Item = ({
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  expanded,
  id,
  isSearch,
  level = 0,
  onExpand,
}: ItemProps) => {
  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    onExpand?.();
  };

  const router = useRouter();
  const { trigger } = useMutateClerkSWR<CreateDocument>(
    'document',
    'document',
    { method: 'POST' }
  );

  const onCreate = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!id) return;
    const loadingToast = toast.loading('Creating document...');

    trigger(
      {
        title: 'Untitled',
        parentDocument: id,
      },
      {
        onSuccess(data: Document) {
          if (!expanded) {
            onExpand?.();
          }

          router.push(`documents/${data.id}`);
          toast.success('Success!', {
            duration: 3000,
          });
          toast.dismiss(loadingToast);
        },
        onError(err) {
          console.log(err);
          toast.error(err.message, { duration: 3000 });
          toast.dismiss(loadingToast);
        },
      }
    );
  };

  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  return (
    <div
      onClick={onClick}
      role='button'
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
    >
      {!!id && (
        <div
          role='button'
          className='h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1'
          onClick={handleExpand}
        >
          <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50' />
        </div>
      )}
      {documentIcon ? (
        <div className='shrink-0 mr-2 text-[18px]'>{documentIcon}</div>
      ) : (
        <Icon className='shrink-0 h-[18px] mr-2' />
      )}
      <span className='truncate'>{label}</span>
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          Ctrl + K
        </kbd>
      )}
      {!!id && (
        <div className='ml-auto flex items-center gap-x-2'>
          <div
            role='button'
            onClick={onCreate}
            className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
          >
            <Plus className='h-4 w-4 text-muted-foreground' />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function itemSkeleton({ level }: { level: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className='flex gap-x-2 py-[3px]'
    >
      <Skeleton className='h-4 w-4 bg-zinc-200' />
      <Skeleton className='h-4 w-[30%]  bg-zinc-200' />
    </div>
  );
};
