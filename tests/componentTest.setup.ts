import { expect, vi } from 'vitest';
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

vi.stubGlobal('IntersectionObserver', vi.fn(function() {
    return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    };
}));

vi.mock('svelte/transition', () => ({
    slide: () => ({
        duration: 0,
        delay: 0,
        css: () => ''
    }),
    fade: () => ({
        duration: 0,
        delay: 0,
        css: () => ''
    }),
}));