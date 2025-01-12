import { useCallback, useState } from 'react';

export const useUploadFile = () => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = useCallback(async (file: File) => {
    try {
      setLoading(true);
      const body = new FormData();
      body.append('file', file);
      const res = await fetch('/api/upload', { body, method: 'POST' });
      const data = await res.json();
      if (res.status !== 200 || !data.path) {
        throw new Error('Upload failed');
      } else {
        return data.path as string;
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);
  return [handle, { error, loading }] as const;
};

export const useDeleteFile = () => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const handle = useCallback(async (path: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/upload?path=${path}`, { method: 'DELETE' });
      if (res.status !== 200) {
        throw new Error('Upload failed');
      } else {
        return true;
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);
  return [handle, { error, loading }] as const;
};
