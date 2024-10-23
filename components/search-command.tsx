'use client';

import { useEffect, useState } from 'react';
import { File } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandEmpty,
  CommandList,
  CommandItem,
} from '@/components/ui/command';
import { useSearch } from '@/hooks/use-search';
import { useDocuments } from '@/app/(main)/(routes)/documents/_hooks/use-document';

export const SearchCommand = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data: documentsData } = useDocuments();
  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [toggle]);

  // prevent ssr completely
  if (!isMounted) {
    return null;
  }

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    onClose();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s documents`} />
      <CommandList>
        <CommandEmpty>No result found.</CommandEmpty>
        <CommandGroup heading='Documents'>
          {documentsData?.data?.map((document) => (
            <CommandItem
              key={document.id}
              value={`${document.id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document.id)}
            >
              {document.icon ? (
                <p className='mr-2 text-[18px]'>{document.icon}</p>
              ) : (
                <File className='mr-2 h-4 w-4' />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
