export declare global {
  namespace Express {
    interface Request {
      user?: Record<string, unknown>;
    }
  }
}
