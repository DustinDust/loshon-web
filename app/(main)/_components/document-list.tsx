'use client';

import { Document } from '@/lib/types';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useClerkSWR } from '@/hooks/use-clerk-swr';
import { Item } from './item';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';

interface DocumentListProps {
  parentDocumentId?: string;
  level?: number;
  data?: Document[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpanded = (documentId: string) => {
    setExpanded((prevExpanded) => {
      return {
        ...prevExpanded,
        [documentId]: !prevExpanded[documentId],
      };
    });
  };

  const { data, isLoading } = useClerkSWR<Document[]>(
    `document${!!parentDocumentId ? `/${parentDocumentId}` : ''}`,
    `document${!!parentDocumentId ? `?parentDocument=${parentDocumentId}` : ''}`
  );

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  return (
    <>
      {isLoading && (
        <>
          <Item.Skeleton level={level} />
          {level === 0 && (
            <>
              <Item.Skeleton level={level} />
              <Item.Skeleton level={level} />
            </>
          )}
        </>
      )}
      {!isLoading && (
        <>
          <p
            style={{ paddingLeft: !!level ? `${level * 12 + 25}px` : `12px` }}
            className={cn(
              'hidden text-sm font-medium text-muted-foreground/80',
              expanded && 'last:block',
              level === 0 && 'hidden'
            )}
          >
            No pages inside
          </p>
          {data?.data?.map((document) => {
            return (
              <div key={document.id}>
                <Item
                  id={document.id}
                  onClick={() => onRedirect(document.id)}
                  label={document.title}
                  icon={FileIcon}
                  documentIcon={document.icon}
                  active={params.documentId === document.id}
                  onExpand={() => onExpanded(document.id)}
                  expanded={expanded[document.id]}
                  level={level}
                />
                {expanded[document.id] && (
                  <DocumentList
                    parentDocumentId={document.id}
                    level={level + 1}
                  />
                )}
              </div>
            );
          })}
        </>
      )}
    </>
  );
};
