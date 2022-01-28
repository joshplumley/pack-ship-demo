import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import Router from "./router/router";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
