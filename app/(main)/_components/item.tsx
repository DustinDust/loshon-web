'use client';

import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import {
  ChevronDown,
  ChevronRight,
  File,
  LucideIcon,
  MoreHorizontal,
  Plus,
  TrashIcon,
} from 'lucide-react';
import { toast } from 'sonner';

import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutateClerkSWR } from '@/hooks/use-clerk-swr';
import { CreateDocument, Document, TResponse } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useArchiveDocument } from '../(routes)/documents/_hooks/use-document';
import { useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { useDocumentsStore } from '@/hooks/use-documents-store';

interface ItemProps {
  id?: string;
  documentIcon?: string | null;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  label: string;
  icon: LucideIcon;
  parentId?: string | null;
  onExpand?: () => void;
  onClick?: () => void;
}

export const Item = ({
  label,
  icon: Icon,
  active,
  expanded,
  id,
  isSearch,
  level = 0,
  parentId = '',
  onExpand,
  onClick = () => {},
}: ItemProps) => {
  if (!!id) {
    return (
      <DocumentItem
        id={id}
        active={active}
        expanded={expanded}
        level={level}
        onExpand={onExpand}
        parentId={parentId}
      />
    );
  }

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
      <Icon className='shrink-0 w-[18px] h-[18px] mr-2' />
      {label}
      {isSearch && (
        <kbd className='ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100'>
          Ctrl + K
        </kbd>
      )}
    </div>
  );
};

interface ItemDocumentProps {
  id: string;
  active?: boolean;
  expanded?: boolean;
  level?: number;
  parentId?: string | null;
  onExpand?: () => void;
}

function DocumentItem({
  id,
  active,
  expanded,
  level,
  onExpand,
  parentId,
}: ItemDocumentProps) {
  const { user } = useUser();
  const { store: documentsStore } = useDocumentsStore();
  const router = useRouter();

  const handleExpand = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onExpand?.();
  };

  const { mutate } = useSWRConfig();

  const { trigger: triggerCreateChild } = useMutateClerkSWR<CreateDocument>(
    `documents?parentDocument=${id}`,
    `documents`,
    { method: 'POST' }
  );

  const onCreate = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!id) return;
    const loadingToast = toast.loading('Creating document...');

    triggerCreateChild(
      {
        title: 'Untitled',
        parentDocumentId: id,
      },
      {
        onSuccess(data: TResponse<Document>) {
          if (!expanded) {
            onExpand?.();
          }

          router.push(`/documents/${data.data.id}`);
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

  const { trigger: triggerArchive } = useArchiveDocument({
    id: id || '',
    parentDocumentId: parentId,
  });

  const onDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!id) return;
    const loadingToast = toast.loading('Moving to trash...');
    triggerArchive(
      {},
      {
        onSuccess() {
          toast.success(`Success!`, { duration: 3000 });
          toast.dismiss(loadingToast);
          mutate(`documents/${id}`);
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
    <Link
      role='button'
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : '12px' }}
      className={cn(
        'group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
        active && 'bg-primary/5 text-primary'
      )}
      href={`/documents/${id}`}
    >
      <div
        role='button'
        className='h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1'
        onClick={handleExpand}
      >
        <ChevronIcon className='h-4 w-4 shrink-0 text-muted-foreground/50' />
      </div>
      {documentsStore[id]?.icon ? (
        <div className='shrink-0 mr-2 text-[18px]'>
          {id && documentsStore[id]?.icon}
        </div>
      ) : (
        <File className='shrink-0 w-[18px] h-[18px] mr-2' />
      )}
      <span>{documentsStore[id]?.title}</span>
      <div className='ml-auto flex items-center gap-x-2'>
        <DropdownMenu>
          <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} asChild>
            <div
              role='button'
              className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
            >
              <MoreHorizontal className='h-4 w-4 text-muted-foreground' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-60'
            align='start'
            side='right'
            forceMount
          >
            <DropdownMenuItem onClick={onDelete}>
              <TrashIcon className='w-4 h-4 mr-2' />
              Move to trash
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className='text-xs text-muted-foreground p-2'>
              Last edited by: {user?.fullName}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <div
          role='button'
          onClick={onCreate}
          className='opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600'
        >
          <Plus className='h-4 w-4 text-muted-foreground' />
        </div>
      </div>
    </Link>
  );
}

Item.Skeleton = function itemSkeleton({ level }: { level: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : '12px',
      }}
      className='flex gap-x-2 py-[3px]'
    >
      <Skeleton className='h-4 w-4 bg-zinc-200 dark:bg-zinc-700' />
      <Skeleton className='h-4 w-[30%]  bg-zinc-200 dark:bg-zinc-700' />
    </div>
  );
};
