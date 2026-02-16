export interface FilterHelpers {
  blur: (
    from: number,
    to: number,
  ) => {from: number; to: number; duration: number};
  brightness: (value: number) => {value: number; duration: number};
  contrast: (value: number) => {value: number; duration: number};
  saturate: (value: number) => {value: number; duration: number};
  grayscale: (value: number) => {value: number; duration: number};
}

export const filter: FilterHelpers = {
  blur: (from: number, to: number) => ({from, to, duration: 1}),
  brightness: (value: number) => ({value, duration: 0.5}),
  contrast: (value: number) => ({value, duration: 0.5}),
  saturate: (value: number) => ({value, duration: 0.5}),
  grayscale: (value: number) => ({value, duration: 0.5}),
};
