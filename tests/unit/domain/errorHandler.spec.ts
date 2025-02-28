import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import {
  errorMiddleware,
  AppError,
} from "../../../src/infrastructure/middlewares/errorHandler";

// Mock request, response, and next function
const mockRequest = {} as Request;
const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as unknown as Response;
const mockNext = vi.fn() as NextFunction;

describe("errorMiddleware", () => {
  it("should handle an AppError and return correct status and message", () => {
    const error = new AppError("Custom Error", 400);
    errorMiddleware(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: "Custom Error" });
  });

  it("should handle a generic error and return status 500", () => {
    const error = new Error("Internal Server Error");
    errorMiddleware(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
