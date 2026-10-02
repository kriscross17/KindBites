export class ConfigurationError extends Error {
  readonly statusCode = 500
  readonly code = 'CONFIGURATION_ERROR'

  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
    Object.setPrototypeOf(this, new.target.prototype)
  }
}
