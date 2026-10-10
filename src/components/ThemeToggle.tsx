"use client";
import React, {useSyncExternalStore} from "react";
import {useMounted} from "../services/useToday";

type Theme = "light" | "dark";

const themeSubscribe = (onStoreChange: () => void) => {
    window.addEventListener("ez-theme-change", onStoreChange);
    return () => window.removeEventListener("ez-theme-change", onStoreChange);
};

function getThemeSnapshot(): Theme {
    return document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
}

function getThemeServerSnapshot(): Theme {
    return "light";
}

export default function ThemeToggle() {
    // The DOM attribute is the source of truth; useSyncExternalStore reads it
    // safely during SSR/hydration (server snapshot "light") and after mount.
    const theme = useSyncExternalStore(themeSubscribe, getThemeSnapshot, getThemeServerSnapshot);
    const mounted = useMounted();

    function toggle() {
        const next: Theme = theme === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-bs-theme", next);
        try {
            localStorage.setItem("theme", next);
        } catch (e) {
            // ignore persistence failures (e.g. private mode)
        }
        window.dispatchEvent(new Event("ez-theme-change"));
    }

    const isDark = theme === "dark";
    const label = isDark ? "Helles Design aktivieren" : "Dunkles Design aktivieren";

    return (
        <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={label}
            title={label}
            // avoid a hydration flash: render neutral until we've read the real theme
            suppressHydrationWarning
        >
            {mounted && isDark ? (
                // sun (switch to light)
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4"/>
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
                </svg>
            ) : (
                // moon (switch to dark)
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
                     strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            )}
        </button>
    );
}
