import React from "react";
import { toast } from "react-toastify";
import "./WalletConnector.css";

export default function WalletConnector({ onConnect, connectedAccount }) {
  async function connectMetamask() {
    if (!window.ethereum) {
      toast.error("MetaMask not installed!");
      return;
    }
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      onConnect(accounts[0]);
      toast.success("Wallet connected!");
    } catch {
      toast.error("Connection cancelled.");
    }
  }

  return (
    <div className="wallet-connector glass-card">
      {connectedAccount ? (
        <div className="wallet-status">
          <p>
            Connected:&nbsp;
            <span className="wallet-address">
              {connectedAccount.slice(0, 6)}...{connectedAccount.slice(-4)}
            </span>
          </p>
        </div>
      ) : (
        <button className="connect-btn" onClick={connectMetamask}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
