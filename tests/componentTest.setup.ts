import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import "@testing-library/jest-dom";

expect.extend(matchers);

window.HTMLElement.prototype.animate = () => ({
    cancel: () => {},
    finish: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    onfinish: null,
    oncancel: null,
} as unknown as Animation);