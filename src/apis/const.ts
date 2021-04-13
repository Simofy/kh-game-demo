export const apiURL = 'https://simutis.dev/api';

export enum ApiRoutes {
  getBoard = '/board',
  postBoard = '/board',
  getStatus = '/board/status',
  getCell = '/board/cell',
  getCell1 = '/board/cell',
}

export type CellDataType = {
  name: string | unknown;
  color: string | unknown;
  _id?: string;
  data?: {
    from?: string;
    color?: string;
  };
  createdAt: string;
};
