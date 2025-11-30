"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type GatedButtonProps = React.ComponentProps<typeof Button> & {
  canUse: boolean;
  label?: string;
  lockedMessage?: string;
};

export function GatedButton(props: GatedButtonProps) {
  const {
    canUse,
    label,
    children,
    lockedMessage = "This feature isn’t enabled for your beta tier yet. Check back soon!",
    onClick,
    ...buttonProps
  } = props;

  const [showDialog, setShowDialog] = React.useState(false);

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!canUse) {
      e.preventDefault();
      e.stopPropagation();
      setShowDialog(true);
      return;
    }

    onClick?.(e);
  };

  return (
    <>
      <Button {...buttonProps} onClick={handleClick}>
        {label ?? children}
      </Button>

      {showDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-transition"
          onClick={() => setShowDialog(false)}
        >
          <div
            className="w-full max-w-sm rounded-lg bg-slate-900 p-4 text-sm text-slate-100 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 font-medium">Coming soon</p>
            <p className="mb-4 text-xs text-slate-300">{lockedMessage}</p>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="text-slate-900 border-white hover:text-slate-300"
                onClick={() => setShowDialog(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
