import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/home";
import { FinanceProvider } from "./contexts/FinanceContext";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <FinanceProvider>
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Toaster />
        </>
      </Suspense>
    </FinanceProvider>
  );
}

export default App;
