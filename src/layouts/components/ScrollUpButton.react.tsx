import theme from "@config/theme.json";
import { useLayoutEffect, useState } from "preact/compat";
import { BiArrowToTop } from "react-icons/bi";

export const ScrollUpButton = () => {
  const [visible, setVisible] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
      /* you can also use 'auto' behaviour
                         in place of 'smooth' */
    });
  };

  useLayoutEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      if (scrolled > 300) {
        setVisible(true);
      } else if (scrolled <= 300) {
        setVisible(false);
      }
    };
    toggleVisible();
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  return (
    <>
      {visible && (
        <div
          onClick={scrollToTop}
          style={{
            position: "fixed",
            bottom: 5,
            right: 10,
            width: 45,
            height: 45,
            cursor: "pointer",
            borderRadius: 8,
            border: `1px solid ${theme.colors.default.theme_color.primary}`,
          }}
        >
          <BiArrowToTop
            size={"lg"}
            color={theme.colors.default.theme_color.primary}
          />
        </div>
      )}
    </>
  );
};
