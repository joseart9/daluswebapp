"use client";

import { useState, useEffect } from "react";

type ScreenSize = "mobile" | "tablet" | "desktop" | null;

const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>(null);

  useEffect(() => {
    const determineScreenSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setScreenSize("mobile");
      } else if (width >= 768 && width < 1024) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    // Run the function on mount
    determineScreenSize();

    // Attach the resize event listener
    window.addEventListener("resize", determineScreenSize);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("resize", determineScreenSize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
