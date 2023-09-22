import { Color } from "gdxts";
import { ActorStyle } from "gdxts-ui";
import { AButton, ButtonViewProps } from "gdxts-ui-react";
import { useMemo, useState } from "react";

export interface CommonButtonProps extends ButtonViewProps {
  activeColor?: Color | string;
  disabled?: boolean;
  transparent?: boolean;
}

const defaultStyle: ActorStyle = {
  width: 200,
  height: 50,
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#333333",
};

export const CommonButton = (props: CommonButtonProps) => {
  const { style, activeColor, disabled, zoomScale, transparent } = props;
  const [pressed, setPressed] = useState(false);
  const styles = useMemo(() => {
    const ret = {
      ...defaultStyle,
      ...style,
    };
    if (pressed && activeColor) {
      ret.backgroundColor = activeColor;
    }
    if (transparent) {
      delete ret.backgroundColor;
    }
    return ret;
  }, [style, pressed, activeColor, transparent]);

  return (
    <AButton
      zoomScale={zoomScale ?? 0.9}
      {...props}
      onPressIn={() => {
        if (disabled) {
          return;
        }
        setPressed(true);
        props.onPressIn?.();
      }}
      onPressOut={() => {
        if (disabled) {
          return;
        }
        setPressed(false);
        props.onPressOut?.();
      }}
      onPress={() => {
        if (disabled) {
          return;
        }
        props.onPress?.();
      }}
      style={styles}
    />
  );
};
