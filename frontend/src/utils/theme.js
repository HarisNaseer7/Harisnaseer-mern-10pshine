export const getThemeColors = (isDark) => ({
  bg: isDark ? '#0f1117' : '#f9fafb',
  cardBg: isDark ? '#1a1d27' : 'white',
  cardBorder: isDark ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
  textPrimary: isDark ? 'white' : '#111827',
  textSecondary: isDark ? 'rgba(255,255,255,0.45)' : '#6b7280',
  topbarBg: isDark ? '#13151f' : 'white',
  topbarBorder: isDark ? 'rgba(255,255,255,0.06)' : '#f3f4f6',
  inputBg: isDark ? 'rgba(255,255,255,0.06)' : '#f9fafb',
  inputBorder: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
  menuBg: isDark ? '#1a1d27' : 'white',
});