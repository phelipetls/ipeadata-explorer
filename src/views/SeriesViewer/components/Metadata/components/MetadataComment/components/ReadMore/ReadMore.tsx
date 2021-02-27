import * as React from "react";
import { Link } from "@material-ui/core";

interface ReadMoreProps {
  isTruncated: boolean;
  onClick: () => void;
}

export function ReadMore({ isTruncated, onClick }: ReadMoreProps) {
  return (
    <>
      {isTruncated && <span>...</span>}{" "}
      <Link href="#" onClick={onClick}>
        {isTruncated ? "Ler mais »" : "« Ler menos"}
      </Link>
    </>
  );
}
