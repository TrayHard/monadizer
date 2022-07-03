export class BasicError extends Error {
  private _name: string = "Error";
  private _debug?: object;
  private _wrappedError?: Error;

  constructor(
    message?: string,
    name?: string,
    debug?: object,
    errorObject?: Error
  ) {
    if (message !== undefined && typeof message !== "string") {
      throw new Error('Argument "message" must be string');
    }
    super(message);

    if (name !== undefined) {
      if (typeof name !== "string")
        throw new Error('Argument "name" must be string');
      else this._name = name;
    }

    if (debug !== undefined) {
      if (typeof debug === "object") {
        this._debug = debug;
        deepFreeze(this._debug);
      } else {
        throw new Error('Argument "debug" must be object');
      }
    }

    if (errorObject !== undefined) {
      if (errorObject instanceof Error) {
        this._wrappedError = errorObject;
      } else {
        throw new Error('Argument "errorObject" must be "Error"');
      }
    }
  }

  public get name() {
    return this._name;
  }

  public get debug() {
    return this._debug;
  }

  public static of(
    e: Error,
    message?: string,
    name?: string,
    debug?: object
  ): BasicError {
    return new BasicError(message ?? e.message, name ?? e.name, debug, e);
  }

  public static wrap(x: unknown): BasicError {
    let e = new Error();
    return new BasicError(e.message, e.name, { wrapped: x }, e);
  }

  public static transform(x: unknown): BasicError {
    let basicError;
    if (!(x instanceof Error) && !(x instanceof BasicError)) {
      basicError = BasicError.wrap(x);
    } else if (!(x instanceof BasicError)) {
      basicError = BasicError.of(x);
    } else {
      basicError = x;
    }
    return basicError;
  }
}
