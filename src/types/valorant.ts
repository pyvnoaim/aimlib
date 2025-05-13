export interface SensitivitySettings {
  mouse: number;
  ads: number;
  dpi: number;
  pollingRate: number;
  user: string;
}

export interface CrosshairSettings {
  color: string;
  crosshairCode: string;
  user: string;
}

export interface ResolutionSettings {
  width: number;
  height: number;
  refreshRate: number;
  aspectRatio: string;
  displayMode: 'Fullscreen' | 'Windowed' | 'Borderless';
  trueStretch: boolean;
  user: string;
}

export interface ValorantSettings {
  sensitivities: SensitivitySettings[];
  crosshairs: CrosshairSettings[];
  resolutions: ResolutionSettings[];
}
