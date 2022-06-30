import { BasicError } from "./error";
import type { Nullable } from "./types";

enum MonadNames {
  "Bind" = "Bind",
  "Clone" = "Clone",
  "If" = "If",
  "Either" = "Either",
}

export type ErrHandlerFunction = (e: BasicError | Error) => void;

export class MonadBase {
  private _value: unknown;
  private _errHandler: Nullable<ErrHandlerFunction>;

  constructor(value: unknown, errHandler?: Nullable<ErrHandlerFunction>) {
    if (value instanceof MonadBase) {
      return value;
    }
    this._value = value;
    this._errHandler = errHandler;
    return this;
  }
}
