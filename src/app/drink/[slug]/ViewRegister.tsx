"use client";

import { incrementViews } from "@/lib/drinks";
import { useEffect } from "react";

type ViewRegisterProps = {
  drinkId: number;
};
export const ViewRegister = ({ drinkId }: ViewRegisterProps) => {
  useEffect(() => {
    incrementViews(drinkId);
  }, [drinkId]);

  return null;
};
