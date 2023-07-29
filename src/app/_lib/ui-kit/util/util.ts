export class Util {
  static coerceBooleanProperty(value: any): boolean {
    return value != null && `${value}` !== 'false';
  }

  static randomNumber(): string {
    const crypto = window.crypto;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array); // Compliant for security-sensitive use cases
    const random = crypto.getRandomValues(array)[0];
    return random?.toString() ? random?.toString() : 'random1234';
  }

}
