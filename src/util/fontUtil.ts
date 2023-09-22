import { BMFont, FontConfig, packFont, toBmfString } from "font-packer";
import { BitmapFont, Texture, TextureFilter } from "gdxts";
import { openDB } from "idb";
import stringify from "json-stable-stringify";

const textures = new Set<Texture>();
export const smoothFont = (font: BitmapFont, useMipMaps = true) => {
  textures.clear();
  font.data.regions.forEach((region) => {
    textures.add(region.texture);
  });
  textures.forEach((texture) => {
    texture.setFilters(TextureFilter.Linear, TextureFilter.Linear);
    texture.update(useMipMaps);
  });
};

const getDb = async () => {
  return await openDB("fonts", 2, {
    upgrade(db) {
      db.createObjectStore("fonts");
    },
  });
};

export const cacheFont = async (
  path: string,
  fontOptions: Partial<FontConfig>,
  info: BMFont,
  textureData: {
    width: number;
    height: number;
    data: ImageData;
  }
) => {
  try {
    const db = await getDb();
    const tx = db.transaction("fonts", "readwrite");
    await tx.store.add(
      {
        path,
        config: stringify(fontOptions),
        info: toBmfString(info),
        width: textureData.width,
        height: textureData.height,
        textureData: textureData.data.data.buffer,
      },
      `${path}-${stringify(fontOptions)}`
    );
    await tx.done;
  } catch (e) {
    console.error(e);
  }
};

const getFontFromCache = async (
  gl: WebGLRenderingContext,
  path: string,
  fontOptions: Partial<FontConfig>,
  flip = true,
  useMipMaps = true
): Promise<BitmapFont | undefined> => {
  const key = `${path}-${stringify(fontOptions)}`;
  try {
    const db = await getDb();
    const cache = await db.get("fonts", key);
    if (!cache) {
      return;
    }
    try {
      const font = await BitmapFont.loadFromPacker(
        gl,
        cache.info,
        [
          {
            width: cache.width,
            height: cache.height,
            data: new ImageData(
              new Uint8ClampedArray(cache.textureData),
              cache.width,
              cache.height
            ),
          },
        ],
        flip,
        false,
        useMipMaps
      );
      smoothFont(font, useMipMaps);
      return font;
    } catch (e) {
      db.transaction("fonts", "readwrite").store.delete(key);
    }
  } catch (e) {
    console.error(e);
    return;
  }
};

export const ttfCache = new Map<string, ArrayBuffer>();

export const loadTTF = async (
  gl: WebGLRenderingContext,
  path: string | ArrayBuffer,
  fontOptions: Partial<FontConfig> & {
    smooth?: boolean;
  },
  flip = true,
  useMipMaps = true
) => {
  // TODO: how to allow multiple strokes and shadows?
  if (typeof path === "string") {
    const cachedFont = await getFontFromCache(
      gl,
      path,
      fontOptions,
      flip,
      useMipMaps
    );
    if (cachedFont) {
      return cachedFont;
    }
  }
  const originalPath = path;
  if (typeof path === "string") {
    if (ttfCache.has(path)) {
      path = ttfCache.get(path)!;
    } else {
      const response = await fetch(path);
      const data = await response.arrayBuffer();
      ttfCache.set(path, data);
      path = data;
    }
  }
  const { info, textureData } = await packFont(path, fontOptions);
  if (typeof originalPath === "string") {
    cacheFont(originalPath, fontOptions, info, textureData);
  }

  const font = await BitmapFont.loadFromPacker(
    gl,
    toBmfString(info),
    [textureData],
    flip,
    false,
    useMipMaps
  );
  if (fontOptions.smooth) {
    smoothFont(font, useMipMaps);
  }
  return font;
};
