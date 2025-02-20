import { TranslatorProvider } from "./Components/AiContext";
import Dashboard from "./pages/Dashboard";
TranslatorProvider;
function App() {
  return (
    <>
      <TranslatorProvider>
        <Dashboard />
      </TranslatorProvider>
    </>
  );
}

export default App;
