import { useEffect } from "react";
import { useLocation } from "react-router";

const useScrollToHash = () => {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const elementId = decodeURIComponent(
      location.hash.replace("#", ""),
    );

    const animationFrameId =
      window.requestAnimationFrame(() => {
        const element =
          document.getElementById(
            elementId,
          );

        element?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });

    return () => {
      window.cancelAnimationFrame(
        animationFrameId,
      );
    };
  }, [
    location.hash,
    location.pathname,
  ]);
};

export default useScrollToHash;