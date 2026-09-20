// Original NEWSAI editorial artwork.
//
// NEWSAI stores no photography and never links off-site, so every story carries
// a plate that is generated here: deterministic, print-derived SVG compositions
// (halftones, raster fields, engraved arcs, column proofs, modular grids and
// display glyphs). Each plate is a pure function of the story's id, renders
// identically on the server and in the browser, needs zero network requests,
// and inherits the current edition's ink, paper and accent through CSS.

import { cn } from "@/lib/utils";
import { mulberry, plateSeed } from "@/lib/editorial";

export type PlateRatio = "hero" | "feature" | "small" | "portrait";

export interface StoryPlateProps {
  /** Stable identifier — usually the filing id. Decides the composition. */
  seed: string | number;
  /** Text the plate illustrates: accessible label and display glyph source. */
  label: string;
  ratio?: PlateRatio;
  className?: string;
  /** Print the plate code in the corner as editorial furniture. */
  showCode?: boolean;
}

/** Internal viewBox is ratio-matched, so nothing is ever cropped or squashed. */
const RATIO_VALUE: Record<PlateRatio, number> = {
  hero: 16 / 9,
  feature: 4 / 3,
  small: 3 / 2,
  portrait: 4 / 5,
};

const RATIO_CLASS: Record<PlateRatio, string> = {
  hero: "ratio-hero",
  feature: "ratio-feature",
  small: "ratio-small",
  portrait: "ratio-portrait",
};

const VARIANT_NAMES = [
  "Halftone field",
  "Raster scan",
  "Concentric arcs",
  "Column proof",
  "Modular grid",
  "Display glyph",
];

const W = 160;

interface VariantProps {
  rnd: () => number;
  accent: boolean;
  height: number;
  glyph: string;
}

/** Corner crop marks — the print furniture that frames every plate. */
function cropMarks(height: number): string[] {
  const inset = Math.min(W, height) * 0.05;
  const len = Math.min(W, height) * 0.055;
  const [right, bottom] = [W - inset, height - inset];
  return [
    `M${inset} ${inset + len} L${inset} ${inset} L${inset + len} ${inset}`,
    `M${right - len} ${inset} L${right} ${inset} L${right} ${inset + len}`,
    `M${inset} ${bottom - len} L${inset} ${bottom} L${inset + len} ${bottom}`,
    `M${right - len} ${bottom} L${right} ${bottom} L${right} ${bottom - len}`,
  ];
}

function Halftone({ rnd, accent, height }: VariantProps) {
  const step = W / 16;
  const rows = Math.max(4, Math.round(height / step));
  const dots = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < 16; col += 1) {
      const radius = step * 0.07 + rnd() * step * 0.2;
      dots.push(
        <circle
          key={`${row}-${col}`}
          cx={col * step + step / 2}
          cy={row * step + step / 2}
          r={radius}
          fill="currentColor"
          fillOpacity={0.12 + rnd() * 0.68}
        />,
      );
    }
  }
  return (
    <>
      {dots}
      <rect
        x="0"
        y={height * 0.62}
        width={W}
        height="0.8"
        fill="currentColor"
        fillOpacity="0.45"
      />
      {accent ? (
        <rect
          className="plate-accent"
          x={W * 0.64}
          y={height * 0.82}
          width={W * 0.29}
          height="2"
        />
      ) : null}
    </>
  );
}

function Raster({ rnd, accent, height }: VariantProps) {
  const lines = [];
  let y = height * 0.04;
  let index = 0;
  while (y < height * 0.98) {
    const thickness = 0.4 + rnd() * 2.4;
    lines.push(
      <rect
        key={index}
        x="0"
        y={y}
        width={W}
        height={thickness}
        fill="currentColor"
        fillOpacity={0.1 + rnd() * 0.8}
      />,
    );
    y += thickness + 1.2 + rnd() * 3.4;
    index += 1;
  }
  const barX = W * (0.2 + rnd() * 0.6);
  return (
    <>
      {lines}
      <rect
        x={barX}
        y="0"
        width="1.4"
        height={height}
        fill="currentColor"
        fillOpacity="0.5"
      />
      {accent ? (
        <rect
          className="plate-accent"
          x={barX - W * 0.12}
          y={height * 0.9}
          width={W * 0.24}
          height="2"
        />
      ) : null}
    </>
  );
}

function Arcs({ rnd, accent, height }: VariantProps) {
  const cx = W * (0.3 + rnd() * 0.4);
  const cy = height * (0.35 + rnd() * 0.3);
  const unit = Math.min(W, height);
  const rings = [0, 1, 2, 3, 4, 5].map((i) => (
    <circle
      key={i}
      cx={cx}
      cy={cy}
      r={unit * (0.12 + i * 0.13)}
      fill="none"
      stroke="currentColor"
      strokeOpacity={0.5 - i * 0.06}
      strokeWidth="0.6"
    />
  ));
  return (
    <>
      {rings}
      <rect
        x={W * 0.74}
        y="0"
        width="0.8"
        height={height}
        fill="currentColor"
        fillOpacity="0.35"
      />
      <circle cx={cx} cy={cy} r="2.6" fill="currentColor" />
      {accent ? (
        <rect
          className="plate-accent"
          x={W * 0.08}
          y={height * 0.9}
          width={W * 0.26}
          height="2"
        />
      ) : null}
    </>
  );
}

function Columns({ rnd, accent, height }: VariantProps) {
  const bands = [];
  let x = 0;
  let index = 0;
  while (x < W && index < 24) {
    const width = W * (0.06 + rnd() * 0.17);
    const roll = rnd();
    bands.push(
      <rect
        key={index}
        x={x}
        y="0"
        width={width}
        height={height}
        fill="currentColor"
        fillOpacity={roll > 0.82 ? 0.88 : 0.05 + roll * 0.2}
      />,
    );
    x += width;
    index += 1;
  }
  return (
    <>
      {bands}
      {[0.2, 0.8].map((v) => (
        <rect
          key={v}
          x="0"
          y={height * v}
          width={W}
          height="0.7"
          fill="currentColor"
          fillOpacity="0.5"
        />
      ))}
      {accent ? (
        <rect
          className="plate-accent"
          x={W * 0.08}
          y={height * 0.47}
          width={W * 0.3}
          height="2"
        />
      ) : null}
    </>
  );
}

function Modules({ rnd, accent, height }: VariantProps) {
  const step = W / 8;
  const rows = Math.max(3, Math.round(height / step));
  const grid = [];
  for (let col = 1; col < 8; col += 1) {
    grid.push(
      <rect
        key={`v${col}`}
        x={col * step}
        y="0"
        width="0.5"
        height={height}
        fill="currentColor"
        fillOpacity="0.32"
      />,
    );
  }
  for (let row = 1; row < rows; row += 1) {
    grid.push(
      <rect
        key={`h${row}`}
        x="0"
        y={row * step}
        width={W}
        height="0.5"
        fill="currentColor"
        fillOpacity="0.32"
      />,
    );
  }
  const col = Math.floor(rnd() * 8);
  const row = Math.floor(rnd() * rows);
  const x = col * step;
  const y = row * step;
  const solid = rnd() > 0.55;
  return (
    <>
      {grid}
      <rect
        x={x}
        y={y}
        width={step}
        height={step}
        fill="currentColor"
        fillOpacity={solid ? 0.9 : 0.2}
      />
      <circle
        cx={x + step / 2}
        cy={y + step / 2}
        r="1.6"
        fill="currentColor"
        fillOpacity="0.9"
      />
      {accent ? (
        <rect
          className="plate-accent"
          x={x + step * 0.2}
          y={Math.min(y + step + 3, height - 4)}
          width={step * 1.1}
          height="2"
        />
      ) : null}
    </>
  );
}

function Glyph({ rnd, accent, height, glyph }: VariantProps) {
  const unit = Math.min(W, height);
  const size = Math.min(W * 0.34, height * 0.62);
  return (
    <>
      <circle
        cx={W * (0.66 + rnd() * 0.18)}
        cy={height * (0.28 + rnd() * 0.2)}
        r={unit * (0.16 + rnd() * 0.08)}
        fill="currentColor"
        fillOpacity="0.12"
      />
      <text
        className="plate-glyph"
        x={W * 0.09}
        y={height * 0.78}
        fontSize={size}
        fill="currentColor"
        fillOpacity="0.94"
      >
        {glyph}
      </text>
      <rect
        x="0"
        y={height * 0.94}
        width={W}
        height="0.6"
        fill="currentColor"
        fillOpacity="0.45"
      />
      {accent ? (
        <rect
          className="plate-accent"
          x={W * 0.09}
          y={height * 0.16}
          width={W * 0.32}
          height="2"
        />
      ) : null}
    </>
  );
}

const VARIANTS = [Halftone, Raster, Arcs, Columns, Modules, Glyph];

export default function StoryPlate({
  seed,
  label,
  ratio = "feature",
  className,
  showCode = true,
}: StoryPlateProps) {
  const raw = plateSeed(seed);
  const Variant = VARIANTS[raw % VARIANTS.length];
  const invert = raw % 5 === 1;
  const accent = raw % 3 !== 0;
  const height = W / RATIO_VALUE[ratio];
  const glyph = (label.trim().charAt(0) || "N").toUpperCase();
  const variantName = VARIANT_NAMES[raw % VARIANT_NAMES.length];

  return (
    <div
      className={cn("plate", RATIO_CLASS[ratio], invert && "plate-invert", className)}
    >
      <svg
        className="plate-art"
        viewBox={`0 0 ${W} ${height}`}
        role="img"
        aria-label={`Editorial plate: ${variantName} generated for “${label}”`}
        focusable="false"
        preserveAspectRatio="none"
      >
        {cropMarks(height).map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        ))}
        <Variant
          rnd={mulberry(raw)}
          accent={accent}
          height={height}
          glyph={glyph}
        />
        {showCode ? (
          <text
            className="plate-code"
            x={W * 0.03}
            y={height - Math.min(W, height) * 0.035}
            fontSize={Math.max(2.8, Math.min(W, height) * 0.036)}
            fill="currentColor"
            fillOpacity="0.55"
          >
            {`Plate ${String((raw % VARIANTS.length) + 1).padStart(2, "0")} · ${variantName}`}
          </text>
        ) : null}
      </svg>
    </div>
  );
}
