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

    </div>
  );
}
