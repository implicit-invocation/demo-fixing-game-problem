import { PlayMode } from "gdxts";
import { ImageMode } from "gdxts-ui";
import { AImage, ALabel, AView, GLabel, GView } from "gdxts-ui-react";
import { useMemo, useState } from "react";
import { GAnim } from "./components/AnimatedImage";
import { CommonButton } from "./components/CommonButton";

export const UI = () => {
  const [count, setCount] = useState(0);
  const from = useMemo(
    () => ({
      opacity: 0,
      translateY: 20,
    }),
    []
  );
  const animate = useMemo(
    () => ({
      opacity: 1,
      translateY: 0,
    }),
    []
  );
  return (
    <AView className="flex-1 bg-gray">
      <ALabel
        text={"Hello, world! You have clicked " + count + " times!"}
        className="w-full h-100 text-center bg-blue vertical-center"
      />
      <GView className="flex flex-row w-full justify-center items-center gap-50 flex-1">
        <AImage
          from={from}
          animate={animate}
          duration={0.5}
          atlasName="icons"
          regionName="icon_shop"
          className="w-100 h-100"
        />
        <AView from={from} animate={animate}>
          <CommonButton
            zoomScale={0.8}
            className="w-200 h-80"
            onPress={() => {
              setCount((count) => count + 1);
            }}
          >
            <GLabel
              text="Start game!"
              className="font-size-32 text-center vertical-center flex-1 h-full"
            />
          </CommonButton>
        </AView>
      </GView>
      <GView className="h-200 w-full bg-red">
        <GAnim
          frameDuration={1 / 30}
          playMode={PlayMode.LOOP}
          atlasName="murata"
          regionName="murataA_Idle"
          className="w-500 h-500 -mt-200"
          mode={ImageMode.Stretch}
        />
      </GView>
    </AView>
  );
};
