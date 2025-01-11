'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileIcon } from 'lucide-react';

import { Document } from '@/lib/types';
import { Item } from './item';
import { cn } from '@/lib/utils';
import { useRemoteDocuments } from '../../../hooks/documents/use-remote-document';
import { useLocalDocuments } from '@/hooks/documents/use-local-documents';

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

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { insertDocument } = useLocalDocuments();

  const onExpanded = (documentId: string) => {
    setExpanded((prevExpanded) => {
      return {
        ...prevExpanded,
        [documentId]: !prevExpanded[documentId],
      };
    });
  };

  const { data, isLoading } = useRemoteDocuments(parentDocumentId);

  useEffect(() => {
    if (!isLoading && !!data && !!data.data) {
      data.data.forEach(insertDocument);
    }
  }, [data, isLoading, insertDocument]);

  if (isLoading || !data?.data) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 && (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
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
              label={document.title}
              icon={FileIcon}
              documentIcon={document.icon}
              active={params.documentId === document.id}
              onExpand={() => onExpanded(document.id)}
              expanded={expanded[document.id]}
              level={level}
              parentId={document.parentDocumentId}
            />
            {expanded[document.id] && (
              <DocumentList parentDocumentId={document.id} level={level + 1} />
            )}
          </div>
        );
      })}
    </>
  );
};
