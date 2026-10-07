import { describe, expect, it, vi } from "vite-plus/test";

import { cesium, CesiumViewer } from "../src/cesium/index.ts";
import { dayjs, lodash, turf } from "../src/index.ts";
import { mapboxgl } from "../src/mapbox/index.ts";

describe("tool exports", () => {
  it("exports Turf as a utility object", () => {
    const point = turf.point([116.4, 39.9]);

    expect(point.geometry.type).toBe("Point");
    expect(point.geometry.coordinates).toEqual([116.4, 39.9]);
  });

  it("exports Day.js as a callable function", () => {
    expect(dayjs("2026-08-25").format("YYYY-MM-DD")).toBe("2026-08-25");
  });

  it("formats relative time in Chinese", () => {
    const base = dayjs("2026-08-25T12:00:00");

    expect(dayjs("2026-08-25T11:59:50").from(base)).toBe("几秒前");
    expect(dayjs("2026-08-25T11:55:00").from(base)).toBe("5 分钟前");
    expect(dayjs("2026-06-25T12:00:00").from(base)).toBe("2 个月前");
    expect(dayjs("2026-08-25T12:05:00").from(base)).toBe("5 分钟内");

    vi.useFakeTimers();
    vi.setSystemTime(base.toDate());
    try {
      expect(dayjs("2026-08-25T11:59:50").fromNow()).toBe("几秒前");
    } finally {
      vi.useRealTimers();
    }
  });

  it("exports Lodash utilities", () => {
    expect(lodash.get({ user: { name: "Tom" } }, "user.name")).toBe("Tom");
  });
});

describe("Cesium native exports", () => {
  it("exports representative Cesium APIs", () => {
    expect(typeof cesium.Viewer).toBe("function");
    expect(typeof cesium.Resource).toBe("function");
    expect(typeof CesiumViewer).toBe("function");
  });
});

describe("Mapbox native exports", () => {
  it("exports representative Mapbox GL JS APIs", () => {
    expect(typeof mapboxgl.Map).toBe("function");
    expect(typeof mapboxgl.Marker).toBe("function");
  });
});
