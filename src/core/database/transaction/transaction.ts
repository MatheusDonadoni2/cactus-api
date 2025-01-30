export interface ITransactionsFunctions {
  startTransaction(): void;
  commitTransaction(): void;
  rollbackTransaction(): void;
}
