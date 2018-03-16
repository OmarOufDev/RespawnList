export default class Utilities {
    constructor(private value: any, private name: string) {
    }

    // checks that the value exists.
    exists() {
        if (!this.value) {
            throw new TypeError(` ${this.name} is null `);
        }
    }

    // change value to boolean
    toBoolean() {
        this.exists();
        this.value = String(this.value);
        if (this.value.toLowerCase() === "true"  || this.value === "1") {
            return true;
        } else if ( this.value.toLowerCase() === "false" || this.value === "0") {
            return false;
        } else {
            throw new TypeError(` ${this.name} is not a boolean `);
        }
    }

    // checks that the value is a proper hour value.
    isHour() {
        this.value = Number(this.value);
        if (this.value === undefined || this.value === null || this.value < 0 || this.value > 23) {
            throw new TypeError(` ${this.name} is Not Hour`);
        }
    }

}
