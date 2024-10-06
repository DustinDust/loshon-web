/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpError } from '@/lib/types';
import { useAuth } from '@clerk/nextjs';
import useSWR, { SWRConfiguration } from 'swr';
import useSWRMutation, { SWRMutationConfiguration } from 'swr/mutation';

export function useClerkSWR<R>(
  path: string,
  requestOptions: RequestInit = {},
  swrOptions: SWRConfiguration<R> = {}
) {
  const { getToken } = useAuth();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`;

  const fetcher = async (url: string) => {
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
  return useSWR<R, HttpError>(url, fetcher, swrOptions);
}

export function useMutateClerkSWR<R>(
  path: string,
  requestOptions: RequestInit = {},
  swrOptions: SWRMutationConfiguration<R, HttpError> = {}
) {
  const { getToken } = useAuth();
  const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${path}`;

  const fetcher = async (url: string, { arg }: { arg: R }) => {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${await getToken()}`,
        'Content-Type': 'application/json',
      },
      ...requestOptions,
      body: JSON.stringify(arg || {}),
    });
    if (!res.ok) {
      const err = new HttpError('Error creating data');
      err.status = res.status;
      err.info = await res.json();
      throw err;
    }
    return res.json();
  };
  return useSWRMutation(url, fetcher, swrOptions);
}
