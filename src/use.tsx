/* eslint-disable no-param-reassign */
import * as React from "react";
import { UseProps, UseProp, UseComponent } from "./types";
import { omit, toArray } from "./utils";

const Use = React.forwardRef((props: UseProps<any>, ref) =>
  render(Object.assign(omit(props, "useNext"), { ref, use: props.useNext }))
);

function render(props: UseProps<any>) {
  // filter Use and string components in the middle
  const [Component, ...useNext] = toArray(props.use).filter(
    (x, i, arr) => x !== Use && (typeof x !== "string" || i === arr.length - 1)
  );

  if (!Component) {
    return null;
  }

  const finalProps = omit(props, "use", "useNext");

  if (!useNext.length || typeof Component === "string") {
    return <Component {...finalProps} />;
  }

  if (useNext.length === 1) {
    return <Component {...finalProps} use={useNext[0]} />;
  }

  return <Component {...props} use={Use} useNext={useNext} />;
}

function use<T extends UseProp[]>(...uses: T) {
  return React.forwardRef((props, ref) =>
    render(
      Object.assign(omit(props, "useNext"), {
        ref,
        use: [...uses, ...toArray(props.use), ...toArray(props.useNext)]
      })
    )
  ) as UseComponent<T[number]>;
}

export default use;
