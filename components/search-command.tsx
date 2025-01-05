/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';
import { CircleAlert, File, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { liteClient as agoliaSearch } from 'algoliasearch/lite';
import {
  Configure,
  Hits,
  InstantSearch,
  useInstantSearch,
  useSearchBox,
  UseSearchBoxProps,
} from 'react-instantsearch';
import { Hit } from 'algoliasearch';

import { useSearch } from '@/hooks/use-search';
import {
  CommandDialog,
  CommandItem,
  CommandList,
  CommandGroup,
  CommandEmpty,
} from '@/components/ui/command';
import { Document } from '@/lib/types';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Spinner } from './spinner';
import { formatHighlightedHits } from '@/lib/utils';

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
    const ctrlKDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', ctrlKDown);
    return () => document.removeEventListener('keydown', ctrlKDown);
  }, [toggle]);

  // prevent ssr completely
  if (!isMounted) {
    return null;
  }

  const indexName = `${process.env.NEXT_PUBLIC_NODE_ENV}_documents`;

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={onClose}
      contentClassName='max-w-[100%] md:max-w-[768px] h-[570px]'
    >
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure
          highlightPreTag='<span class="font-bold">'
          highlightPostTag='</span>'
          facetFilters={[`userId:${user?.id}`, 'isDeleted:false']}
        />
        <SearchBox />
        <SearchResult />
      </InstantSearch>
    </CommandDialog>
  );
};

const SearchResult = () => {
  const { status, results } = useInstantSearch();
  const { previewItem, isOpen, onClose } = useSearch();
  const router = useRouter();
  const hits = results.hits;

  useEffect(() => {
    const enterKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isOpen) {
        e.preventDefault();
        if (hits.length > 0 && isOpen) {
          const hit = hits[0];
          router.push(`/documents/${hit.objectID}`);
          onClose();
        }
      }
    };
    document.addEventListener('keydown', enterKeyDown);
    return () => document.removeEventListener('keydown', enterKeyDown);
  }, [isOpen, hits, router, onClose]);

  return (
    <>
      <CommandList className='max-h-[570px] min-h-[570px]'>
        <CommandEmpty className='py-6 text-center text-lg'>
          {status === 'stalled' || status === 'loading' ? (
            <div className='flex justify-center items-center'>
              <Spinner size={'lg'} />
            </div>
          ) : (
            'No results found'
          )}
          {status === 'error' && (
            <div className='flex justify-center items-center text-rose-800 text-lg'>
              <CircleAlert className='mr-2 h-4 w-4' />
              Uh oh...
            </div>
          )}
        </CommandEmpty>
        <div className='flex flex-row'>
          {status === 'idle' && (
            <CommandGroup heading='Results' className='flex-[2] pb-2'>
              <Hits hitComponent={HitComponent} />
            </CommandGroup>
          )}
          {previewItem && (
            <div className='flex-[1] hidden sm:block p-4 border-l border-gray-200'>
              {previewItem.title && (
                <div className='flex items-center gap-2'>
                  {previewItem.icon ? (
                    <p>{previewItem.icon}</p>
                  ) : (
                    <File className='text-muted-foreground w-4 h-4' />
                  )}
                  <h3 className='text-md font-thin'>{previewItem.title}</h3>
                </div>
              )}
              <br />
              {previewItem.content?.split('\n').map((line, index) => (
                <p
                  key={index}
                  className='text-muted-foreground font-thin text-xs mb-1'
                >
                  {line}
                </p>
              ))}
              <div></div>
            </div>
          )}
        </div>
      </CommandList>
    </>
  );
};

const HitComponent = ({ hit }: { hit: Hit<Document> }) => {
  const { setPreviewItem } = useSearch();
  const router = useRouter();
  const onClose = useSearch((store) => store.onClose);
  const select = () => {
    onClose();
    router.push(`/documents/${hit.objectID}`);
  };

  const HighlightText = () => {
    const contentHighlight = hit._highlightResult?.content as any;
    const titleHighlight = hit._highlightResult?.title as any;

    return (
      <div>
        {titleHighlight?.value && (
          <p
            className='text-[12px] text-muted-foreground'
            dangerouslySetInnerHTML={{
              __html: formatHighlightedHits(titleHighlight.value, false),
            }}
          ></p>
        )}
        {contentHighlight?.value && (
          <p
            className='text-[12px] text-muted-foreground text-nowrap whitespace-nowrap'
            dangerouslySetInnerHTML={{
              __html: formatHighlightedHits(contentHighlight.value, true),
            }}
          ></p>
        )}
      </div>
    );
  };

  return (
    <CommandItem
      key={hit.objectID}
      value={`${hit.objectID}-${hit.title}`}
      title={hit.title}
      onSelect={select}
      onMouseEnter={() => setPreviewItem(hit)}
      onMouseLeave={() => setPreviewItem(undefined)}
    >
      <div className='flex flex-row items-start'>
        {hit.icon ? (
          <p className='mr-2 text-[16px]'>{hit.icon}</p>
        ) : (
          <File className='mr-2' />
        )}
        <div className='flex flex-col'>
          <p className='text-xs'>{hit.title}</p>
          <HighlightText />
        </div>
      </div>
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
      <Search className='mr-2 w-3 h-3 shrink-0 opacity-50' />
      <Input
        placeholder={`Search ${user?.fullName}'s documents.`}
        value={value}
        onChange={(ev) => onValueChange(ev.target.value)}
        autoFocus
        autoCorrect='off'
        className='flex h-10 w-full rounded-md bg-transparent px-0 py-3 text-xs outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed border-transparent disabled:opacity-50 focus-visible:ring-0 focus-visible:ring-offset-0'
        spellCheck={false}
        ref={inputRef}
      />
    </div>
  );
};
