export interface ColorHelpers {
  tint: (from: string, to: string) => {from: string; to: string};
  highlight: (color: string) => {color: string; duration: number};
  gradient: (colors: string[]) => {colors: string[]; duration: number};
}

export interface StrokeHelpers {
  draw: (duration: number) => {duration: number};
  dash: (length: number, gap: number) => {length: number; gap: number};
}

export const color: ColorHelpers = {
  tint: (from: string, to: string) => ({from, to}),
  highlight: (color: string) => ({color, duration: 0.3}),
  gradient: (colors: string[]) => ({colors, duration: colors.length * 0.5}),
};

export const stroke: StrokeHelpers = {
  draw: (duration: number) => ({duration}),
  dash: (length: number, gap: number) => ({length, gap}),
};
