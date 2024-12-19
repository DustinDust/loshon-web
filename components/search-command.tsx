'use client';

import { useEffect, useRef, useState } from 'react';
import { File, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { liteClient as agoliaSearch } from 'algoliasearch/lite';
import {
  Configure,
  Hits,
  InstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from 'react-instantsearch';

import { useSearch } from '@/hooks/use-search';
import {
  CommandDialog,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from '@/components/ui/command';
import { Document } from '@/lib/types';
import { Hit } from 'algoliasearch';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export const SearchCommand = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { user } = useUser();

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  const searchClient = agoliaSearch(
    process.env.NEXT_PUBLIC_AGOLIA_APP_ID!,
    process.env.NEXT_PUBLIC_AGOLIA_API_KEY!
  );

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

  const indexName = `${process.env.NEXT_PUBLIC_NODE_ENV}_documents`;

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure facetFilters={[`userId:${user?.id}`, 'isDeleted:false']} />
        <SearchBox />
        <CommandList>
          <CommandEmpty>No result found.</CommandEmpty>
          <CommandGroup heading='Results'>
            <Hits hitComponent={HitComponent} />
          </CommandGroup>
        </CommandList>
      </InstantSearch>
    </CommandDialog>
  );
};

const HitComponent = ({ hit }: { hit: Hit<Document> }) => {
  const router = useRouter();
  const onClose = useSearch((store) => store.onClose);
  const select = () => {
    onClose();
    router.push(`/documents/${hit.objectID}`);
  };
  return (
    <CommandItem
      key={hit.objectID}
      value={`${hit.objectID}-${hit.title}`}
      title={hit.title}
      onSelect={select}
    >
      {hit.icon ? (
        <p className='mr-2 text-[18px]'>{hit.icon}</p>
      ) : (
        <File className='mr-2 h-4 w-4' />
      )}
      <span>{hit.title}</span>
      {hit.isArchived && (
        <Badge className='text-xs font-thin ml-2 bg-zinc-400' variant='default'>
          archived
        </Badge>
      )}
      {hit.isPublished && (
        <Badge className='text-xs font-thin ml-2 bg-sky-500'>published</Badge>
      )}
    </CommandItem>
  );
};

const SearchBox = (props: UseSearchBoxProps) => {
  const { refine } = useSearchBox(props);
  const [value, setValue] = useState('');
  const { user } = useUser();
  const inputRef = useRef(null);

  const onValueChange = (value: string) => {
    setValue(value);

    refine(value);
  };

  // const loading = status === 'stalled';

  return (
    <div className='flex items-center border-b px-3'>
      <Search className='mr-2 w-5 h-5 shrink-0 opacity-50' />
      <Input
        placeholder={`Search ${user?.fullName}'s documents.`}
        value={value}
        onChange={(ev) => onValueChange(ev.target.value)}
        autoFocus
        autoCorrect='off'
        className='flex h-12 w-full rounded-md bg-transparent px-0 py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed border-transparent disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0'
        spellCheck={false}
        ref={inputRef}
      />
    </div>
  );
};
