import { Animation, PlayMode, PolygonBatch } from "gdxts";
import { Image, Stage } from "gdxts-ui";
import { ImageProps, animated, registerCustomInstance } from "gdxts-ui-react";
import React from "react";

export class AnimatedImage extends Image {
  animation?: Animation;
  playMode?: PlayMode;
  stateTime = 0;
  constructor(stage: Stage) {
    super(stage);
  }
  setAnimationInfo(
    atlasName: string,
    regionName: string,
    frameDuration: number[] | number
  ) {
    const regions = this.stage.skin.atlases[atlasName].findRegions(regionName);
    this.animation = new Animation(regions, frameDuration);
  }
  setPlayMode(playMode: PlayMode) {
    this.playMode = playMode;
  }
  act(delta: number): void {
    super.act(delta);
    this.stateTime += delta;
    if (this.animation) {
      const frame = this.animation.getKeyFrame(this.stateTime, this.playMode);
      if (frame) {
        this.setRegion(frame);
      }
    }
  }
  draw(batch: PolygonBatch): void {
    if (this.region == undefined) return;
    super.draw(batch);
  }
}

export interface AnimatedImageProps extends ImageProps {
  frameDuration: number[] | number;
  playMode?: PlayMode;
}

registerCustomInstance(
  "gdx-animated-image",
  (stage) => {
    const instance = new AnimatedImage(stage);
    return instance;
  },
  (instance, props: AnimatedImageProps) => {
    const { frameDuration, playMode, atlasName, regionName } = props;
    if (playMode) {
      instance.setPlayMode(playMode);
    }
    if (
      frameDuration === undefined ||
      atlasName === undefined ||
      regionName === undefined
    ) {
      return instance;
    }
    instance.setAnimationInfo(atlasName, regionName, frameDuration);
    return instance;
  }
);

export const GAnim = React.forwardRef<AnimatedImage, AnimatedImageProps>(
  (props, ref) => {
    return React.createElement("gdx-animated-image", { ...props, fRef: ref });
  }
);
export const AAnim = animated(GAnim);
