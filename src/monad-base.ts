import { BasicError } from "./error";

enum MonadNames {
  "bind" = "bind",
  "clone" = "clone",
  "if" = "if",
  "either" = "either",
}

export class Result {
  private _value: unknown;
  private _resultStatus: "Success" | "Failure" = "Success";
  private _errorStack: BasicError[] = [];

  constructor(value: unknown, errors: Array<unknown> = []) {
    if (value instanceof Result) {
      return value;
    }
    this._value = value;

    if (errors !== undefined) {
      if (!Array.isArray(errors))
        throw new Error('"errors" argument should be an array');
      for (const err of errors) {
        this._errorStack.push(BasicError.transform(err));
      }
      this._resultStatus = "Failure";
    }
  }

  public get value(): Result['_value'] {
    return this._value;
  }

  public get isSuccess(): boolean {
    return this._resultStatus === "Success";
  }

  public get isFailure(): boolean {
    return this._resultStatus === "Failure";
  }

  private _doAndLogIfError(f: Function, isFailure?: boolean): Result {
    try {
      f(isFailure === true ? this._errorStack : this.value);
    } catch (e) {
      this._errorStack.unshift(BasicError.transform(e));
      this._resultStatus = "Failure";
    } finally {
      return this;
    }
  }

  public doOnSuccess(f: Function): Result {
    if (!this.isSuccess) return this;
    return this._doAndLogIfError(f);
  }

  public doOnFailure(f: Function): Result {
    if (!this.isFailure) return this;
    return this._doAndLogIfError(f, true);
  }

  public doAnyway(f: Function): Result {
    return this._doAndLogIfError(f);
  }

  public mapErrors(f: Function): Result {
    for (const error of this._errorStack) {
      f(error);
    }
    return this;
  }
}

export function wrapResult(value: unknown): Result {
  return new Result(value);
}

export function wrapResultAsFailure(errors: unknown[]): Result {
  return new Result(undefined, errors);
}
