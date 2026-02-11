import type {
  PlayerSettings,
  Project,
  StageSettings,
} from '@efxlab/motion-canvas-core';
import {Player, Stage} from '@efxlab/motion-canvas-core';

import {Vector2} from '@efxlab/motion-canvas-core';
import styles from './styles.scss?inline';
import html from './template.html?raw';

const TEMPLATE = `<style>${styles}</style>${html}`;
const ID = 'motion-canvas-player';

enum State {
  Initial = 'initial',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

class MotionCanvasPlayer extends HTMLElement {
  public static get observedAttributes() {
    return [
      'src',
      'quality',
      'width',
      'height',
      'auto',
      'variables',
      'responsive',
      'aspect-ratio',
      'fullscreen',
      'no-controls',
    ];
  }

  private get auto() {
    return this.hasAttribute('auto');
  }

  private get quality() {
    const attr = this.getAttribute('quality');
    return attr ? parseFloat(attr) : this.defaultSettings.resolutionScale;
  }

  private get width() {
    const attr = this.getAttribute('width');
    return attr ? parseFloat(attr) : this.defaultSettings.size.width;
  }

  private get height() {
    const attr = this.getAttribute('height');
    return attr ? parseFloat(attr) : this.defaultSettings.size.height;
  }

  private get variables() {
    try {
      const attr = this.getAttribute('variables');
      return attr ? JSON.parse(attr) : {};
    } catch {
      this.project.logger.warn(`Project variables could not be parsed.`);
      return {};
    }
  }

  private get responsive() {
    return this.hasAttribute('responsive');
  }

  private get aspectRatio() {
    const attr = this.getAttribute('aspect-ratio');
    if (!attr) return null;
    const [width, height] = attr.split(':').map(Number);
    return width && height ? width / height : null;
  }

  private get fullscreen() {
    return this.hasAttribute('fullscreen');
  }

  private get noControls() {
    return this.hasAttribute('no-controls');
  }

  private readonly root: ShadowRoot;
  private readonly canvas: HTMLCanvasElement;
  private readonly overlay: HTMLCanvasElement;
  private readonly button: HTMLDivElement;
  private readonly fullscreenButton: HTMLButtonElement;

  private state = State.Initial;
  private project: Project | null = null;
  private player: Player | null = null;
  private defaultSettings: PlayerSettings & StageSettings;
  private abortController: AbortController | null = null;
  private finished = false;
  private playing = false;
  private connected = false;
  private stage = new Stage();

  public constructor() {
    super();
    this.root = this.attachShadow({mode: 'open'});
    this.root.innerHTML = TEMPLATE;

    this.overlay = this.root.querySelector('.overlay');
    this.button = this.root.querySelector('.button');
    this.fullscreenButton = this.root.querySelector('.fullscreen-button');
    this.canvas = this.stage.finalBuffer;
    this.canvas.classList.add('canvas');
    this.root.prepend(this.canvas);

    // Click handler checks auto attribute dynamically (not at construction time)
    this.overlay.addEventListener('click', this.handleClick);
    this.button.addEventListener('mousedown', this.handleMouseDown);
    this.fullscreenButton.addEventListener('click', this.handleFullscreenClick);

    this.updateResponsiveMode();
    this.updateFullscreenMode();
    this.updateControlsVisibility();
    this.setState(State.Initial);
  }

  // Public API for external play/pause control (bypasses auto logic)
  public play() {
    if (this.state === State.Ready && this.player) {
      this.player.togglePlayback(true);
      this.playing = true;
      this.updateClass();
    }
  }

  public pause() {
    if (this.state === State.Ready && this.player) {
      this.player.togglePlayback(false);
      this.playing = false;
      this.updateClass();
    }
  }

  public get isPlaying() {
    return this.playing;
  }

  // Removed handleMouseMove and handleMouseLeave - no hover effects
  private handleMouseMove = () => {
    // Disabled - no hover effects
  };

  private handleMouseLeave = () => {
    // Disabled - no hover effects
  };

  private handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
  };

  private handleFullscreenClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.toggleFullscreen();
  };

  private toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  private updateResponsiveMode() {
    if (this.responsive) {
      this.dataset.responsive = '';
    } else {
      delete this.dataset.responsive;
    }
  }

  private updateFullscreenMode() {
    if (this.fullscreen) {
      this.dataset.fullscreenEnabled = '';
    } else {
      delete this.dataset.fullscreenEnabled;
    }
  }

  private updateControlsVisibility() {
    if (this.noControls) {
      this.button.style.display = 'none';
      this.fullscreenButton.style.display = 'none';
      this.overlay.style.pointerEvents = 'none';
      this.overlay.style.opacity = '0';
    } else {
      this.button.style.display = '';
      this.fullscreenButton.style.display = '';
      this.overlay.style.pointerEvents = '';
      this.overlay.style.opacity = '';
    }
  }

  private handleClick = () => {
    // Click to play is disabled - use external controls or auto mode
    if (this.auto) return;
    // In non-auto mode, clicking still toggles playback
    this.setPlaying(!this.playing);
  };

  private setState(state: State) {
    this.state = state;
    this.setPlaying(this.playing);
  }

  private setPlaying(value: boolean) {
    if (this.state === State.Ready && (value || this.auto)) {
      this.player?.togglePlayback(true);
      this.playing = true;
    } else {
      this.player?.togglePlayback(false);
      this.playing = false;
    }
    this.updateClass();
  }

  private updateClass() {
    this.overlay.className = `overlay state-${this.state}`;
    this.canvas.className = `canvas state-${this.state}`;
    this.overlay.classList.toggle('playing', this.playing);
    this.overlay.classList.toggle('auto', this.auto);

    if (this.connected) {
      if (!this.playing) {
        this.dataset.overlay = '';
      } else {
        delete this.dataset.overlay;
      }
    }
  }

  private async updateSource(source: string) {
    this.setState(State.Initial);

    this.abortController?.abort();
    this.abortController = new AbortController();

    let project: Project;
    try {
      const promise = import(
        /* webpackIgnore: true */ /* @vite-ignore */ source
      );
      const delay = new Promise(resolve => setTimeout(resolve, 200));
      await Promise.any([delay, promise]);
      this.setState(State.Loading);
      project = (await promise).default;
    } catch (e) {
      console.error(e);
      this.setState(State.Error);
      return;
    }

    this.defaultSettings = project.meta.getFullRenderingSettings();
    const player = new Player(project);
    player.setVariables(this.variables);

    this.finished = false;
    this.player?.onRender.unsubscribe(this.render);
    this.player?.togglePlayback(false);
    this.player?.deactivate();
    this.project = project;
    this.player = player;
    this.updateSettings();
    this.player.onRender.subscribe(this.render);

    // Auto-play when ready if auto mode is enabled
    if (this.auto) {
      this.playing = true;
    }
    this.player.togglePlayback(this.playing);

    if (import.meta.env.DEV) {
      this.player.logger.onLogged.subscribe(console.log);
    }

    this.setState(State.Ready);
  }

  private attributeChangedCallback(name: string, _: any, newValue: any) {
    switch (name) {
      case 'auto':
        this.setPlaying(this.playing);
        break;
      case 'src':
        this.updateSource(newValue);
        break;
      case 'quality':
      case 'width':
      case 'height':
        this.updateSettings();
        break;
      case 'variables':
        this.player?.setVariables(this.variables);
        break;
      case 'responsive':
        this.updateResponsiveMode();
        break;
      case 'aspect-ratio':
        this.updateSettings();
        break;
      case 'fullscreen':
        this.updateFullscreenMode();
        break;
      case 'no-controls':
        this.updateControlsVisibility();
        break;
    }
  }

  private disconnectedCallback() {
    this.connected = false;
    this.player?.deactivate();
    this.player?.onRender.unsubscribe(this.render);
  }

  private connectedCallback() {
    this.connected = true;
    this.player?.activate();
    this.player?.onRender.subscribe(this.render);
  }

  private render = async () => {
    if (this.player) {
      await this.stage.render(
        this.player.playback.currentScene,
        this.player.playback.previousScene,
      );
    }
  };

  private updateSettings() {
    let width = this.width;
    let height = this.height;

    // Apply aspect ratio if specified and responsive mode is enabled
    if (this.responsive && this.aspectRatio) {
      const currentRatio = width / height;
      if (currentRatio > this.aspectRatio) {
        // Width is too large, adjust based on height
        width = height * this.aspectRatio;
      } else {
        // Height is too large, adjust based on width
        height = width / this.aspectRatio;
      }
    }

    const settings = {
      ...this.defaultSettings,
      size: new Vector2(width, height),
      resolutionScale: this.quality,
    };
    this.stage.configure(settings);
    this.player.configure(settings);
  }
}

if (!customElements.get(ID)) {
  customElements.define(ID, MotionCanvasPlayer);
}
