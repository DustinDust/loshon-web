export type Document = {
  id: string;
  title: string;
  userId: string;
  isArchived: boolean;
  parentId?: string;
  content?: string;
  coverImage?: string;
  icon?: string;
  isPublished?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

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
