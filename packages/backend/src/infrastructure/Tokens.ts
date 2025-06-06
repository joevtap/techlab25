export const TOKENS = {
  TOKEN_SERVICE: Symbol.for('TokenService'),
  PASSWORD_HASHER: Symbol.for('PasswordHasher'),
  ID_GENERATOR: Symbol.for('IdGenerator'),
  DATA_SOURCE: Symbol.for('DataSource'),
  UOW: Symbol.for('UnitOfWork'),
  USER_REPOSITORY: Symbol.for('UserRepository'),
  USER_SERVICE: Symbol.for('UserService'),
  ACCOUNT_REPOSITORY: Symbol.for('AccountRepository'),
  ACCOUNT_SERVICE: Symbol.for('AccountService'),
  TRANSACTION_REPOSITORY: Symbol.for('TransactionRepository'),
  TRANSACTION_SERVICE: Symbol.for('TransactionService'),
  USER_CONTROLLER: Symbol.for('UserController'),
  ACCOUNT_CONTROLLER: Symbol.for('AccountController'),
  TRANSACTION_CONTROLLER: Symbol.for('TransactionController'),
};
