export enum MessageAction {
  SELECT_CREDENTIAL = 'select-credential',
  CANCEL_SELECT_CREDENTIAL = 'cancel-select-credential',
}

export class NoOpenerError extends Error {
  constructor() {
    super('No window.opener found');
    this.name = 'NoOpenerError';
  }
}
