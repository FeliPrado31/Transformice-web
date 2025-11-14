declare module "@ruffle-rs/ruffle" {
  interface RufflePlayerConfig {
    autoplay?: "auto" | "on" | "off";
    backgroundColor?: string;
    letterbox?: "on" | "off" | "fullscreen";
    unmuteOverlay?: "visible" | "hidden";
    quality?: "low" | "medium" | "high" | "best";
    volume?: number;
    logLevel?: "error" | "warn" | "info" | "debug" | "trace";
    showSwfDownload?: boolean;
    contextMenu?: "on" | "off" | "rightClickOnly";
    allowFullscreen?: boolean;
  }

  interface RufflePlayer extends HTMLElement {
    id: string;
    style: CSSStyleDeclaration;
    config: RufflePlayerConfig;
    load(url: string): Promise<void>;
    remove(): void;
  }

  interface Ruffle {
    createPlayer(): RufflePlayer;
  }

  const ruffle: Ruffle;
  export default ruffle;
}
