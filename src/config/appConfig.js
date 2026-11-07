const appConfig = {
  // Login field — choose one: 'email' | 'username' | 'phone'
  loginIdentifier: 'username',

  // Feature flags
  features: {
    // false → UI locked to defaultLang, language toggle hidden, saved preference ignored
    multiLanguage:  import.meta.env.VITE_MULTI_LANGUAGE === 'true',
    defaultLang:    import.meta.env.VITE_DEFAULT_LANG || 'en',
    supportedLangs: ['en', 'ar'],
  },

  // Map your backend response keys here
  auth: {
    tokenKey:   'token',
    userKey:    'user',
    messageKey: 'message',
  },
}

export default appConfig