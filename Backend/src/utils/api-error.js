class ApiError extends Error {
  // Defines a custom error class that inherits from JavaScript's built-in Error class
  constructor( // Constructor function that runs when creating a new ApiError instance
    statusCode, // HTTP status code (e.g., 404 for not found, 500 for server error)
    message = "Something went wrong", // Error message; defaults to "Something went wrong" if not provided
    errors = [], // Array of additional error details (e.g., validation errors); defaults to empty array
    stack = "", // Custom stack trace string; defaults to empty if not provided
  ) {
    super(message); // Calls the parent Error class constructor with the message to set up basic error properties
    this.statusCode = statusCode; // Sets the HTTP status code on the error object
    this.data = null; // Placeholder for any additional data (set to null by default)
    this.message = message; // Sets the error message (overwrites if needed, but matches the default)
    this.success = false; // Always false for errors, indicating the operation failed
    this.errors = errors; // Sets the array of additional errors
    if (stack) {
      // If a custom stack trace is provided
      this.stack = stack; // Use the provided stack trace
    } else {
      // If no stack is provided
      Error.captureStackTrace(this, this.constructor); // Automatically generate a stack trace starting from the caller (not this constructor)
    }
  }
}

export { ApiError }; // Exports the ApiError class so it can be imported and used in other files
