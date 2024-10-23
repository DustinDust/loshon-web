export type Document = {
  id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  parentDocumentId?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export type CreateDocument = Partial<Document>;
export type UpdateDocument = Partial<
  Pick<
    Document,
    | 'content'
    | 'coverImage'
    | 'parentDocumentId'
    | 'title'
    | 'icon'
    | 'isPublished'
  >
>;

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
