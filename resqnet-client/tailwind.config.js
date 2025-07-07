const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */

// export default {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//     flowbite.content(),
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [
//     flowbite.plugin(),
//   ],
// }

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./node_modules/flowbite/**/*.js",          // <‑‑ Flowbite paths
    "./node_modules/flowbite-react/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#007b83",
          secondary: "#ffc107",
          accent: "#ff6b6b",
          bg: "#f6f9fc",
        },
        // DO NOT rename or remove gray/blue etc.
      },
      fontFamily: {
        heading: ["Rubik", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],        // <‑‑ keeps Flowbite happy
};
