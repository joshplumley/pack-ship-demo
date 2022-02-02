import { createTheme } from "@mui/material/styles";

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
      contrastText: "#808080",
      light: "#ffd78f",
      main: "#ffbc43",
      dark: "#f69e00",
    },
    secondary: {
      contrastText: "#808080",
      light: "#bbdefb",
      main: "#2196F3",
      dark: "#1565C0",
    },
  },
});

export default theme;
