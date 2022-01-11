import { ThemeProvider } from "@mui/material/styles";
import PackingQueue from "./packing_queue/PackingQueue";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <PackingQueue />
    </ThemeProvider>
  );
}

export default App;
