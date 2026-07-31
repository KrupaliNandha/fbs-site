export class AuthError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export function getErrorResponse(error: unknown) {
  if (error instanceof AuthError) {
    return { message: error.message, status: error.status };
  }

  console.error(error);
  return { message: "Unexpected server error.", status: 500 };
}
