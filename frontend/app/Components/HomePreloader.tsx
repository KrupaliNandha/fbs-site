"use client";

import { useState } from "react";
import PageLoader from "./Preloader";

export default function HomePreloader() {
  const [done, setDone] = useState(false);
  if (done) return null;
  return <PageLoader onFinish={() => setDone(true)} />;
}
