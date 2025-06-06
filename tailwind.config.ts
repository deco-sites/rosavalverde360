import daisyui from "daisyui";

export default {
  plugins: [daisyui],
  daisyui: { themes: [], logs: false },
  content: ["./**/*.tsx"],
  theme: {
    container: { center: true },
    extend: {
      fontWeight: {
        bold: "700",
      },
      animation: {
        sliding: "sliding 30s linear infinite",
      },
      keyframes: {
        sliding: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      plugins: [
        // deno-lint-ignore no-explicit-any
        function ({ addBase }: any) {
          addBase({
            "b, strong": {
              fontWeight: "700",
            },
          });
        },
      ],
    },
  },
};
