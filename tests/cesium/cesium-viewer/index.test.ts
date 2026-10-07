import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

import type { CesiumViewerOptions } from "../../../src/cesium/index.ts";

interface MockViewer {
  container: unknown;
  destroyCalls: number;
  destroyed: boolean;
  options: Record<string, unknown>;
  destroy(): void;
  isDestroyed(): boolean;
}

const viewerMock = vi.hoisted(() => ({
  instances: [] as MockViewer[],
}));

vi.mock("cesium", () => {
  class Viewer implements MockViewer {
    readonly container: unknown;
    readonly options: Record<string, unknown>;
    destroyCalls = 0;
    destroyed = false;

    constructor(container: unknown, options: Record<string, unknown>) {
      this.container = container;
      this.options = options;
      viewerMock.instances.push(this);
    }

    destroy(): void {
      this.destroyCalls += 1;
      this.destroyed = true;
    }

    isDestroyed(): boolean {
      return this.destroyed;
    }
  }

  return {
    SceneMode: { SCENE3D: 3 },
    Viewer,
  };
});

import { CesiumViewer } from "../../../src/cesium/cesium-viewer/index.ts";

describe("CesiumViewer", () => {
  beforeEach(() => {
    viewerMock.instances.length = 0;
  });

  it("creates a Viewer with offline, widget-free defaults", () => {
    const instance = new CesiumViewer("cesium-container");
    const [viewer] = viewerMock.instances;

    expect(viewer?.container).toBe("cesium-container");
    expect(viewer?.options).toEqual({
      animation: false,
      baseLayer: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      navigationHelpButton: false,
      projectionPicker: false,
      scene3DOnly: true,
      sceneMode: 3,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      vrButton: false,
    });
    expect(instance.viewer).toBe(viewer);
  });

  it("lets caller options override defaults without mutating the input", () => {
    const options: CesiumViewerOptions = {
      homeButton: true,
      requestRenderMode: true,
      scene3DOnly: false,
    };
    const originalOptions = { ...options };

    new CesiumViewer("cesium-container", options);

    expect(viewerMock.instances[0]?.options).toMatchObject(options);
    expect(options).toEqual(originalOptions);
  });

  it("omits the default base layer when enabling the base layer picker", () => {
    new CesiumViewer("cesium-container", { baseLayerPicker: true });

    expect(viewerMock.instances[0]?.options).not.toHaveProperty("baseLayer");
    expect(viewerMock.instances[0]?.options.baseLayerPicker).toBe(true);
  });

  it("preserves an explicitly provided base layer option", () => {
    new CesiumViewer("cesium-container", {
      baseLayer: false,
      baseLayerPicker: true,
    });

    expect(viewerMock.instances[0]?.options).toMatchObject({
      baseLayer: false,
      baseLayerPicker: true,
    });
  });

  it("creates independent Viewer instances", () => {
    const first = new CesiumViewer("first");
    const second = new CesiumViewer("second");

    first.destroy();

    expect(first.isDestroyed()).toBe(true);
    expect(second.isDestroyed()).toBe(false);
    expect(viewerMock.instances).toHaveLength(2);
  });

  it("destroys the Viewer idempotently", () => {
    const instance = new CesiumViewer("cesium-container");
    const [viewer] = viewerMock.instances;

    instance.destroy();
    instance.destroy();

    expect(instance.isDestroyed()).toBe(true);
    expect(viewer?.destroyCalls).toBe(1);
  });

  it("handles external destruction and rejects access to a destroyed Viewer", () => {
    const instance = new CesiumViewer("cesium-container");
    const [viewer] = viewerMock.instances;

    viewer?.destroy();
    instance.destroy();

    expect(instance.isDestroyed()).toBe(true);
    expect(viewer?.destroyCalls).toBe(1);
    expect(() => instance.viewer).toThrow(
      "CesiumViewer has been destroyed. Create a new CesiumViewer instance.",
    );
  });
});
