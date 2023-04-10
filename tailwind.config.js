/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  important: true,
  theme: {
    extend: {
      gridTemplateColumns: {
        "24": "repeat(24, minmax(0, 1fr));"
      },
      maxHeight: {
        "fullscreen": "calc(100% - 64px)"
      },
      height: {
        "fullscreen": "calc(100% - 64px)"
      },
      width: {
        "unset": "unset"
      },
      blur: {
        "xs": "2px"
      },
      zIndex: {
        "1": "1"
      }
    },
  },
  plugins: [],
}

