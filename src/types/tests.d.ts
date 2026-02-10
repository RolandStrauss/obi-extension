declare function suite(name: string, fn: () => void): void;
declare function test(name: string, fn: () => void): void;
declare function before(fn: () => void): void;
declare function after(fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function afterEach(fn: () => void): void;
