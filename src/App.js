import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletConnector from "./components/WalletConnector";
import MintCard from "./components/MintCard";
import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  const [account, setAccount] = useState(null);
  const serverBaseUrl = "http://localhost:5000"; // Your backend URL

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="header">
          <h1>🚀 Launchpad</h1>
          <WalletConnector onConnect={setAccount} connectedAccount={account} />
        </header>

        <main className="main-content">
          <MintCard serverBaseUrl={serverBaseUrl} account={account} />
        </main>

        <footer className="footer">© 2025 Launchpad Mint</footer>
      </div>
    </QueryClientProvider>
  );
}
