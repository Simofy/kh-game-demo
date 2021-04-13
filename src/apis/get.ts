import axios from 'axios';
import { ApiRoutes, apiURL, CellDataType } from './const';

export interface ApiGetResponse {
  [ApiRoutes.getBoard]: {
    x: number;
    y: number;
    data: CellDataType;
  };
  [ApiRoutes.getStatus]: {
    maxX: number;
    maxY: number;
    minX: number;
    minY: number;
    update: number;
  };
  [ApiRoutes.getCell]: [
    {
      x: number;
      y: number;
      history: CellDataType[];
    },
  ];
}

export interface ApiGetParams {
  [ApiRoutes.getBoard]: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  [ApiRoutes.getStatus]: null;
  [ApiRoutes.getCell]: {
    x?: number;
    y?: number;
    id?: string;
  };
}

export async function handleGetAPI<T extends ApiRoutes>(
  url: T,
  params: ApiGetParams[T],
): Promise<ApiGetResponse[T]> {
  const response = await axios({
    method: 'GET',
    params,
    url: apiURL + url,
  });
  return response.data;
}
