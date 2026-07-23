export type ResolvedAppearance = 'light' | 'dark';
export type Appearance = ResolvedAppearance | 'system';

export type UseAppearanceReturn = {
    readonly appearance: Appearance;
    readonly resolvedAppearance: ResolvedAppearance;
    readonly updateAppearance: (mode: Appearance) => void;
};

const setCookie = (name: string, value: string, days = 365): void => {
    if (typeof document === 'undefined') {
        return;
    }

    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};

// App is locked to a single, eye-friendly light theme. Dark/system are disabled.
const applyLight = (): void => {
    if (typeof document === 'undefined') {
        return;
    }

    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
};

const persistLight = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('appearance', 'light');
    }

    setCookie('appearance', 'light');
};

export function initializeTheme(): void {
    if (typeof window === 'undefined') {
        return;
    }

    // Force light for everyone, overriding any previously stored dark/system value.
    persistLight();
    applyLight();
}

export function useAppearance(): UseAppearanceReturn {
    const updateAppearance = (): void => {
        persistLight();
        applyLight();
    };

    return {
        appearance: 'light',
        resolvedAppearance: 'light',
        updateAppearance,
    } as const;
}
