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

    if (this._wrappedError instanceof Error) {
      this._wrappedError = errorObject;
    } else {
      throw new Error('Argument "errorObject" must be "Error"');
    }

    if (debug) {
      if (typeof debug === "object") {
        this._debug = debug;
        deepFreeze(this._debug);
      } else {
        throw new Error('Argument "debug" must be object');
      }
    }
  }

  public get name() {
    return this._name;
  }

  public get debug() {
    return this._debug;
  }

  public of(e: Error, message?: string, name?: string, debug?: object) {
    return new BasicError(message ?? e.message, name ?? e.name, debug, e);
  }
}