import { theme, type ThemeConfig } from 'antd';

export function getAppTheme(mode: 'light' | 'dark'): ThemeConfig {
  const isDark = mode === 'dark';

  return {
    algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#0f8b8d',
      colorInfo: '#5b7cfa',
      colorSuccess: '#13a38b',
      colorWarning: '#b7791f',
      colorBgLayout: isDark ? '#09131d' : '#f4f7fb',
      colorBgContainer: isDark ? '#12202d' : '#ffffff',
      colorText: isDark ? '#ebf2ff' : '#142033',
      colorTextSecondary: isDark ? '#9fb2c8' : '#5f6d7b',
      colorBorder: isDark ? 'rgba(132, 157, 186, 0.18)' : 'rgba(188, 201, 198, 0.3)',
      borderRadius: 16,
      fontFamily: '"Segoe UI Variable", "Segoe UI", Inter, system-ui, sans-serif',
      boxShadowSecondary: isDark
        ? '0 18px 40px rgba(0, 0, 0, 0.28)'
        : '0 12px 32px rgba(18, 28, 42, 0.08)',
    },
    components: {
      Button: {
        controlHeight: 44,
        primaryShadow: isDark
          ? '0 12px 22px rgba(15, 139, 141, 0.28)'
          : '0 12px 22px rgba(0, 104, 95, 0.2)',
      },
      Card: {
        borderRadiusLG: 20,
      },
      Input: {
        colorBgContainer: isDark ? '#162736' : '#eff4ff',
        hoverBorderColor: '#0f8b8d',
        activeBorderColor: '#0f8b8d',
      },
    },
  };
}
