import {describe, expect, it} from 'vitest';
import {createResponsiveLayout} from '../layout/ResponsiveLayout';

describe('ResponsiveLayout', () => {
  describe('createResponsiveLayout', () => {
    it('should create layout for 16:9 landscape', () => {
      const layout = createResponsiveLayout(1920, 1080, '16x9');

      expect(layout.ratio).toBe('16x9');
      expect(layout.ratioClass).toBe('landscape');
      expect(layout.width).toBe(1920);
      expect(layout.height).toBe(1080);
      expect(layout.ar).toBeCloseTo(1.778, 2);
      expect(layout.isLandscape).toBe(true);
      expect(layout.isPortrait).toBe(false);
    });

    it('should create layout for 9:16 portrait', () => {
      const layout = createResponsiveLayout(1080, 1920, '9x16');

      expect(layout.ratio).toBe('9x16');
      expect(layout.ratioClass).toBe('portrait');
      expect(layout.isPortrait).toBe(true);
      expect(layout.isLandscape).toBe(false);
    });

    it('should create layout for 1:1 square', () => {
      const layout = createResponsiveLayout(1080, 1080, '1x1');

      expect(layout.ratioClass).toBe('square');
      expect(layout.isSquare).toBe(true);
    });

    it('should create layout for 21:9 ultrawide', () => {
      const layout = createResponsiveLayout(2520, 1080, '21x9');

      expect(layout.ratioClass).toBe('ultrawide');
      expect(layout.isUltrawide).toBe(true);
    });

    it('should calculate px correctly', () => {
      const layout = createResponsiveLayout(1920, 1080, '16x9');

      expect(layout.px(0)).toBe(0);
      expect(layout.px(-0.5)).toBe(-960);
      expect(layout.px(0.5)).toBe(960);
    });

    it('should calculate py correctly', () => {
      const layout = createResponsiveLayout(1920, 1080, '16x9');

      expect(layout.py(0)).toBe(0);
      expect(layout.py(-0.5)).toBe(-540);
      expect(layout.py(0.5)).toBe(540);
    });

    it('should calculate sz correctly', () => {
      const layout = createResponsiveLayout(1920, 1080, '16x9');

      expect(layout.sz(1080)).toBe(1080); // base 1080 at 1080 min dimension
      expect(layout.sz(64)).toBeCloseTo(64);
    });

    it('should calculate half dimensions', () => {
      const layout = createResponsiveLayout(1920, 1080, '16x9');

      expect(layout.hw).toBe(960);
      expect(layout.hh).toBe(540);
    });

    it('should calculate padding correctly', () => {
      const layout = createResponsiveLayout(1920, 1080, '16x9');

      // topPad: -h/2 + sz(padding)
      // -540 + (100 * scale) where scale = 1080/1080 = 1
      expect(layout.topPad(100)).toBe(-440);

      // bottomPad: h/2 - sz(padding)
      expect(layout.bottomPad(100)).toBe(440);
    });
  });
});
