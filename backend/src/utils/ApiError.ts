export class ApiError extends Error {
  public statusCode:number
  public errors:unknown[]
  public success:boolean
  public isOperational:boolean
  
  constructor(
    statusCode:number,
    message:string = "Something went wrong",
    errors:unknown[] = [],
    stack:string = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.isOperational = true;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
