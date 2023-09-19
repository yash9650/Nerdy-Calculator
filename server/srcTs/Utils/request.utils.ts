import { Response } from "express";

interface IResponse<T> {
  success: boolean;
  result: T | null;
  statusCode: number;
  errorMessage: string;
}

export const successResponse = <T>(res: Response, data: T, code = 200) => {
  const response: IResponse<T> = {
    success: true,
    result: data,
    statusCode: code,
    errorMessage: "",
  };
  return res.status(code).json(response);
};
export const errorResponse = (
  res: Response,
  errorMessage: string,
  code = 400
) => {
  const response: IResponse<any> = {
    success: false,
    result: null,
    statusCode: code,
    errorMessage,
  };
  return res.status(code).json(response);
};
