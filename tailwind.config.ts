import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // OpenArt color palette
        openart: {
          purple: "hsl(var(--openart-purple))",
          blue: "hsl(var(--openart-blue))",
          "blue-alt": "hsl(var(--openart-blue-alt))",
          yellow: "hsl(var(--openart-yellow))",
          "yellow-alt": "hsl(var(--openart-yellow-alt))",
        },
        // Icon background themes
        "icon-video": {
          bg: "hsl(var(--icon-video-bg))",
          fg: "hsl(var(--icon-video-fg))",
        },
        "icon-ai": {
          bg: "hsl(var(--icon-ai-bg))",
          fg: "hsl(var(--icon-ai-fg))",
        },
        "icon-creative": {
          bg: "hsl(var(--icon-creative-bg))",
          fg: "hsl(var(--icon-creative-fg))",
        },
        "icon-model": {
          bg: "hsl(var(--icon-model-bg))",
          fg: "hsl(var(--icon-model-fg))",
        },
        "icon-search": {
          bg: "hsl(var(--icon-search-bg))",
          fg: "hsl(var(--icon-search-fg))",
        },
        // Status colors
        status: {
          submitted: "hsl(var(--status-submitted))",
          "submitted-light": "hsl(var(--status-submitted-light))",
          progress: "hsl(var(--status-progress))",
          "progress-light": "hsl(var(--status-progress-light))",
          resolved: "hsl(var(--status-resolved))",
          "resolved-light": "hsl(var(--status-resolved-light))",
        },
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-promo": "var(--gradient-promo)",
        "gradient-card": "var(--gradient-card)",
      },
      boxShadow: {
        "card": "var(--shadow-card)",
        "elevated": "var(--shadow-elevated)",
      },
      transitionProperty: {
        "smooth": "var(--transition-smooth)",
        "bounce": "var(--transition-bounce)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
