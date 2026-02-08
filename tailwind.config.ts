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
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
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
        // SevaaSetu Custom Colors
        saffron: {
          DEFAULT: "hsl(var(--saffron))",
          foreground: "hsl(var(--saffron-foreground))",
          50: "hsl(30 100% 97%)",
          100: "hsl(30 100% 92%)",
          200: "hsl(30 100% 82%)",
          300: "hsl(30 100% 70%)",
          400: "hsl(30 100% 60%)",
          500: "hsl(30 100% 50%)",
          600: "hsl(28 100% 45%)",
          700: "hsl(25 100% 38%)",
        },
        "india-green": {
          DEFAULT: "hsl(var(--india-green))",
          foreground: "hsl(var(--india-green-foreground))",
          50: "hsl(140 60% 96%)",
          100: "hsl(140 60% 90%)",
          200: "hsl(140 60% 75%)",
          300: "hsl(140 60% 55%)",
          400: "hsl(140 63% 40%)",
          500: "hsl(140 63% 28%)",
          600: "hsl(140 65% 22%)",
        },
        navy: {
          DEFAULT: "hsl(225 73% 20%)",
          50: "hsl(225 50% 97%)",
          100: "hsl(225 50% 92%)",
          200: "hsl(225 50% 80%)",
          300: "hsl(225 60% 60%)",
          400: "hsl(225 65% 40%)",
          500: "hsl(225 73% 20%)",
          600: "hsl(225 80% 15%)",
          700: "hsl(225 85% 10%)",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "civic": "0 4px 20px -2px rgba(0, 0, 0, 0.08)",
        "civic-lg": "0 10px 40px -4px rgba(0, 0, 0, 0.1)",
        "saffron": "0 4px 20px -2px hsl(30 100% 50% / 0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
