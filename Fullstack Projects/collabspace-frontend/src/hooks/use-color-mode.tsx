import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ColorMode = 'light' | 'dark';

type ColorModeContextValue = {
  mode: ColorMode;
  toggleMode: () => void;
  setMode: (mode: ColorMode) => void;
};

const STORAGE_KEY = 'collabspace_color_mode';

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

function getInitialMode(): ColorMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'dark' ? 'dark' : 'light';
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ColorMode>(() => getInitialMode());

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const value = useMemo<ColorModeContextValue>(
    () => ({
      mode,
      toggleMode: () => setModeState((current) => (current === 'light' ? 'dark' : 'light')),
      setMode: setModeState,
    }),
    [mode],
  );

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error('useColorMode must be used inside ColorModeProvider');
  }

  return context;
}
