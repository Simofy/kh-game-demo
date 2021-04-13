import axios from 'axios';
import { ApiRoutes, apiURL } from './const';

export interface ApiPostResponse {
  [ApiRoutes.postBoard]: {
    status: 'OK';
    id: string;
  };
}

export interface ApiPostBody {
  [ApiRoutes.postBoard]: {
    x?: number;
    y?: number;
    id?: string;
    name: string | unknown;
    color: string | unknown;
    data?: unknown;
  };
}

export async function handlePostAPI<T extends Extract<ApiRoutes, ApiRoutes.postBoard>>(
  url: T,
  body: ApiPostBody[T],
): Promise<ApiPostResponse[T]> {
  const response = await axios({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(body),
    url: apiURL + url,
  });
  return response.data;
}
