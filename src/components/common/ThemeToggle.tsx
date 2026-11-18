import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useThemeStore, ThemePreference } from '../../store/themeStore';

const OPTIONS: Array<{ value: ThemePreference; label: string; Icon: typeof Sun }> = [
  { value: 'system', label: 'Match device', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

/**
 * Tri-state, not a binary switch: "match my device" has to be a real choice the
 * student can return to, otherwise the first tap permanently opts them out of
 * their own OS setting.
 */
export const ThemeToggle: React.FC = () => {
  const { preference, setPreference } = useThemeStore();

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="flex items-center p-0.5 rounded-lg border border-subtle bg-sunken"
    >
      {OPTIONS.map(({ value, label, Icon }) => {
        const active = preference === value;
        return (
          <button
            key={value}
            role="radio"
            aria-checked={active}
            aria-label={label}
            title={label}
            onClick={() => setPreference(value)}
            className={`p-1.5 rounded-md transition-colors ${
              active ? 'bg-surface text-primary' : 'text-faint hover:text-muted'
            }`}
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
};
