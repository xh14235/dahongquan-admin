module.exports = {
  content: ["./src/**/*.{html,js,vue}"],
  theme: {
    extend: {},
  },
  plugins: [
    // eslint-disable-next-line func-names
    ({ addBase }) => {
      addBase({
        "button, [type='button'], [type='reset'], [type='submit']": {
          "background-color": "null",
        },
      });
    },
  ],
};
