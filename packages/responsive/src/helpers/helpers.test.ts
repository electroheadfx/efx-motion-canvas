import {describe, expect, it} from 'vitest';
import {color, stroke} from './color';
import {filter} from './filter';
import {path} from './path';
import {rotate} from './rotation';
import {scale, transform} from './scale';
import {opacity} from './visibility';

describe('Rotation Helpers', () => {
  describe('rotate.spin', () => {
    it('should convert turns to degrees', () => {
      expect(rotate.spin(1)).toBe(360);
      expect(rotate.spin(2)).toBe(720);
      expect(rotate.spin(0.5)).toBe(180);
    });
  });

  describe('rotate.spinCW', () => {
    it('should return positive degrees', () => {
      expect(rotate.spinCW(1)).toBe(360);
    });
  });

  describe('rotate.spinCCW', () => {
    it('should return negative degrees', () => {
      expect(rotate.spinCCW(1)).toBe(-360);
    });
  });

  describe('rotate.pivot', () => {
    it('should return center pivot', () => {
      expect(rotate.pivot.center()).toEqual({x: 0, y: 0});
    });

    it('should return corner pivots', () => {
      expect(rotate.pivot.topLeft()).toEqual({x: -0.5, y: -0.5});
      expect(rotate.pivot.topRight()).toEqual({x: 0.5, y: -0.5});
      expect(rotate.pivot.bottomLeft()).toEqual({x: -0.5, y: 0.5});
      expect(rotate.pivot.bottomRight()).toEqual({x: 0.5, y: 0.5});
    });

    it('should return custom pivot', () => {
      expect(rotate.pivot.custom(100, 50)).toEqual({x: 100, y: 50});
    });
  });
});

describe('Scale Helpers', () => {
  describe('scale.from', () => {
    it('should create from-to config', () => {
      const result = scale.from(0);
      expect(result.from).toBe(0);
      expect(result.to).toBe(1);
    });
  });

  describe('scale.to', () => {
    it('should create from-to config', () => {
      const result = scale.to(2);
      expect(result.from).toBe(1);
      expect(result.to).toBe(2);
    });
  });

  describe('scale.pop', () => {
    it('should create bounce keyframes', () => {
      const result = scale.pop();
      expect(result.from).toBe(1);
      expect(result.to).toBe(1);
      expect(result.keyframes).toHaveLength(3);
      expect(result.keyframes[1].scale).toBe(1.1);
    });
  });

  describe('scale.pulse', () => {
    it('should create pulse range', () => {
      const result = scale.pulse(5);
      expect(result.from).toBe(0.5);
      expect(result.to).toBe(1.5);
    });
  });

  describe('transform', () => {
    it('should return transform values', () => {
      expect(transform.scaleX(2)).toBe(2);
      expect(transform.scaleY(2)).toBe(2);
      expect(transform.skewX(30)).toBe(30);
      expect(transform.skewY(30)).toBe(30);
    });
  });
});

describe('Visibility Helpers', () => {
  describe('opacity.fadeIn', () => {
    it('should create fade in config', () => {
      const result = opacity.fadeIn(1);
      expect(result.from).toBe(0);
      expect(result.to).toBe(1);
      expect(result.duration).toBe(1);
    });
  });

  describe('opacity.fadeOut', () => {
    it('should create fade out config', () => {
      const result = opacity.fadeOut(1);
      expect(result.from).toBe(1);
      expect(result.to).toBe(0);
    });
  });

  describe('opacity.flash', () => {
    it('should create flash config', () => {
      const result = opacity.flash(3);
      expect(result.times).toBe(3);
      expect(result.duration).toBeCloseTo(0.6);
    });
  });

  describe('opacity.blink', () => {
    it('should create blink config', () => {
      const result = opacity.blink(0.5);
      expect(result.interval).toBe(0.5);
    });
  });
});

describe('Color Helpers', () => {
  describe('color.tint', () => {
    it('should create tint config', () => {
      const result = color.tint('red', 'blue');
      expect(result.from).toBe('red');
      expect(result.to).toBe('blue');
    });
  });

  describe('color.highlight', () => {
    it('should create highlight config', () => {
      const result = color.highlight('yellow');
      expect(result.color).toBe('yellow');
      expect(result.duration).toBe(0.3);
    });
  });

  describe('color.gradient', () => {
    it('should create gradient config', () => {
      const result = color.gradient(['red', 'green', 'blue']);
      expect(result.colors).toEqual(['red', 'green', 'blue']);
      expect(result.duration).toBe(1.5);
    });
  });

  describe('stroke.draw', () => {
    it('should create draw config', () => {
      const result = stroke.draw(2);
      expect(result.duration).toBe(2);
    });
  });

  describe('stroke.dash', () => {
    it('should create dash config', () => {
      const result = stroke.dash(10, 5);
      expect(result.length).toBe(10);
      expect(result.gap).toBe(5);
    });
  });
});

describe('Path Helpers', () => {
  describe('path.arc', () => {
    it('should create arc config', () => {
      const result = path.arc(0, 180, 100);
      expect(result.startAngle).toBe(0);
      expect(result.endAngle).toBe(180);
      expect(result.radius).toBe(100);
    });
  });

  describe('path.orbit', () => {
    it('should create orbit config', () => {
      const result = path.orbit(0, 0, 200);
      expect(result.centerX).toBe(0);
      expect(result.centerY).toBe(0);
      expect(result.radius).toBe(200);
      expect(result.duration).toBe(2);
    });
  });

  describe('path.wave', () => {
    it('should create wave config', () => {
      const result = path.wave(50, 2);
      expect(result.amplitude).toBe(50);
      expect(result.frequency).toBe(2);
      expect(result.duration).toBe(1);
    });
  });

  describe('path.shake', () => {
    it('should create shake config', () => {
      const result = path.shake(10);
      expect(result.intensity).toBe(10);
      expect(result.duration).toBe(0.5);
    });
  });

  describe('path.wobble', () => {
    it('should create wobble config', () => {
      const result = path.wobble(5);
      expect(result.intensity).toBe(5);
      expect(result.duration).toBe(1);
    });
  });
});

describe('Filter Helpers', () => {
  describe('filter.blur', () => {
    it('should create blur config', () => {
      const result = filter.blur(0, 10);
      expect(result.from).toBe(0);
      expect(result.to).toBe(10);
      expect(result.duration).toBe(1);
    });
  });

  describe('filter.brightness', () => {
    it('should create brightness config', () => {
      const result = filter.brightness(1.5);
      expect(result.value).toBe(1.5);
      expect(result.duration).toBe(0.5);
    });
  });

  describe('filter.contrast', () => {
    it('should create contrast config', () => {
      const result = filter.contrast(1.2);
      expect(result.value).toBe(1.2);
    });
  });

  describe('filter.saturate', () => {
    it('should create saturate config', () => {
      const result = filter.saturate(2);
      expect(result.value).toBe(2);
    });
  });

  describe('filter.grayscale', () => {
    it('should create grayscale config', () => {
      const result = filter.grayscale(1);
      expect(result.value).toBe(1);
    });
  });
});
