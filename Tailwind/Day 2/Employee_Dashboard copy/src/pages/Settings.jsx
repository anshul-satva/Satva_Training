import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/slices/themeSlice";
import Toggle from "../components/ui/Toggle";

export default function Settings() {
  const dispatch = useDispatch();
  const { mode } = useSelector((s) => s.theme);
  const isDark = mode === "dark";

  return (
    <div className="space-y-5 max-w-xl animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold text-surface-900 dark:text-white">
          Settings
        </h2>
      </div>

      <div className="card p-5 divide-y divide-surface-50 dark:divide-surface-800">
        <Toggle
          checked={isDark}
          onChange={() => dispatch(toggleTheme())}
          label="Dark Mode"
        />
      </div>
      {/* <div className="relative overflow-hidden rounded-2xl border border-white/40 dark:border-surface-700/40 bg-white/70 dark:bg-surface-800/70 backdrop-blur-md p-6">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-brand-400/20 dark:bg-brand-600/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-brand-300/10 dark:bg-brand-500/10 blur-2xl pointer-events-none" />
        <div className="relative space-y-1">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">Employee Admin Dashboard</p>
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed pt-1">
            React | Tailwind CSS
          </p>
        </div>
      </div> */}
      

    </div>
  );
}
