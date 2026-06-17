import cabinImg from "@/assets/cabin.jpg";
import { Panel } from "@/components/dashboard/Panel";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ClipboardList,
  Cloud,
  Droplets,
  FileText,
  Leaf,
  ListChecks,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Sun,
  Thermometer,
  UserCheck,
  Wifi,
  WifiOff,
  Workflow,
  Wrench,
} from "lucide-react";
import { type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "智能种植方舱数字孪生系统" },
      {
        name: "description",
        content:
          "38㎡ 智能蘑菇种植方舱数字孪生指挥中心,68 个传感点位实时监控、风险处置与闭环作业。",
      },
    ],
  }),
  component: Dashboard,
});

/* ---------------- Header ---------------- */

function HeaderChip({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 h-full">
      <span className="text-[oklch(0.78_0.18_160)]">{icon}</span>
      <span className="text-[12px] text-muted-foreground tracking-wider">{label}</span>
      <span className={cn("text-[13px] font-semibold text-foreground", valueClass)}>
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div className="h-6 chip-divider" />;
}

function TopHeader() {
  return (
    <header
      className="relative h-[68px] rounded-xl border border-[oklch(0.6_0.16_160_/_0.45)] flex items-center"
      style={{
        background: "var(--gradient-header)",
        boxShadow:
          "0 0 30px oklch(0.6 0.16 160 / 0.18), inset 0 1px 0 oklch(0.85 0.18 160 / 0.12)",
      }}
    >
      {/* corner cuts */}
      <span className="absolute top-0 left-0 h-3 w-4 border-t-2 border-l-2 rounded-tl-xl border-[oklch(0.85_0.2_160)]" />
      <span className="absolute top-0 right-0 h-3 w-4 border-t-2 border-r-2 rounded-tr-xl border-[oklch(0.85_0.2_160)]" />
      <span className="absolute bottom-0 left-0 h-3 w-4 border-b-2 border-l-2 rounded-bl-xl border-[oklch(0.85_0.2_160)]" />
      <span className="absolute bottom-0 right-0 h-3 w-4 border-b-2 border-r-2 rounded-br-xl border-[oklch(0.85_0.2_160)]" />

      <div className="flex items-center divide-x divide-transparent h-full">
        <HeaderChip
          icon={<FileText size={14} />}
          label="当前批次"
          value="JE-202606-001"
        />
        <Divider />
        <HeaderChip
          icon={<Leaf size={14} />}
          label="当前阶段"
          value="子实体生长期"
        />
        <Divider />
        <HeaderChip
          icon={<ShieldCheck size={14} />}
          label="环境评分"
          value={<span className="text-[oklch(0.85_0.2_160)]">91</span>}
        />
      </div>

      <div className="flex-1 text-center">
        <h1
          className="text-[24px] font-bold tracking-[0.18em] text-foreground text-glow-green"
          style={{ fontFamily: "var(--font-display)" }}
        >
          智能种植方舱数字孪生系统
        </h1>
        <p className="text-[10px] tracking-[0.4em] text-[oklch(0.72_0.12_160)] mt-0.5">
          INTELLIGENT CULTIVATION CABIN DIGITAL TWIN SYSTEM
        </p>
      </div>

      <div className="flex items-center h-full">
        <HeaderChip
          icon={<Radio size={14} />}
          label="在线点位"
          value={<span className="text-[oklch(0.85_0.2_160)]">68 / 68</span>}
        />
        <Divider />
        <HeaderChip
          icon={<Bell size={14} />}
          label="待处理报警"
          value={<span className="text-[oklch(0.85_0.18_70)] text-glow-amber">6</span>}
        />
        <Divider />
        <HeaderChip
          icon={<Activity size={14} />}
          label="时间"
          value="2026-06-16 17:08"
        />
        <Divider />
        <HeaderChip icon={<UserCheck size={14} />} label="班次" value="晚班" />
      </div>
    </header>
  );
}

/* ---------------- Task Panel ---------------- */

const tasks = [
  {
    id: "P1",
    title: "复核下层湿度点位 TH-L2-002",
    deadline: "截止 17:30",
    action: "立即复核",
  },
  {
    id: "P2",
    title: "检查新风后 CO2 回落曲线",
    deadline: "截止 18:30",
    action: "去处理",
  },
  {
    id: "P3",
    title: "完成晚班交接留痕",
    deadline: "截止 19:00",
    action: "记录",
  },
];

function TaskCard({ t }: { t: (typeof tasks)[number] }) {
  return (
    <div
      className="relative flex items-center gap-3 rounded-lg border border-[oklch(0.6_0.14_160_/_0.35)] px-3 py-3"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.26 0.05 175 / 0.55), oklch(0.18 0.04 180 / 0.6))",
      }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md font-bold text-[15px] text-[oklch(0.18_0.04_175)]"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.88 0.2 160), oklch(0.7 0.18 160))",
          boxShadow: "0 0 12px oklch(0.8 0.18 160 / 0.5)",
        }}
      >
        {t.id}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-foreground leading-snug break-words">
          {t.title}
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Activity size={11} /> {t.deadline}
          </span>
          <span className="inline-flex items-center gap-1 text-[oklch(0.82_0.16_70)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.82_0.16_70)]" />
            待处理
          </span>
        </div>
      </div>
      <button
        className="shrink-0 rounded-md border border-[oklch(0.78_0.18_160_/_0.6)] px-3 py-1.5 text-[12px] text-[oklch(0.88_0.18_160)] hover:bg-[oklch(0.78_0.18_160_/_0.12)] transition"
        style={{ boxShadow: "inset 0 0 0 1px oklch(0.78 0.18 160 / 0.1)" }}
      >
        {t.action}
      </button>
    </div>
  );
}

function TaskPanel() {
  return (
    <Panel title="今日任务" icon={<ClipboardList size={16} />} bodyClassName="space-y-2.5">
      {tasks.map((t) => (
        <TaskCard key={t.id} t={t} />
      ))}
    </Panel>
  );
}

/* ---------------- Environment Panel ---------------- */

const envRows = [
  { icon: <Thermometer size={14} />, label: "温度", value: "21.3", unit: "°C" },
  {
    icon: <Droplets size={14} />,
    label: "湿度",
    value: "84.9",
    unit: "%RH",
    warn: true,
  },
  { icon: <Cloud size={14} />, label: "CO₂", value: "812", unit: "ppm" },
  { icon: <Sun size={14} />, label: "光照", value: "12.6", unit: "klx" },
];

function EnvironmentPanel() {
  return (
    <Panel title="环境实时数据" icon={<Activity size={16} />} bodyClassName="p-0">
      <div className="divide-y divide-[oklch(0.6_0.14_160_/_0.18)]">
        {envRows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-[oklch(0.78_0.18_160_/_0.04)] transition"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-[oklch(0.82_0.16_160)] w-4 flex justify-center">{r.icon}</span>
              <span className="text-[13px] text-foreground">{r.label}</span>
            </div>
            <div className="flex items-baseline gap-1 tabular-nums">
              <span
                className={cn(
                  "text-[20px] font-semibold leading-none",
                  r.warn ? "text-[oklch(0.88_0.18_70)] text-glow-amber" : "text-foreground",
                )}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {r.value}
              </span>
              <span className="text-[11px] text-muted-foreground w-10 text-right">{r.unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-[oklch(0.6_0.14_160_/_0.22)] text-[11px] text-muted-foreground bg-[oklch(0.13_0.03_185_/_0.5)]">
        <span>采样时间 <span className="text-foreground tabular-nums">17:08:12</span></span>
        <span>
          环境评分 <span className="text-[oklch(0.85_0.2_160)] font-semibold text-glow-green">91</span>
        </span>
      </div>
    </Panel>
  );
}

/* ---------------- Digital Twin Stage ---------------- */

function SensorCallout({
  className,
  label,
  value,
  warn,
  alignRight,
}: {
  className?: string;
  label: string;
  value: ReactNode;
  warn?: boolean;
  alignRight?: boolean;
}) {
  const color = warn ? "oklch(0.85 0.18 70)" : "oklch(0.85 0.2 160)";
  return (
    <div
      className={cn("absolute pointer-events-none select-none", className)}
      style={{ textAlign: alignRight ? "right" : "left" }}
    >
      <div
        className="inline-flex flex-col gap-0.5 rounded-md px-2.5 py-1.5 border backdrop-blur-md"
        style={{
          background: warn
            ? "linear-gradient(180deg, oklch(0.32 0.1 70 / 0.7), oklch(0.18 0.05 70 / 0.8))"
            : "linear-gradient(180deg, oklch(0.22 0.05 178 / 0.75), oklch(0.14 0.035 180 / 0.85))",
          borderColor: color,
          boxShadow: warn
            ? "0 0 16px oklch(0.8 0.18 70 / 0.35)"
            : "0 0 14px oklch(0.78 0.18 160 / 0.25)",
        }}
      >
        <div
          className="text-[11px] font-semibold tracking-wider"
          style={{ color }}
        >
          {label}
        </div>
        <div className="text-[12px] text-foreground">{value}</div>
      </div>
    </div>
  );
}

function DigitalTwinStage() {
  return (
    <div className="panel relative flex-1 flex flex-col overflow-hidden">
      {/* corners */}
      {[
        "top-0 left-0 border-t-2 border-l-2 rounded-tl-[10px]",
        "top-0 right-0 border-t-2 border-r-2 rounded-tr-[10px]",
        "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[10px]",
        "bottom-0 right-0 border-b-2 border-r-2 rounded-br-[10px]",
      ].map((c, i) => (
        <span
          key={i}
          className={`pointer-events-none absolute h-3 w-3 ${c}`}
          style={{ borderColor: "oklch(0.85 0.2 160)" }}
        />
      ))}

      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-[oklch(0.6_0.14_160_/_0.2)]">
        <div className="flex items-center gap-2">
          <Workflow size={16} className="text-[oklch(0.85_0.18_160)]" />
          <h3 className="text-[15px] font-semibold tracking-wide text-foreground text-glow-green">
            方舱三维总览
          </h3>
          <span className="text-[10px] tracking-[0.3em] text-[oklch(0.7_0.1_160)] ml-2">
            DIGITAL TWIN COMMAND STAGE
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.85_0.2_160)] animate-pulse" />
            系统在线
          </span>
          <span>方舱编号 CABIN-A1 · 38㎡</span>
          <span>数据更新 17:08:12</span>
        </div>
      </div>

      <div className="relative flex-1 stage-bg overflow-hidden">
        {/* faint stage grid masked to center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(oklch(0.55 0.14 165 / 0.06) 1px, transparent 1px), linear-gradient(90deg, oklch(0.55 0.14 165 / 0.06) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 55%, black 35%, transparent 85%)",
          }}
        />
        {/* base platform glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 22% at 50% 88%, oklch(0.78 0.2 160 / 0.28), transparent 70%)",
          }}
        />

        {/* cabin image — dominant, blended into stage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={cabinImg}
            alt="智能种植方舱"
            className="h-auto w-full max-w-[98%] object-contain"
            style={{
              filter:
                "drop-shadow(0 36px 70px oklch(0.6 0.2 160 / 0.55)) saturate(1.05) contrast(1.04)",
              maskImage:
                "radial-gradient(ellipse 78% 72% at 50% 52%, black 45%, transparent 92%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 78% 72% at 50% 52%, black 45%, transparent 92%)",
            }}
          />
        </div>
        {/* atmospheric haze blending cabin with stage */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 35% at 50% 50%, oklch(0.28 0.09 165 / 0.18), transparent 70%)",
          }}
        />
        {/* vignette to dissolve any remaining edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, oklch(0.08 0.025 188 / 0.85) 100%)",
          }}
        />

        {/* sensor callouts */}
        <SensorCallout
          className="top-[10%] left-[20%]"
          label="CO2-L2"
          value={<>CO₂ <span className="font-semibold">812</span> ppm</>}
        />
        <SensorCallout
          className="top-[12%] right-[16%]"
          label="RH-L1-001"
          value={<>湿度 <span className="font-semibold">87.1</span> %RH</>}
          alignRight
        />
        <SensorCallout
          className="bottom-[22%] left-[8%]"
          label="TA-L1-001"
          value={<>温度 <span className="font-semibold">21.3</span> °C</>}
        />
        <SensorCallout
          className="bottom-[18%] right-[12%]"
          label="HUM-01"
          value={<>加湿器 <span className="font-semibold">68</span> %</>}
          alignRight
        />
        <SensorCallout
          className="top-[44%] right-[3%]"
          label="TH-L2-002"
          warn
          alignRight
          value={
            <div className="flex flex-col gap-0.5">
              <div>湿度 <span className="font-semibold">84.9</span> %RH</div>
              <div className="inline-flex items-center gap-1 text-[10px] text-[oklch(0.85_0.18_70)]">
                <AlertTriangle size={10} /> 湿度偏低
              </div>
            </div>
          }
        />
      </div>

      {/* Selected sensor info strip — full width object-property strip */}
      <div className="border-t border-[oklch(0.6_0.14_160_/_0.28)] px-4 py-3 bg-[oklch(0.11_0.03_185_/_0.7)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.85_0.2_160)]" />
          <div className="text-[11px] tracking-[0.25em] text-[oklch(0.78_0.14_160)] uppercase">
            选中点位信息 · Selected Sensor
          </div>
          <div className="flex-1 title-rule" />
        </div>
        <div
          className="grid grid-cols-7 rounded-md border border-[oklch(0.72_0.18_160_/_0.45)] divide-x divide-[oklch(0.6_0.14_160_/_0.28)] overflow-hidden"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.20 0.045 180 / 0.85), oklch(0.13 0.035 185 / 0.92))",
            boxShadow:
              "inset 0 1px 0 oklch(0.85 0.18 160 / 0.14), 0 0 22px oklch(0.55 0.16 160 / 0.18)",
          }}
        >
          {[
            ["点位编号", "TH-L2-002"],
            ["点位名称", "下层湿度点位"],
            ["所属区域", "下层栽培区 L2"],
            ["当前值", <span className="text-[oklch(0.88_0.18_70)] font-semibold text-glow-amber" key="cv">84.9 %RH</span>],
            ["目标值", "≥85 %RH"],
            ["状态", <span className="inline-flex items-center gap-1 text-[oklch(0.88_0.18_70)] font-medium" key="s"><AlertTriangle size={11} /> 湿度偏低</span>],
            ["数据更新时间", <span className="tabular-nums" key="t">17:08:12</span>],
          ].map(([k, v], i) => (
            <div key={i} className="flex flex-col px-3 py-2.5 min-w-0 relative">
              <span className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase">{k}</span>
              <span className="text-[13px] text-foreground mt-1.5 leading-tight">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Risk Panel ---------------- */

function RiskPanel() {
  return (
    <Panel amber title="最大风险" icon={<ShieldAlert size={16} />} bodyClassName="space-y-3">
      <div
        className="rounded-lg border border-[oklch(0.78_0.17_70_/_0.65)] px-4 py-3"
        style={{
          background:
            "linear-gradient(180deg, oklch(0.42 0.13 70 / 0.55), oklch(0.22 0.07 65 / 0.6))",
          boxShadow: "inset 0 0 30px oklch(0.55 0.18 65 / 0.25)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{
              background:
                "radial-gradient(circle, oklch(0.78 0.18 70 / 0.9), oklch(0.55 0.16 60 / 0.4))",
              boxShadow: "0 0 20px oklch(0.8 0.18 70 / 0.55)",
            }}
          >
            <Droplets size={22} className="text-[oklch(0.15_0.04_60)]" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] text-[oklch(0.9_0.12_70)] font-medium">
              下层湿度偏低
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span
                className="text-[34px] font-bold tabular-nums text-[oklch(0.92_0.16_70)] text-glow-amber leading-none"
                style={{ fontFamily: "var(--font-display)" }}
              >
                84.9
              </span>
              <span className="text-[14px] text-[oklch(0.85_0.14_70)]">%RH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-[12px]">
        {[
          ["目标", "≥85 %RH"],
          ["点位", "TH-L2-002"],
          ["建议操作", "17:30 前现场复核并记录"],
          [
            "风险等级",
            <span className="text-[oklch(0.78_0.22_25)] font-semibold text-glow-red" key="r">
              高风险
            </span>,
          ],
        ].map(([k, v], i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-3 border-b border-[oklch(0.7_0.14_70_/_0.15)] pb-1.5 last:border-0"
          >
            <span className="text-muted-foreground shrink-0">{k}</span>
            <span className="text-right text-foreground">{v}</span>
          </div>
        ))}
      </div>

      <button
        className="w-full rounded-md py-2 text-[13px] font-semibold text-[oklch(0.15_0.04_60)] transition hover:brightness-110"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.85 0.18 70), oklch(0.78 0.2 60))",
          boxShadow: "0 0 18px oklch(0.8 0.18 70 / 0.5)",
        }}
      >
        进入报警处置
      </button>
    </Panel>
  );
}

/* ---------------- Workflow Panel ---------------- */

const workflow = [
  { label: "报警", icon: <Bell size={16} />, status: "已识别异常点", state: "done" },
  {
    label: "分派",
    icon: <UserCheck size={16} />,
    status: "已分派种植员复核",
    state: "done",
  },
  {
    label: "处理",
    icon: <Wrench size={16} />,
    status: "现场处理并记录",
    state: "current",
  },
  {
    label: "复核",
    icon: <ClipboardList size={16} />,
    status: "班组长待复核",
    state: "pending",
  },
  {
    label: "关闭",
    icon: <CheckCircle2 size={16} />,
    status: "完成后进入追溯",
    state: "pending",
  },
];

function WorkflowPanel() {
  return (
    <Panel title="报警处理流程" icon={<ListChecks size={16} />}>
      <div className="flex items-start justify-between gap-1 px-1">
        {workflow.map((w, i) => {
          const isDone = w.state === "done";
          const isCurrent = w.state === "current";
          const color = isCurrent
            ? "oklch(0.85 0.18 70)"
            : isDone
              ? "oklch(0.85 0.2 160)"
              : "oklch(0.55 0.04 175)";
          return (
            <div key={w.label} className="flex flex-col items-center flex-1 relative">
              {i < workflow.length - 1 && (
                <span
                  className="absolute top-5 left-[60%] right-[-40%] h-px"
                  style={{
                    background:
                      isDone || isCurrent
                        ? "linear-gradient(90deg, oklch(0.78 0.18 160), oklch(0.6 0.14 160 / 0.4))"
                        : "oklch(0.5 0.04 175 / 0.4)",
                  }}
                />
              )}
              <div
                className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2"
                style={{
                  borderColor: color,
                  background: isCurrent
                    ? "radial-gradient(circle, oklch(0.7 0.16 70 / 0.6), oklch(0.3 0.08 65 / 0.5))"
                    : isDone
                      ? "oklch(0.3 0.08 165 / 0.4)"
                      : "oklch(0.22 0.04 180 / 0.5)",
                  boxShadow: isCurrent
                    ? "0 0 18px oklch(0.8 0.18 70 / 0.6)"
                    : isDone
                      ? "0 0 10px oklch(0.78 0.18 160 / 0.35)"
                      : "none",
                  color,
                }}
              >
                {w.icon}
              </div>
              <div
                className="mt-2 text-[12px] font-medium"
                style={{ color: isCurrent ? color : "var(--foreground)" }}
              >
                {w.label}
              </div>
              <div className="text-[10px] text-muted-foreground text-center mt-0.5 leading-tight">
                {w.status}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 rounded-md border border-[oklch(0.78_0.17_70_/_0.35)] bg-[oklch(0.3_0.08_65_/_0.2)] px-3 py-2">
        <div className="text-[12px] text-[oklch(0.88_0.16_70)] font-medium">
          当前步骤:处理中
        </div>
        <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
          请按流程执行处理操作并记录,完成后进入复核环节。
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- Bottom Command Bar ---------------- */

const statusModules = [
  {
    label: "正常",
    value: "62",
    icon: <ShieldCheck size={22} />,
    color: "oklch(0.85 0.2 160)",
  },
  {
    label: "预警",
    value: "6",
    icon: <AlertTriangle size={22} />,
    color: "oklch(0.85 0.18 70)",
  },
  {
    label: "报警",
    value: "0",
    icon: <Siren size={22} />,
    color: "oklch(0.78 0.22 25)",
  },
  {
    label: "离线",
    value: "0",
    icon: <WifiOff size={22} />,
    color: "oklch(0.6 0.04 175)",
  },
  {
    label: "在线点位",
    value: "68",
    icon: <Wifi size={22} />,
    color: "oklch(0.82 0.13 200)",
  },
];

const quickActions = ["三维巡检", "今日作业", "报警处置", "批次状态", "报告查看"];

function BottomCommandBar() {
  return (
    <footer
      className="relative h-[96px] rounded-xl border border-[oklch(0.6_0.16_160_/_0.5)] flex items-center px-6"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.18 0.04 180 / 0.95) 0%, oklch(0.10 0.025 188 / 0.98) 100%)",
        boxShadow:
          "0 -10px 40px oklch(0.6 0.16 160 / 0.22), inset 0 1px 0 oklch(0.85 0.18 160 / 0.22), inset 0 0 60px oklch(0.15 0.04 180 / 0.6)",
      }}
    >
      {/* top luminous edge */}
      <span
        className="pointer-events-none absolute top-0 left-6 right-6 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.85 0.2 160 / 0.7), transparent)",
        }}
      />
      <span className="absolute top-0 left-0 h-3 w-4 border-t-2 border-l-2 rounded-tl-xl border-[oklch(0.85_0.2_160)]" />
      <span className="absolute top-0 right-0 h-3 w-4 border-t-2 border-r-2 rounded-tr-xl border-[oklch(0.85_0.2_160)]" />
      <span className="absolute bottom-0 left-0 h-3 w-4 border-b-2 border-l-2 rounded-bl-xl border-[oklch(0.85_0.2_160)]" />
      <span className="absolute bottom-0 right-0 h-3 w-4 border-b-2 border-r-2 rounded-br-xl border-[oklch(0.85_0.2_160)]" />

      <div className="flex items-center gap-2.5 pr-5 mr-5 border-r border-[oklch(0.6_0.14_160_/_0.35)]">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inset-0 rounded-full bg-[oklch(0.85_0.2_160)] animate-ping opacity-60" />
          <span className="relative rounded-full h-2.5 w-2.5 bg-[oklch(0.85_0.2_160)]" />
        </span>
        <div className="leading-tight">
          <div className="text-[10px] tracking-[0.3em] text-muted-foreground">SYSTEM</div>
          <div
            className="text-[14px] font-semibold text-[oklch(0.85_0.2_160)] tracking-[0.2em] text-glow-green"
            style={{ fontFamily: "var(--font-display)" }}
          >
            NORMAL
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center">
        {statusModules.map((s, i) => (
          <div
            key={s.label}
            className={cn(
              "flex-1 flex items-center justify-center gap-3 px-2",
              i < statusModules.length - 1 &&
                "border-r border-[oklch(0.6_0.14_160_/_0.18)]",
            )}
          >
            <span style={{ color: s.color, filter: `drop-shadow(0 0 10px ${s.color})` }}>
              {s.icon}
            </span>
            <div className="leading-tight">
              <div className="text-[11px] text-muted-foreground tracking-[0.2em]">
                {s.label}
              </div>
              <div
                className="text-[26px] font-bold tabular-nums leading-none mt-0.5"
                style={{
                  color: s.color,
                  fontFamily: "var(--font-display)",
                  textShadow: `0 0 14px ${s.color}`,
                }}
              >
                {s.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pl-5 ml-5 border-l border-[oklch(0.6_0.14_160_/_0.35)]">
        {quickActions.map((a) => (
          <button
            key={a}
            className="rounded-md border border-[oklch(0.6_0.14_160_/_0.5)] px-3.5 py-2 text-[12px] text-foreground hover:bg-[oklch(0.78_0.18_160_/_0.14)] hover:border-[oklch(0.85_0.2_160)] hover:text-[oklch(0.9_0.18_160)] transition"
            style={{
              background:
                "linear-gradient(180deg, oklch(0.22 0.05 178 / 0.7), oklch(0.15 0.035 182 / 0.7))",
              boxShadow: "inset 0 1px 0 oklch(0.85 0.18 160 / 0.08)",
            }}
          >
            {a}
          </button>
        ))}
      </div>
    </footer>
  );
}

/* ---------------- Dashboard ---------------- */

function Dashboard() {
  return (
    <main className="min-h-screen w-full p-4 flex flex-col gap-3 overflow-hidden">
      <TopHeader />
      <div className="flex-1 grid grid-cols-[320px_1fr_340px] gap-3 min-h-0">
        <div className="flex flex-col gap-3 min-h-0">
          <TaskPanel />
          <EnvironmentPanel />
        </div>
        <DigitalTwinStage />
        <div className="flex flex-col gap-3 min-h-0">
          <RiskPanel />
          <WorkflowPanel />
        </div>
      </div>
      <BottomCommandBar />
    </main>
  );
}
