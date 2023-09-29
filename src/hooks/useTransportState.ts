import * as Tone from "tone";
import React from "react";

export function useTransportState() {
  const [state, setState] = React.useState(Tone.Transport.state);

  React.useEffect(() => {
    function handleEvent() {
      setState(Tone.Transport.state);
    }

    Tone.Transport.on("start", handleEvent);
    Tone.Transport.on("stop", handleEvent);
    Tone.Transport.on("pause", handleEvent);

    return () => {
      Tone.Transport.off("start", handleEvent);
      Tone.Transport.off("stop", handleEvent);
      Tone.Transport.off("pause", handleEvent);
    };
  }, []);

  return state;
}
