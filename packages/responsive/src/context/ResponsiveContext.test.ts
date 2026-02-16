import {describe, expect, it} from 'vitest';
import {
  detectRatioClass,
  endResponsive,
  getGlobalRatio,
  parseRatioString,
  setGlobalRatio,
  startResponsive,
  useResponsiveContext,
} from '../context/ResponsiveContext';
import type {RatioClass} from '../types';

describe('ResponsiveContext', () => {
  describe('detectRatioClass', () => {
    it('should detect landscape ratios (ar > 1)', () => {
      expect(detectRatioClass(16 / 9)).toBe('landscape');
      expect(detectRatioClass(4 / 3)).toBe('landscape');
      expect(detectRatioClass(2)).toBe('landscape');
    });

    it('should detect portrait ratios (ar < 1)', () => {
      expect(detectRatioClass(9 / 16)).toBe('portrait');
      expect(detectRatioClass(3 / 4)).toBe('portrait');
      expect(detectRatioClass(0.5)).toBe('portrait');
    });

    it('should detect square ratios (ar === 1)', () => {
      expect(detectRatioClass(1)).toBe('square');
    });

    it('should detect ultrawide ratios (ar > 2)', () => {
      expect(detectRatioClass(21 / 9)).toBe('ultrawide');
      expect(detectRatioClass(3)).toBe('ultrawide');
    });
  });

  describe('parseRatioString', () => {
    it('should parse colon-separated ratios', () => {
      expect(parseRatioString('16:9')).toBe(16 / 9);
      expect(parseRatioString('9:16')).toBe(9 / 16);
      expect(parseRatioString('4:3')).toBe(4 / 3);
    });

    it('should parse x-separated ratios', () => {
      expect(parseRatioString('16x9')).toBe(16 / 9);
      expect(parseRatioString('9x16')).toBe(9 / 16);
    });

    it('should default to 16:9 for invalid input', () => {
      expect(parseRatioString('invalid')).toBe(16 / 9);
    });
  });

  describe('global state', () => {
    it('should set and get global ratio', () => {
      setGlobalRatio('9x16', 1080, 1920);
      const state = getGlobalRatio();

      expect(state.ratio).toBe('9x16');
      expect(state.width).toBe(1080);
      expect(state.height).toBe(1920);
      expect(state.ratioClass).toBe('portrait');
    });

    it('should update ratio class when width/height changes', () => {
      setGlobalRatio('16x9', 1920, 1080);
      let state = getGlobalRatio();
      expect(state.ratioClass).toBe('landscape');

      setGlobalRatio('9x16', 1080, 1920);
      state = getGlobalRatio();
      expect(state.ratioClass).toBe('portrait');
    });
  });

  describe('stack operations', () => {
    it('should push and pop responsive state', () => {
      const state = {
        ratio: '16x9',
        ratioClass: 'landscape' as RatioClass,
        width: 1920,
        height: 1080,
      };

      startResponsive(state);
      const result = useResponsiveContext();
      expect(result.ratio).toBe('16x9');

      endResponsive(state);
      const afterPop = useResponsiveContext();
      expect(afterPop.ratio).toBe('9x16'); // falls back to global
    });

    it('should throw on mismatched endResponsive', () => {
      const state1 = {
        ratio: '16x9',
        ratioClass: 'landscape' as RatioClass,
        width: 1920,
        height: 1080,
      };
      const state2 = {
        ratio: '9x16',
        ratioClass: 'portrait' as RatioClass,
        width: 1080,
        height: 1920,
      };

      startResponsive(state1);
      expect(() => endResponsive(state2)).toThrow();
    });
  });
});
