export interface VisibilityHelpers {
  fadeIn: (duration: number) => {from: number; to: number; duration: number};
  fadeOut: (duration: number) => {from: number; to: number; duration: number};
  flash: (times: number) => {times: number; duration: number};
  blink: (interval: number) => {interval: number};
}

export const opacity: VisibilityHelpers = {
  fadeIn: (duration: number) => ({from: 0, to: 1, duration}),
  fadeOut: (duration: number) => ({from: 1, to: 0, duration}),
  flash: (times: number) => ({times, duration: times * 0.2}),
  blink: (interval: number) => ({interval}),
};
