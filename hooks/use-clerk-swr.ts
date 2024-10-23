/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth } from '@clerk/nextjs';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

import { HttpError, TResponse } from '@/lib/types';

export function useClerkSWR<R>(
  key: string,
  path: string,
  requestOptions: RequestInit = {},
  swrOptions: SWRConfiguration<TResponse<R>> = {}
) {
  const { getToken } = useAuth();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`;

  const fetcher = async () => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${await getToken()}` },
      ...requestOptions,
    });
    if (!res.ok) {
      const error = new HttpError('Error fetching data');
      error.info = await res.json();
      error.status = res.status;
      throw error;
    }
    return res.json();
  };
  return useSWR<TResponse<R>, HttpError>(key, fetcher, swrOptions);
}

export function useMutateClerkSWR<R>(
  key: string,
  path: string,
  requestOptions: RequestInit = {},
  swrOptions: SWRMutationConfiguration<TResponse<R>, HttpError> = {}
) {
  const { getToken } = useAuth();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`;

  const fetcher = async (_: string, { arg }: { arg: R }) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': 'application/json',
      },
      ...requestOptions,
      body: JSON.stringify(arg || {}),
    });
    if (!res.ok) {
      const err = new HttpError('Some error has occurred');
      err.status = res.status;
      err.info = await res.json();
      throw err;
    }
    return res.json();
  };
  return useSWRMutation(key, fetcher, swrOptions);
}
