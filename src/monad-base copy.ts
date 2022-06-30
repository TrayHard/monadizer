import { Nullable } from "./types";

enum MonadNames {
  'Bind' = 'Bind',
  'Clone' = 'Clone',
  'If' = 'If',
  'Either' = 'Either',
}

type BasicErrorConstructorArgs = {
  message?: string,
  name?: string,
  debug?: object,
  errorObject?: Error
}

type BasicErrorConstructor = (
  message: BasicErrorConstructorArgs['message'],
  name: BasicErrorConstructorArgs['name'],
  debug: BasicErrorConstructorArgs['debug'],
  errorObject: BasicErrorConstructorArgs['errorObject']
) => void;

class BasicError extends Error {
  private _name: string = 'Error';
  private _debug?: object;
  private _wrappedError?: Error;

  // constructor(message: Parameters<BasicErrorConstructor>['message'], name, debug, errorObject): BasicErrorConstructor {
  constructor(
    message: BasicErrorConstructorArgs['message'],
    name: BasicErrorConstructorArgs['name'],
    debug: BasicErrorConstructorArgs['debug'],
    errorObject: BasicErrorConstructorArgs['errorObject']
  ) {
    if (message !== undefined && typeof message !== 'string') {
      throw new Error('Argument "message" must be string')
    }
    super(message);

    if (name !== undefined) {
      if (typeof name !== 'string') throw new Error('Argument "name" must be string')
      else this._name = name;
    }

    if (this._wrappedError instanceof Error) {
      this._wrappedError = errorObject;
    } else {
      throw new Error('Argument "errorObject" must be "Error"')
    }

    if (debug) {
      if (typeof debug === 'object') {
        this._debug = debug;
        deepFreeze(this._debug);
      } else {
        throw new Error('Argument "debug" must be object')
      }
    }
  }

  public get name() {
    return this._name;
  }

  public get debug() {
    return this._debug;
  }

  public of(e: Error, message?: string, name?: string, debug: object) {
    return new BasicError(message ?? e.message, name ?? e.name, debug, e);
  }
}

try {

} catch (error) {
  throw new BasicError()
}

class AxiosConnectError extends BasicError {
  constructor(...params: Parameters<BasicErrorConstructor>) {
    super(...params)

    params[0]
  }
}

type ErrHandlerFunction = (e: BasicError)

class MonadBase {
  constructor(value: unknown, errHandler?: Nullable<Function>) {
    // if (!value instanceof MonadBase) {
    //   return new MonadBase
    // }
  }
}
