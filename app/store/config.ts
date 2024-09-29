import { createPersistStore } from "../utils/store";

export enum Theme {
  Dark = "dark",
  Light = "light",
}

type APIKeys = Array<{ apiKey: string }>;

type AvailableUploadServerProvider = Provider.NextAPI | Provider.ProxyAPI;

export interface UploadConfig {
  action: string;
  position: readonly string[];
  auth: string;
}

export enum Provider {
  NextAPI,
  ProxyAPI,
}

export const PROVIDER_NAME = {
  [Provider.NextAPI]: "Next API",
  [Provider.ProxyAPI]: "Proxy API",
} as const;

export const ProviderBaseUrlMap = {
  // [Provider.NextAPI]: "https://api.openai-next.com",
  // [Provider.ProxyAPI]: "https://mj.openai-next.com",
  [Provider.NextAPI]: "/nextapi",
  [Provider.ProxyAPI]: "/proxyapi",
} as const;

export const ProviderRealBaseUrlMap = {
  [Provider.NextAPI]: "https://api.openai-next.com",
  [Provider.ProxyAPI]: "https://mj.openai-next.com",
} as const;

export const api2Provider = {
  Chat: Provider.NextAPI,
  Embeddings: Provider.NextAPI,
  DallE: Provider.NextAPI,
  Flux: Provider.ProxyAPI,
  TTS: Provider.NextAPI,
  Whisper: Provider.NextAPI,
  Midjourney: Provider.ProxyAPI,
  Suno: Provider.ProxyAPI,
  Vidu: Provider.ProxyAPI,
  Pika: Provider.ProxyAPI,
  Luma: Provider.ProxyAPI,
  Doc2X: Provider.ProxyAPI,
  GPTs: Provider.ProxyAPI,
  StableDiffusion: Provider.ProxyAPI,
  BibiGPT: Provider.ProxyAPI,
} as const;

export const api2ProviderBaseUrl = {
  Chat: ProviderBaseUrlMap[api2Provider.Chat],
  Embeddings: ProviderBaseUrlMap[api2Provider.Embeddings],
  DallE: ProviderBaseUrlMap[api2Provider.DallE],
  Flux: ProviderBaseUrlMap[api2Provider.Flux],
  TTS: ProviderBaseUrlMap[api2Provider.TTS],
  Whisper: ProviderBaseUrlMap[api2Provider.Whisper],
  Midjourney: ProviderBaseUrlMap[api2Provider.Midjourney],
  Suno: ProviderBaseUrlMap[api2Provider.Suno],
  Vidu: ProviderBaseUrlMap[api2Provider.Vidu],
  Pika: ProviderBaseUrlMap[api2Provider.Pika],
  Luma: ProviderBaseUrlMap[api2Provider.Luma],
  Doc2X: ProviderBaseUrlMap[api2Provider.Doc2X],
  Gpts: ProviderBaseUrlMap[api2Provider.GPTs],
  StableDiffusion: ProviderBaseUrlMap[api2Provider.StableDiffusion],
} as const;

export const UPLOAD_INFO = {
  [Provider.NextAPI]: {
    action: [[ProviderBaseUrlMap[Provider.NextAPI]], "fileSystem/upload"].join(
      "/",
    ),
    position: ["url"],
  },
  [Provider.ProxyAPI]: {
    action: [[ProviderBaseUrlMap[Provider.ProxyAPI]], "fileSystem/upload"].join(
      "/",
    ),
    position: ["url"],
  },
  // [Provider.GodAPI]: {
  //     action: [[ProviderBaseUrlMap[Provider.ProxyAPI]], "v1/file"].join("/"),
  //     position: ["data", "url"],
  // },
} as const;

const DEFAULT_CONFIG = {
  apiKeys: [] as APIKeys,
  theme: Theme.Light as Theme,
  lastUpdate: Date.now(),
} as const;

export const useAppConfig = createPersistStore(
  { ...DEFAULT_CONFIG },
  (_set, get) => ({
    getSelectedApiKey(): string {
      return get().apiKeys[0]?.apiKey || "";
    },

    getUploadConfig(): UploadConfig {
      let provider = get().uploadServerProvider;
      if (!(provider in UPLOAD_INFO)) {
        provider = Provider.NextAPI;
      }
      return {
        action: UPLOAD_INFO[provider].action,
        position: UPLOAD_INFO[provider].position,
        auth: "Bearer " + this.getSelectedApiKey(provider),
      };
    },
  }),
  {
    name: "app-config",
    version: 1,
    migrate(persistedState) {
      return persistedState as typeof DEFAULT_CONFIG as any;
    },
  },
);
