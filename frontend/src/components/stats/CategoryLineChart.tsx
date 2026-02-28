import Svg, {
  Circle,
  Line as SvgLine,
  Path,
  Text as SvgText,
} from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { Category } from '../../types';

type DataPoint = { rated_date: string; score: number };

function buildSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const cpx = ((pts[i - 1].x + pts[i].x) / 2).toFixed(1);
    d += ` C ${cpx} ${pts[i - 1].y.toFixed(1)}, ${cpx} ${pts[i].y.toFixed(1)}, ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
  }
  return d;
}

function getXLabels(data: DataPoint[]): { index: number; label: string }[] {
  const n = data.length;
  if (n === 0) return [];

  if (n <= 7) {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return data.map((d, i) => ({
      index: i,
      label: days[new Date(d.rated_date + 'T00:00:00').getDay()],
    }));
  }

  if (n <= 31) {
    const pick = [0, Math.round(n / 4), Math.round(n / 2), Math.round((3 * n) / 4), n - 1];
    return [...new Set(pick)].map((i) => ({
      index: i,
      label: String(new Date(data[i].rated_date + 'T00:00:00').getDate()),
    }));
  }

  // Year — one label per month
  const seen = new Set<number>();
  const labels: { index: number; label: string }[] = [];
  data.forEach((d, i) => {
    const month = new Date(d.rated_date + 'T00:00:00').getMonth();
    if (!seen.has(month)) {
      seen.add(month);
      labels.push({
        index: i,
        label: new Date(d.rated_date + 'T00:00:00').toLocaleDateString('en', { month: 'short' }),
      });
    }
  });
  return labels;
}

type Props = {
  category: Category;
  data: DataPoint[];
  width: number;
  height?: number;
  showAxes?: boolean;
};

const DEFAULT_CHART_H = 130;
const PAD = { top: 12, bottom: 22, left: 28, right: 8 };
const GUIDES = [2, 5, 8];

export default function CategoryLineChart({ category, data, width, height, showAxes }: Props) {
  const { isDark } = useTheme();

  const guideColor = isDark ? '#252530' : '#E5E5EA';
  const axisColor = isDark ? '#35353F' : '#C6C6C8';
  const yLabelColor = isDark ? '#5A5A5E' : '#8E8E93';
  const xLabelColor = isDark ? '#8E8E93' : '#6C6C70';

  const CHART_H = height ?? DEFAULT_CHART_H;
  const cw = width - PAD.left - PAD.right;
  const ch = CHART_H - PAD.top - PAD.bottom;

  const toX = (i: number) => PAD.left + (i / Math.max(data.length - 1, 1)) * cw;
  const toY = (score: number) => PAD.top + (1 - (score - 1) / 9) * ch;

  const pts = data.map((d, i) => ({ x: toX(i), y: toY(d.score), ...d }));
  const linePath = buildSmoothPath(pts);
  const areaPath =
    pts.length >= 2
      ? `${linePath} L ${toX(pts.length - 1).toFixed(1)} ${(PAD.top + ch).toFixed(1)} L ${toX(0).toFixed(1)} ${(PAD.top + ch).toFixed(1)} Z`
      : '';

  const xLabels = getXLabels(data);

  return (
    <Svg width={width} height={CHART_H}>
      {/* Y axis line */}
      {showAxes && (
        <SvgLine
          x1={PAD.left}
          y1={PAD.top}
          x2={PAD.left}
          y2={PAD.top + ch}
          stroke={axisColor}
          strokeWidth={1.5}
        />
      )}
      {/* X axis line */}
      {showAxes && (
        <SvgLine
          x1={PAD.left}
          y1={PAD.top + ch}
          x2={PAD.left + cw}
          y2={PAD.top + ch}
          stroke={axisColor}
          strokeWidth={1.5}
        />
      )}

      {/* Horizontal guides */}
      {GUIDES.map((v) => (
        <SvgLine
          key={`g${v}`}
          x1={PAD.left}
          y1={toY(v)}
          x2={PAD.left + cw}
          y2={toY(v)}
          stroke={guideColor}
          strokeWidth={1}
        />
      ))}
      {GUIDES.map((v) => (
        <SvgText
          key={`gt${v}`}
          x={PAD.left - 4}
          y={toY(v) + 4}
          textAnchor="end"
          fontSize={9}
          fill={yLabelColor}
        >
          {v}
        </SvgText>
      ))}

      {/* Area fill */}
      {areaPath ? (
        <Path d={areaPath} fill={category.color} fillOpacity={0.15} />
      ) : null}

      {/* Line */}
      {linePath ? (
        <Path
          d={linePath}
          stroke={category.color}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null}

      {/* Dots — only for small datasets */}
      {data.length <= 14 &&
        pts.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill={category.color} />
        ))}

      {/* X axis labels */}
      {xLabels.map((l) => (
        <SvgText
          key={`xl${l.index}`}
          x={toX(l.index)}
          y={CHART_H - 4}
          textAnchor="middle"
          fontSize={9}
          fill={xLabelColor}
        >
          {l.label}
        </SvgText>
      ))}
    </Svg>
  );
}
