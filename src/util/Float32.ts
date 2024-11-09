export class Float32 {
    private value: number;

    constructor(value: number) {
        // Ensure the value is stored as 32-bit float
        this.value = Math.fround(value);
    }

    // Addition with 32-bit precision, accepting Float32 or number
    add(other: Float32 | number): Float32 {
        const otherValue = other instanceof Float32 ? other.value : Math.fround(other);
        return new Float32(Math.fround(this.value + otherValue));
    }

    // Subtraction with 32-bit precision, accepting Float32 or number
    subtract(other: Float32 | number): Float32 {
        const otherValue = other instanceof Float32 ? other.value : Math.fround(other);
        return new Float32(Math.fround(this.value - otherValue));
    }

    // Multiplication with 32-bit precision, accepting Float32 or number
    multiply(other: Float32 | number): Float32 {
        const otherValue = other instanceof Float32 ? other.value : Math.fround(other);
        return new Float32(Math.fround(this.value * otherValue));
    }

    // Division with 32-bit precision, accepting Float32 or number
    divide(other: Float32 | number): Float32 {
        const otherValue = other instanceof Float32 ? other.value : Math.fround(other);
        if (otherValue === 0) throw new Error("Division by zero");
        return new Float32(Math.fround(this.value / otherValue));
    }

	floor(): Float32 {
        return new Float32(Math.floor(this.value));
    }

    // Getter to retrieve the 32-bit float value
    getValue(): number {
        return this.value;
    }

	toString(): string {
		return this.value.toString();
	}
}