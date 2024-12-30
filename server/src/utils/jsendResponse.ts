interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface JSendResponse<T> {
  status: "success" | "fail" | "error";
  data?: T;
  message?: string;
  pagination?: Pagination;
}

export function jsendSuccess<T>(
  data: T,
  pagination?: Pagination
): JSendResponse<T> {
  return {
    status: "success",
    data,
    pagination
  };
}

export function jsendFail<T>(data: T): JSendResponse<T> {
  return {
    status: "fail",
    data
  };
}

export function jsendError(message: string): JSendResponse<null> {
  return {
    status: "error",
    message
  };
}
