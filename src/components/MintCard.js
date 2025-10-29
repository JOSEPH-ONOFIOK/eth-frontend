import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "./MintCard.css";

export default function MintCard({ account, serverBaseUrl }) {
  const [qty, setQty] = useState(1);
  const [minting, setMinting] = useState(false);
  const [minted, setMinted] = useState(0);
  const [maxSupply, setMaxSupply] = useState(10000);
  const [totalSupply, setTotalSupply] = useState(10000);
  const price = 0.08;
  const maxPerWallet = 1;

  useEffect(() => {
    async function fetchSupply() {
      try {
        const res = await fetch(`${serverBaseUrl}/api/supply`);
        const data = await res.json();
        if (res.ok) {
          setMinted(data.minted);
          setMaxSupply(data.maxSupply);
          setTotalSupply(data.totalSupply || data.maxSupply);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSupply();
  }, [serverBaseUrl]);

  async function handleMint() {
    if (!account) return toast.error("Please connect your wallet.");
    if (qty < 1 || qty > maxPerWallet)
      return toast.error(`You can mint up to ${maxPerWallet} NFT.`);

    try {
      setMinting(true);
      const res = await fetch(`${serverBaseUrl}/api/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: account, qty, price }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Mint failed");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: data.recipient,
        value: ethers.parseEther(String(price * qty)),
      });

      toast.info("Transaction sent...");
      await tx.wait();
      toast.success("🎉 Mint successful!");
      setMinted((prev) => prev + qty);
      setTotalSupply((prev) => prev - qty);
    } catch (err) {
      toast.error(err.message || "Mint failed");
    } finally {
      setMinting(false);
    }
  }

  return (
    <section className="mint-section">
      <div className="hero-glow"></div>

      <div className="mint-header">
        <h1>🚀 Launch Your NFT</h1>
        <p>Fair Minting • Transparent Supply • Instant Ownership</p>
      </div>

      <div className="mint-container">
        {/* Mint Info */}
        <div className="mint-card">
          <div className="mint-card-header">
            <h3>Mint Dashboard</h3>
            <span className="status-pill">LIVE</span>
          </div>

          <div className="mint-stats">
            <div><span>Wallet:</span> {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Not connected"}</div>
            <div><span>Price:</span> {price} ETH</div>
            <div><span>Minted:</span> {minted} / {maxSupply}</div>
            <div><span>Remaining:</span> {totalSupply - minted}</div>
          </div>

          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${(minted / maxSupply) * 100}%` }}></div>
            </div>
            <span className="progress-text">
              {((minted / maxSupply) * 100).toFixed(1)}% Minted
            </span>
          </div>

          <div className="mint-controls">
            <input
              type="number"
              min="1"
              max={maxPerWallet}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
            />
            <button onClick={handleMint} disabled={minting}>
              {minting ? "Minting..." : "Mint NFT"}
            </button>
          </div>
        </div>

        {/* NFT Preview */}
        <div className="nft-preview">
          <div className="nft-frame">
            <img
              src="https://bafkreicv7g3wt2v25i75r7srb7lt4b7t5n3oyjbxpb3n7fg4oyexjijjmu.ipfs.nftstorage.link/"
              alt="NFT"
            />
          </div>
          <h4>Genesis Collection</h4>
          <p>Mint your unique digital collectible.</p>
        </div>
      </div>
    </section>
  );
}
