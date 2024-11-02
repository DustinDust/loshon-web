'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FileIcon } from 'lucide-react';

import { Document } from '@/lib/types';
import { Item } from './item';
import { cn } from '@/lib/utils';
import { useDocuments } from '../(routes)/documents/_hooks/use-document';
import { useDocumentsStore } from '@/hooks/use-documents-store';

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
  const { insertDocument, totalCount } = useDocumentsStore();

  const onExpanded = (documentId: string) => {
    setExpanded((prevExpanded) => {
      return {
        ...prevExpanded,
        [documentId]: !prevExpanded[documentId],
      };
    });
  };

  const { data, isLoading } = useDocuments(parentDocumentId);

  useEffect(() => {
    if (!isLoading && !!data && !!data.data) {
      data.data.forEach(insertDocument);
    }
  }, [data, isLoading, insertDocument]);

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  if (isLoading || !data?.data || !totalCount) {
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
                parentId={document.parentDocumentId}
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
    </>
  );
};
