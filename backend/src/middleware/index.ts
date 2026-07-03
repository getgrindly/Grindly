import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  } as ApiResponse<null>);
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not Found'
  } as ApiResponse<null>);
};
