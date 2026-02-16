<br/>
<p align="center">
  <a href="https://motion-canvas.github.io">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://motion-canvas.github.io/img/logo_dark.svg">
      <img width="180" alt="Motion Canvas logo" src="https://motion-canvas.github.io/img/logo.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://lerna.js.org"><img src="https://img.shields.io/badge/published%20with-lerna-c084fc?style=flat" alt="published with lerna"></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/powered%20by-vite-646cff?style=flat" alt="powered by vite"></a>
  <a href="https://www.npmjs.com/package/@motion-canvas/core"><img src="https://img.shields.io/npm/v/@motion-canvas/core?style=flat" alt="npm package version"></a>
  <a href="https://chat.motioncanvas.io"><img src="https://img.shields.io/discord/1071029581009657896?style=flat&logo=discord&logoColor=fff&color=404eed" alt="discord"></a>
</p>
<br/>

# efx-motion-canvas

efx-motion-canvas is a fork of Motion Canvas, enhanced with a
**Ratio-Independent Animation System**. This allows creating a single animation
build that adapts to any aspect ratio at runtime.

## Key Features

### Ratio-Independent Animations (NEW)

Create animations that work across all aspect ratios with a single build:

```typescript
import { useResponsive, viewLayout } from '@layout'

export default makeScene2D(function* (view) {
  const l = viewLayout(view.width(), view.height())

  const config = useResponsive({
    base: { fontSize: 80 },
    portrait: { fontSize: 100 },
    '9x16': { fontSize: 100 },
  })

  view.add(<Txt fontSize={l.sz(config.fontSize)} />)
})
```

### Supported Ratios

- `16x9` - Standard landscape (default)
- `9x16` - Portrait mobile / TikTok
- `4x3` - Traditional TV
- `1x1` - Square / Instagram
- `fullwindow` - Full viewport coverage

## Packages

| Package                             | Description                                        |
| ----------------------------------- | -------------------------------------------------- |
| `@efxlab/motion-canvas-core`        | Core animation engine with threadable generators   |
| `@efxlab/motion-canvas-2d`          | 2D rendering components (Circle, Rect, Text, etc.) |
| `@efxlab/motion-canvas-responsive`  | **NEW** Ratio-independent animation system         |
| `@efxlab/motion-canvas-player`      | Web component player for embedding animations      |
| `@efxlab/motion-canvas-ui`          | UI components for animation playback controls      |
| `@efxlab/motion-canvas-vite-plugin` | Vite plugin for building animations                |

## Responsive Hooks

The responsive package provides several hooks for ratio-independent animations:

### useResponsive<T>(config): T

Resolves properties with cascading overrides:
`base → ratioClass → specificRatio`

```typescript
const props = useResponsive({
  base: {x: 0.1, y: 0.2, size: 100},
  portrait: {x: 0, y: 0.15},
  '9x16': {size: 120},
});
// In 9x16: { x: 0, y: 0.15, size: 120 }
```

### useRatio(): ResponsiveLayout

Returns current layout with ratio info:

```typescript
const layout = useRatio();
// layout.ratio → '9x16'
// layout.isPortrait → true
// layout.sz(64), layout.sx(0.5) → pixel values
```

### useRatioEffect(ratio, callback)

Conditional effect for specific ratios:

```typescript
useRatioEffect('portrait', () => {
  view.add(<PortraitOverlay />)
  return () => overlay.remove()
})
```

### useRatioElement(config)

Conditional rendering:

```typescript
const mobileElement = useRatioElement({
  only: ['9x16', 'portrait'],
  element: () => <MobileWatermark />
})
```

### useResponsiveAnimation(config)

Animation parameter overrides:

```typescript
const anim = useResponsiveAnimation({
  base: {duration: 0.5, easing: easeInOut},
  portrait: {duration: 0.3},
});

yield * element.opacity(1, anim.duration, anim.easing);
```

## Helper Functions

Position, scale, rotation, visibility, color, path, and filter helpers:

```typescript
import {
  position,
  scale,
  rotation,
  visibility,
  color,
  path,
  filter,
} from '@efxlab/motion-canvas-responsive';
```

### Position Helpers

```typescript
// Off-screen (element fully outside view)
offLeft(margin); // x = -viewWidth/2 - elementWidth/2 - margin
offRight(margin); // x = +viewWidth/2 + elementWidth/2 + margin
offTop(margin); // y = -viewHeight/2 - elementHeight/2 - margin
offBottom(margin); // y = +viewHeight/2 + elementHeight/2 + margin

// Edge-aligned (element inside view, touching edge)
fromLeft(margin); // Element's left edge at view's left edge + margin
fromRight(margin); // Element's right edge at view's right edge - margin
fromTop(margin); // Element's top edge at view's top edge + margin
fromBottom(margin); // Element's bottom edge at view's bottom edge - margin

// Usage with responsive config
const pos = position({
  base: {x: 100, y: 50},
  portrait: {x: 50, y: 100},
});
```

### Rotation Helpers

```typescript
rotate: {
  spin(turns); // Full rotations: spin(2) = 720deg
  spinCW(turns); // Clockwise only
  spinCCW(turns); // Counter-clockwise only

  // Pivot offset (rotation center)
  pivot: {
    center(); // Default: element center
    topLeft();
    topRight();
    bottomLeft();
    bottomRight();
    custom(x, y); // Offset from center in pixels
  }
}

// Usage
element.pivot(rotate.pivot.topLeft());
yield * element.rotation(rotate.spin(1), 1.5);
```

### Scale Helpers

```typescript
scale: {
  from(value); // scale.from(0) = start invisible
  to(value); // scale.to(2) = double size
  pop(); // Quick bounce: 1 -> 1.1 -> 1
  pulse(intensity); // Pulsing scale animation
}

transform: {
  scaleX(value); // Horizontal stretch
  scaleY(value); // Vertical stretch
  skewX(degrees); // Horizontal skew
  skeY(degrees); // Vertical skew
}

// Usage
yield * element.scale(scale.from(0).to(1), 1);
```

### Visibility Helpers

```typescript
opacity: {
  fadeIn(duration);
  fadeOut(duration);
  flash(times); // Quick flash effect
  blink(interval); // Repeating blink
}

// Usage
yield * element.opacity(opacity.fadeIn(1));
```

### Color/Style Helpers

```typescript
color: {
  tint(from, to);
  highlight(color); // Quick color flash
  gradient(colors); // Cycle through colors
}

stroke: {
  draw(duration); // Line drawing animation
  dash(length, gap);
}
```

### Motion Path Helpers

```typescript
path: {
  arc(startAngle, endAngle, radius);
  bezier(controlPoints);
  orbit(centerX, centerY, radius);
  wave(amplitude, frequency);
  shake(intensity); // Random shake
  wobble(intensity); // Organic wobble
}

// Usage
yield * path.orbit(0, 0, 200, 2);
```

### Filter Helpers

```typescript
filter: {
  blur(from, to);
  brightness(value);
  contrast(value);
  saturate(value);
  grayscale(value); // 0-1
}
```

### Combined Example

```typescript
const layout = useRatio();

// Element slides in from left, rotates, and scales up
yield *
  all(
    element.x(offLeft(0), 0),
    element.x(fromRight(50), 1.5, easeOutCubic),
    element.rotation(rotate.spin(1), 1.5),
    element.scale(scale.from(0).to(1), 1),
  );

// Rotate around top-left corner
element.pivot(rotate.pivot.topLeft());
yield * element.rotation(90, 0.5);

// Path animation - orbit around center
yield * path.orbit(0, 0, 200, 2);
```

## Custom Ratio Registration

Register custom aspect ratios beyond the built-in defaults:

```typescript
import {
  registerCustomRatios,
  useResponsive,
} from '@efxlab/motion-canvas-responsive';

// Register custom ratios
registerCustomRatios({
  cinema: {aspect: '21:9'},
  story: {aspect: '9:18'},
  portrait2: {aspect: '3:4'},
});

// Use custom ratios in your scene
const config = useResponsive({
  base: {fontSize: 80},
  cinema: {fontSize: 100}, // Custom ratio
  story: {fontSize: 90}, // Custom ratio
});
```

### Built-in Ratios

| Ratio ID     | Aspect | Class     |
| ------------ | ------ | --------- |
| `16x9`       | 16:9   | landscape |
| `9x16`       | 9:16   | portrait  |
| `4x3`        | 4:3    | landscape |
| `1x1`        | 1:1    | square    |
| `fullwindow` | auto   | computed  |

### Ratio Class Detection

- `ar > 2` → `ultrawide`
- `ar > 1` → `landscape`
- `ar === 1` → `square`
- `ar < 1` → `portrait`

## Player API

```typescript
const player = document.querySelector('motion-canvas-player');

// Playback
player.play();
player.pause();

// Ratio control (responsive templates)
player.setRatio('9x16'); // Switch ratio at runtime
player.getRatio(); // Get current ratio

// Variables
player.player.setVariables({titleText: 'New Title'});
```

## Build Commands

### Development

```bash
cd apps/packages/efx-motion-canvas

# Watch mode for specific package
pnpm core:dev
pnpm 2d:dev
pnpm player:dev
pnpm ui:dev
```

### Build

```bash
# Build specific package
pnpm core:build
pnpm 2d:build
pnpm player:build

# Bundle for distribution
pnpm core:bundle
pnpm 2d:bundle
```

### Testing

```bash
# Run tests for specific package
pnpm core:test
pnpm 2d:test

# Or use pnpm filter
pnpm --filter @efxlab/motion-canvas-core test
pnpm --filter @efxlab/motion-canvas-2d test
pnpm --filter @efxlab/motion-canvas-responsive test

# Run single test file
pnpm --filter @efxlab/motion-canvas-responsive test -- src/hooks/useResponsive.test.ts
```

### Linting

```bash
pnpm eslint           # Run ESLint
pnpm eslint:fix       # Fix ESLint issues
pnpm prettier         # Check Prettier
pnpm prettier:fix     # Fix with Prettier
```

## Project Structure

```
apps/packages/efx-motion-canvas/
├── packages/
│   ├── core/              # Core animation engine
│   │   └── src/
│   │       ├── app/       # Player application
│   │       ├── scenes/   # Scene management
│   │       └── threading/ # Threadable generators
│   ├── 2d/               # 2D rendering components
│   │   └── src/
│   │       └── components/ # Circle, Rect, Img, etc.
│   ├── responsive/       # NEW Ratio-independent animations
│   │   └── src/
│   │       ├── hooks/    # useRatio, useResponsive, etc.
│   │       ├── helpers/  # position, scale, rotation
│   │       ├── components/ # RatioLayer, ParticleGroup
│   │       └── context/  # ResponsiveContext
│   ├── player/           # Web component player
│   ├── ui/              # UI controls
│   └── vite-plugin/    # Build plugin
```

## Developing

### Editor

```bash
pnpm template:dev
```

Starts a vite server that watches the `core`, `2d`, `ui`, and `vite-plugin`
packages.

### Player

```bash
pnpm template:build
pnpm player:dev
```

## Tech Stack

- **TypeScript** - Type safety throughout
- **Vite** - Fast builds with hot reload
- **Vitest** - Unit testing
- **ESLint + Prettier** - Code quality

## License

This project is based on
[Motion Canvas](https://github.com/motion-canvas/motion-canvas).

[docs]: https://motioncanvas.io/docs/quickstart
