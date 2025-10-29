import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <h1 className="title">🚀 Launchpad</h1>
        <ConnectButton />
      </header>
      <main className="main">{children}</main>
      <footer className="footer">© 2025 Launchpad Mint</footer>
    </div>
  );
}
