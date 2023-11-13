"use client";
import React from "react";
import { PriceResponse } from "../../app/api/types";
import Swap from "../sections/Swap";
import Confirmation from "../sections/Confirmation";

enum WizardKind {
  SWAP = "swap",
  CONFIRM = "confirm",
}

type SwapWizardState = {
  kind: WizardKind.SWAP;
  data: {};
};

type ConfirmWizardState = {
  kind: WizardKind.CONFIRM;
  data: PriceResponse;
};

function SwapWizard() {
  const [wizardState, setWizardState] = React.useState({
    kind: "swap",
    data: {},
  });

  const onSwapReady = (data: PriceResponse) => {
    // setWizardState({
    //   kind: "confirm",
    //   data,
    // });
  };

  switch (wizardState.kind) {
    case WizardKind.SWAP:
      return <Swap onReady={onSwapReady} />;
    case WizardKind.CONFIRM:
      return <Confirmation />;
  }
}

export default SwapWizard;
