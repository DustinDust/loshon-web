export type Document = {
  id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  parentDocument?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type CreateDocument = Partial<Document>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class HttpError<T = any> extends Error {
  info?: T;
  status?: number;

  constructor(message: string, info?: T, status?: number) {
    super(message);
    this.info = info;
    this.status = status;
  }
}

export type TResponse<T> = {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
};
