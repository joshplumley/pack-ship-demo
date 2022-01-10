import { createTheme } from "@mui/material/styles";

const { palette } = createTheme();

const theme = createTheme({
  typography: {
    fontFamily: "Arial",
    button: {
      textTransform: "none",
      fontSize: "18px",
      fontWeight: "bold",
    },
  },
  palette: {
    primary: {
      light: "#c9c5c5",
      main: "#9e9e9e",
      dark: "#757575",
    },
    secondary: {
      light: "#ffd78f",
      main: "#fac157",
      dark: "#FFA500",
    },
    error: {
      light: "#FF7070",
      main: "#CD0000",
      dark: "#A30000",
    },
    default: palette.augmentColor({
      color: {
        light: "#939393",
        main: "#e0e0e0",
        dark: "#d5d5d5",
      },
    }),
  },
});

export default theme;
