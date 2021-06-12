import * as React from "react";
import TruncateMarkup from "react-truncate-markup";
import { ReadMore } from "./components";

interface Props {
  children: JSX.Element;
}

export function MetadataComment({ children }: Props) {
  const [isTruncated, setIsTruncated] = React.useState(true);

  const toggleTruncated = () => setIsTruncated((truncated) => !truncated);

  return isTruncated ? (
    <TruncateMarkup
      lines={isTruncated ? 10 : Infinity}
      ellipsis={
        <ReadMore isTruncated={isTruncated} onClick={toggleTruncated} />
      }
    >
      {children}
    </TruncateMarkup>
  ) : (
    <>
      {children}
      <ReadMore isTruncated={isTruncated} onClick={toggleTruncated} />
    </>
  );
}
