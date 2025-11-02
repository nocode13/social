export type ApiResponse<T> = {
  data: T;
  success: boolean;
  message: string;
};

export type ApiResponseWithPagination<T> = ApiResponse<T> & {
  meta: {
    next_cursor: null | string;
    prev_cursor: null | string;
    next_page_url: null | string;
    prev_page_url: null | string;
    per_page: number;
    path: string;
  };
};
