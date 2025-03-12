export class ClientError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export class ServerError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}
