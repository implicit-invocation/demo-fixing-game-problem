// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.tsx'
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// )

import {
  PolygonBatch,
  TextureAtlas,
  createGameLoop,
  createStage,
  createViewport,
} from "gdxts";
import { Skin, Stage } from "gdxts-ui";
import { GdxtsReactRenderer } from "gdxts-ui-react";
import { UI } from "./ui/UI";
import { ViewportProvider } from "./ui/useViewport";
import { loadTTF } from "./util/fontUtil";

const SHOW_MEMORY = false;

const init = async () => {
  if (SHOW_MEMORY) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await import("https://greggman.github.io/webgl-memory/webgl-memory.js");
  }

  const canvasContainer = createStage();
  const canvas = canvasContainer.getCanvas();

  const viewport = createViewport(canvas, 500, 1000, {
    crop: false,
  });
  const gl = viewport.getContext();

  const camera = viewport.getCamera();
  camera.setYDown(true);

  const batch = new PolygonBatch(gl);
  batch.setYDown(true);

  const font = await loadTTF(gl, "./jomhuria.ttf", {
    size: 42,
  });
  const atlas = await TextureAtlas.load(gl, "./icons.atlas", true);
  const murata = await TextureAtlas.load(gl, "./character_murata.atlas", true);

  // // example for texture
  // const tex = atlas.pages[0].texture;
  // tex.setFilters(TextureFilter.Linear, TextureFilter.Linear);
  // tex.update(true);

  const skin = new Skin(
    {
      default: font,
    },
    {
      icons: atlas,
      murata,
    }
  );
  const stage = new Stage(viewport, skin);

  viewport.update();

  stage.root.setStyle({
    width: 500,
    height: 1000,
  });

  GdxtsReactRenderer.render(
    <ViewportProvider value={viewport}>
      <UI />
    </ViewportProvider>,
    stage
  );

  gl.clearColor(0, 0, 0, 1);
  const loop = createGameLoop((delta) => {
    gl.clear(gl.COLOR_BUFFER_BIT);

    stage.act(delta);
    stage.draw();
    // batch.setProjection(camera.combined);
    // batch.begin();
    // atlas
    //   .findRegion("icon_shop", -1)
    //   ?.draw(batch, 50, 50, 388, 365, 0, 0, 0, 0.5, 0.5);

    // font.draw(batch, "Hello, world", 50, 250, 400, Align.center);
    // batch.end();
  });

  if (SHOW_MEMORY) {
    const info = canvasContainer.getInfo();
    info.style.backgroundColor = "rgba(0,0,0,0.5)";
    info.style.maxHeight = "50%";
    info.style.top = "0";
    info.style.left = "0";
    const ext = viewport.getContext().getExtension("GMAN_webgl_memory");
    setInterval(() => {
      info.innerHTML = `<pre>${JSON.stringify(
        {
          FPS: loop.getFps(),
          ...ext.getMemoryInfo(),
        },
        null,
        2
      )}</pre>`;
    }, 1000);
  }
};

init();
