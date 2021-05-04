class HttpException extends Error {
  type: string;
  status: number;
  title: string;
  detail: string;

  constructor(status: number, type: string, message: string, title: string, detail: string) {
    super(message);
    this.status = status;
    this.type = type;
    this.title = title;
    this.detail = detail;
  }
}

export default HttpException;
