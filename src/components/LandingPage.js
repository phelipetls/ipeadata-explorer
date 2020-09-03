import React from "react";

import LandingPageText from "./LandingPageText";
import LandingPageSections from "./LandingPageSections";
import LandingPageSearchBar from "./LandingPageSearchBar";

export default function LandingPage() {
  return (
    <>
      <LandingPageText />
      <LandingPageSearchBar />
      <LandingPageSections />
    </>
  );
}
