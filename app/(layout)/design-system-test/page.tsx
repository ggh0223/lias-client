"use client";

import React, { useState, useMemo } from "react";

const ColorBox = ({
  colorName,
  className,
}: {
  colorName: string;
  className: string;
}) => (
  <div className="flex items-center gap-4">
    <div
      className={`w-10 h-10 rounded-md border border-border ${className}`}
    ></div>
    <span className="font-mono text-sm">{colorName}</span>
  </div>
);

const Swatch = ({ color }: { color: string }) => {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  return (
    <div className="flex flex-col gap-2">
      <h4 className="font-semibold capitalize text-lg mb-2">{color}</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-2">
        {shades.map((shade) => (
          <div key={`${color}-${shade}`} className="text-xs">
            <div
              className={`h-12 w-full rounded-md bg-${color}-${shade} border border-black/10`}
            ></div>
            <p className="mt-1 font-mono">{shade}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TestPage() {
  const [theme, setTheme] = useState("light");

  const themes = useMemo(
    () => [
      { name: "Light", value: "light" },
      { name: "Dark", value: "dark" },
      { name: "Dracula", value: "theme-dracula" },
      { name: "Pastel", value: "theme-pastel" },
      { name: "CI", value: "theme-ci" },
      { name: "GitHub", value: "theme-github" },
      { name: "Midnight", value: "theme-midnight" },
      { name: "Ocean", value: "theme-ocean" },
      { name: "Forest", value: "theme-forest" },
      { name: "Sunset", value: "theme-sunset" },
      { name: "Aurora", value: "theme-aurora" },
      { name: "Cosmic", value: "theme-cosmic" },
    ],
    []
  );

  const themeClasses =
    theme === "light" ? "" : theme === "dark" ? "dark" : theme;

  const colorPalette = useMemo(
    () => [
      "neutral",
      "gray",
      "blue",
      "red",
      "green",
      "yellow",
      "orange",
      "purple",
      "pink",
      "teal",
      "cyan",
      "indigo",
      "lime",
      "amber",
      "emerald",
      "violet",
      "fuchsia",
      "rose",
    ],
    []
  );
  const gradients = useMemo(
    () => [
      "primary",
      "secondary",
      "accent",
      "success",
      "warning",
      "danger",
      "info",
      "blue",
      "purple",
      "pink",
      "green",
      "orange",
      "red",
      "teal",
      "cyan",
      "indigo",
      "violet",
      "fuchsia",
      "rose",
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
      "lime",
      "emerald",
      "amber",
      "yellow",
      "sunset",
      "ocean",
      "forest",
      "fire",
      "aurora",
      "cosmic",
      "midnight",
      "dawn",
      "dusk",
      "spring",
      "summer",
      "autumn",
      "winter",
    ],
    []
  );

  return (
    <div className={themeClasses}>
      <div className="bg-background text-foreground transition-colors duration-300">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-12">
            <h1 className="text-4xl font-extrabold font-heading tracking-tight mb-2">
              Design System Showcase
            </h1>
            <p className="text-lg text-secondary">
              A showcase of the components and styles available in the design
              system.
            </p>
            <div className="mt-6">
              <label
                htmlFor="theme-select"
                className="block text-sm font-medium mb-2"
              >
                Select Theme:
              </label>
              <select
                id="theme-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-surface border border-border rounded-md py-2 px-3 focus:ring-2 focus:ring-primary focus:border-primary transition"
              >
                {themes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <main className="space-y-16">
            <section>
              <h2 className="text-3xl font-bold font-heading border-b border-border pb-2 mb-6">
                Typography
              </h2>
              <div className="space-y-4">
                <p className="text-h1 font-heading">Heading 1</p>
                <p className="text-h2 font-heading">Heading 2</p>
                <p className="text-h3 font-heading">Heading 3</p>
                <p className="text-body font-sans">
                  This is a body paragraph using the &apos;sans&apos; font
                  family. Lorem ipsum dolor sit amet, consectetur adipiscing
                  elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
                  amet, adipiscing nec, ultricies sed, dolor.
                </p>
                <p className="font-mono text-sm">
                  This is a mono-spaced font, typically used for code.
                  &apos;const greeting = &quot;Hello, World!&quot;;&apos;
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold font-heading border-b border-border pb-2 mb-6">
                Colors
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ColorBox colorName="Primary" className="bg-primary" />
                <ColorBox colorName="Secondary" className="bg-secondary" />
                <ColorBox colorName="Accent" className="bg-accent" />
                <ColorBox colorName="Success" className="bg-success" />
                <ColorBox colorName="Warning" className="bg-warning" />
                <ColorBox colorName="Danger" className="bg-danger" />
                <ColorBox colorName="Info" className="bg-info" />
                <ColorBox colorName="Surface" className="bg-surface" />
                <ColorBox colorName="Border" className="bg-border" />
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold font-heading border-b border-border pb-2 mb-6">
                Buttons & Sizing
              </h2>
              <div className="flex flex-wrap items-start gap-4">
                <button className="bg-primary text-primary-foreground hover:bg-opacity-80 transition-all font-bold py-2 px-4 rounded-md">
                  Primary Button
                </button>
                <button className="bg-secondary text-secondary-foreground hover:bg-opacity-80 transition-all font-bold py-2 px-4 rounded-lg">
                  Secondary Radius
                </button>
                <button className="bg-accent text-accent-foreground hover:bg-opacity-80 transition-all font-bold py-3 px-6 rounded-xl">
                  Accent Large
                </button>
                <button className="bg-danger text-danger-foreground hover:bg-opacity-80 transition-all font-bold py-4 px-8 rounded-full">
                  Danger Pill
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold font-heading border-b border-border pb-2 mb-6">
                Card
              </h2>
              <div className="bg-surface border border-border rounded-xl p-6 shadow-lg max-w-md">
                <h3 className="text-xl font-bold font-heading text-primary mb-2">
                  Card Component
                </h3>
                <p className="text-secondary mb-4">
                  This is a simple card component that uses &apos;surface&apos;,
                  &apos;border&apos;, and &apos;shadow&apos; styles from the
                  theme. It&apos;s a great way to group related content.
                </p>
                <button className="bg-primary text-primary-foreground hover:bg-opacity-80 font-semibold py-2 px-4 rounded-md w-full">
                  Action
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold font-heading border-b border-border pb-2 mb-6">
                Color Palette
              </h2>
              <div className="space-y-8">
                {colorPalette.map((color) => (
                  <Swatch key={color} color={color} />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold font-heading border-b border-border pb-2 mb-6">
                Gradients
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gradients.map((gradient) => (
                  <div
                    key={gradient}
                    className="h-24 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-transparent to-transparent"
                    style={{
                      backgroundImage: `var(--tw-gradient-stops, var(--tw-gradient-from, transparent), var(--tw-gradient-to, transparent))`,
                    }}
                  >
                    <div
                      className={`h-full w-full rounded-lg flex items-center justify-center bg-gradient-${gradient}`}
                    >
                      <span className="font-mono text-xs text-white/80 mix-blend-difference">
                        {gradient}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
