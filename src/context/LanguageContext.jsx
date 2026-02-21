import React, { createContext, useContext, useState } from 'react'

const TRANSLATIONS = {
  en: {
    appName: 'FarmChat', aiAdvisor: 'AI Crop Advisor', weatherBot: 'Weather Bot',
    marketPrices: 'Market Prices', soilLab: 'Soil Lab', kisanHelpline: 'Kisan Helpline',
    online: 'online', available: 'Available 24/7',
    typeQuery: 'Type your query or upload a crop photo...',
    inputPlaceholder: 'Ask about crops, pests, soil, weather...',
    welcomeTitle: '🌾 Welcome to Farm Assistant powered by AgriGPT!',
    welcomeBody: 'I can help you with:',
    feat1: 'Text queries about farming, crops, soil, pests',
    feat2: 'Image analysis (upload crop photos for diagnosis)',
    feat3: 'Expert recommendations for your farm',
    cta: 'Just type a question or upload a crop photo to get started!',
    send: 'Send', retake: 'Re-Take', usePhoto: 'Use Photo',
    uploadPhoto: 'Upload Photo', capturePhoto: 'Capture Photo',
    errorTitle: 'Something went wrong', errorRetry: 'Try Again',
    thinking: 'AgriGPT is thinking...',
    khariSeason: 'Kharif Season 2026', myFarm: 'My Farm',
    searchChat: 'Search or start new chat',
  },
  hi: {
    appName: 'फार्मचैट', aiAdvisor: 'AI फसल सलाहकार', weatherBot: 'मौसम बॉट',
    marketPrices: 'बाजार भाव', soilLab: 'मिट्टी लैब', kisanHelpline: 'किसान हेल्पलाइन',
    online: 'ऑनलाइन', available: '24/7 उपलब्ध',
    typeQuery: 'प्रश्न लिखें या फसल फोटो अपलोड करें...',
    inputPlaceholder: 'फसल, कीट, मिट्टी, मौसम के बारे में पूछें...',
    welcomeTitle: '🌾 AgriGPT द्वारा Farm Assistant में स्वागत है!',
    welcomeBody: 'मैं आपकी मदद कर सकता हूं:', feat1: 'खेती, फसल, मिट्टी, कीटों के बारे में प्रश्न',
    feat2: 'छवि विश्लेषण (फसल फोटो अपलोड करें)', feat3: 'विशेषज्ञ सिफारिशें',
    cta: 'प्रश्न टाइप करें या फोटो अपलोड करें!',
    send: 'भेजें', retake: 'फिर से लें', usePhoto: 'फोटो उपयोग करें',
    uploadPhoto: 'फोटो अपलोड', capturePhoto: 'फोटो कैप्चर',
    errorTitle: 'कुछ गलत हुआ', errorRetry: 'पुनः प्रयास',
    thinking: 'AgriGPT सोच रहा है...',
    khariSeason: 'खरीफ सीजन 2026', myFarm: 'मेरा खेत', searchChat: 'खोजें या नई चैट शुरू करें',
  },
  te: {
    appName: 'ఫార్మ్‌చాట్', aiAdvisor: 'AI పంట సలహాదారు', weatherBot: 'వాతావరణ బాట్',
    marketPrices: 'మార్కెట్ ధరలు', soilLab: 'మట్టి ల్యాబ్', kisanHelpline: 'కిసాన్ హెల్ప్‌లైన్',
    online: 'ఆన్‌లైన్', available: '24/7 అందుబాటులో',
    typeQuery: 'ప్రశ్న టైప్ చేయండి లేదా ఫోటో అప్‌లోడ్ చేయండి...',
    inputPlaceholder: 'పంటలు, కీటకాలు, మట్టి, వాతావరణం గురించి అడగండి...',
    welcomeTitle: '🌾 AgriGPT ద్వారా Farm Assistant కి స్వాగతం!',
    welcomeBody: 'నేను సహాయం చేయగలను:', feat1: 'వ్యవసాయం, పంటలు గురించి ప్రశ్నలు',
    feat2: 'చిత్ర విశ్లేషణ (పంట ఫోటోలు అప్‌లోడ్)', feat3: 'నిపుణుల సిఫారసులు',
    cta: 'ప్రశ్న టైప్ చేయండి లేదా ఫోటో అప్‌లోడ్ చేయండి!',
    send: 'పంపు', retake: 'మళ్ళీ తీయండి', usePhoto: 'ఫోటో వాడండి',
    uploadPhoto: 'ఫోటో అప్‌లోడ్', capturePhoto: 'ఫోటో క్యాప్చర్',
    errorTitle: 'ఏదో తప్పు జరిగింది', errorRetry: 'మళ్ళీ ప్రయత్నించండి',
    thinking: 'AgriGPT ఆలోచిస్తోంది...',
    khariSeason: 'ఖరీఫ్ సీజన్ 2026', myFarm: 'నా పొలం', searchChat: 'వెతకండి',
  },
}

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (key) => TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key
  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages: Object.keys(TRANSLATIONS) }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
