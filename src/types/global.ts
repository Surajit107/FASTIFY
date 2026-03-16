export type Nullable<T> = T | null;

export type AsyncResult<T, E = Error> = Promise<{ ok: true; data: T } | { ok: false; error: E }>;

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type ID = string;
