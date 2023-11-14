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

type WizardState = SwapWizardState | ConfirmWizardState;

function SwapWizard() {
  const [wizardState, setWizardState] = React.useState<WizardState>({
    kind: WizardKind.SWAP,
    data: {},
  });

  const onSwapReady = (data: PriceResponse) => {
    setWizardState({
      kind: WizardKind.CONFIRM,
      data,
    });
  };

  switch (wizardState.kind) {
    case WizardKind.SWAP:
      return <Swap onReady={onSwapReady} />;
    case WizardKind.CONFIRM:
      return <Confirmation data={wizardState.data} />;
  }
}

export default SwapWizard;
