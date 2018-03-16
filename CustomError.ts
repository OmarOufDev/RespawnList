export class CustomError extends Error {
    constructor(readonly errorCategory: any, readonly errorMessage: any, ...params: any[]) {
        super(...params);
        Object.setPrototypeOf(this, CustomError.prototype);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }
    }
    public get ErrorCategory() {
        return this.errorCategory;
    }
    public get ErrorMessage() {
        return this.errorMessage;
    }
    public logError() {
        console.error(`\n\tErrorCategory: ${this.errorMessage}\n\tErrorMessage: ${this.errorMessage}\n`);
        console.error(this.stack);
    }
}

export enum ErrorCategory {
    "Conflict",
    "ResourceNotFound",
    "InputError",
}
