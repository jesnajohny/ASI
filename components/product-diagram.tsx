"use client";

import {
  Briefcase,
  FileText,
  GanttChartSquare,
  Mic,
  Pen,
  Send,
  Sprout,
  Target,
  Bot,
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Award,
  Clock,
  UserPlus,
  BarChart3,
  Mail,
  Phone,
  Brain,
} from "lucide-react";
import React, { forwardRef, useRef } from "react";
import { motion } from "motion/react";

// Utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(' ');

// AnimatedBeam Component (using the proper implementation from your files)
export interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  active?: boolean;
  duration?: number;
  delay?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  active = false,
  duration = 2,
  delay = 0,
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) => {
  const id = `beam-${Math.random().toString(36).substr(2, 9)}`;
  const [pathD, setPathD] = React.useState("");
  const [svgDimensions, setSvgDimensions] = React.useState({ width: 0, height: 0 });

  const gradientCoordinates = reverse
    ? {
        x1: ["90%", "-10%"],
        x2: ["100%", "0%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      }
    : {
        x1: ["10%", "110%"],
        x2: ["0%", "100%"],
        y1: ["0%", "0%"],
        y2: ["0%", "0%"],
      };

  React.useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rectA = fromRef.current.getBoundingClientRect();
        const rectB = toRef.current.getBoundingClientRect();

        const svgWidth = containerRect.width;
        const svgHeight = containerRect.height;
        setSvgDimensions({ width: svgWidth, height: svgHeight });

        const startX =
          rectA.left - containerRect.left + rectA.width / 2 + startXOffset;
        const startY =
          rectA.top - containerRect.top + rectA.height / 2 + startYOffset;
        const endX =
          rectB.left - containerRect.left + rectB.width / 2 + endXOffset;
        const endY =
          rectB.top - containerRect.top + rectB.height / 2 + endYOffset;

        const controlY = startY - curvature;
        const d = `M ${startX},${startY} Q ${
          (startX + endX) / 2
        },${controlY} ${endX},${endY}`;
        setPathD(d);
      }
    };

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        updatePath();
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    updatePath();

    return () => {
      resizeObserver.disconnect();
    };
  }, [
    containerRef,
    fromRef,
    toRef,
    curvature,
    startXOffset,
    startYOffset,
    endXOffset,
    endYOffset,
  ]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "pointer-events-none absolute left-0 top-0 transform-gpu stroke-2",
        className,
      )}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />
      {active && (
        <path
          d={pathD}
          strokeWidth={pathWidth}
          stroke={`url(#${id})`}
          strokeOpacity="1"
          strokeLinecap="round"
        />
      )}
      <defs>
        {active && (
          <motion.linearGradient
            className="transform-gpu"
            id={id}
            gradientUnits={"userSpaceOnUse"}
            animate={{
              x1: gradientCoordinates.x1,
              x2: gradientCoordinates.x2,
              y1: gradientCoordinates.y1,
              y2: gradientCoordinates.y2,
            }}
            transition={{
              delay,
              duration,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
            <stop stopColor={gradientStartColor}></stop>
            <stop offset="32.5%" stopColor={gradientStopColor}></stop>
            <stop
              offset="100%"
              stopColor={gradientStopColor}
              stopOpacity="0"
            ></stop>
          </motion.linearGradient>
        )}
      </defs>
    </svg>
  );
};

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {children}
    </div>
  );
});
Circle.displayName = "Circle";

const Destination = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; text: string }
>(({ className, children, text }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex flex-col items-center gap-2",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]">
          {children}
      </div>
      <p className="text-sm text-center max-w-20">{text}</p>
    </div>
  );
});
Destination.displayName = "Destination";

const AICircle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode; text: string }
>(({ className, children, text }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex flex-col items-center gap-2",
        className,
      )}
    >
      <div className="flex size-20 items-center justify-center rounded-full border-2 bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-[0_0_30px_-5px_rgba(147,51,234,0.3)]">
          {children}
      </div>
      <p className="text-sm text-center font-semibold max-w-24">{text}</p>
    </div>
  );
});
AICircle.displayName = "AICircle";

export function ProductDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const googleDriveRef = useRef<HTMLDivElement>(null);
  const notionRef = useRef<HTMLDivElement>(null);
  const figmaRef = useRef<HTMLDivElement>(null);
  const microsoftRef = useRef<HTMLDivElement>(null);
  const slackRef = useRef<HTMLDivElement>(null);
  const confluenceRef = useRef<HTMLDivElement>(null);
  const centerHubRef = useRef<HTMLDivElement>(null);
  const askHRRef = useRef<HTMLDivElement>(null);
  const hiringOpsRef = useRef<HTMLDivElement>(null);
  const reviewPrepRef = useRef<HTMLDivElement>(null);
  const onboardingBuddyRef = useRef<HTMLDivElement>(null);
  
  // AI HR Employee Hub
  const aiHREmployeeRef = useRef<HTMLDivElement>(null);
  
  // AI Operations
  const performanceAnalyticsRef = useRef<HTMLDivElement>(null);
  const talentAcquisitionRef = useRef<HTMLDivElement>(null);
  const employeeEngagementRef = useRef<HTMLDivElement>(null);
  const complianceMonitoringRef = useRef<HTMLDivElement>(null);
  const workforceInsightsRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-7xl items-center justify-center overflow-hidden rounded-lg border bg-background p-10"
      ref={containerRef}
    >
      <div className="flex size-full h-[600px] flex-row items-center justify-between gap-6">
        {/* Left Column - Integrations */}
        <div className="flex h-full flex-col justify-between">
          <Circle ref={googleDriveRef}>
            <Icons.googleDrive />
          </Circle>
          <Circle ref={notionRef}>
            <Icons.notion />
          </Circle>
          <Circle ref={figmaRef}>
            <GanttChartSquare className="text-black" />
          </Circle>
          <Circle ref={microsoftRef}>
            <Icons.microsoft />
          </Circle>
          <Circle ref={slackRef}>
            <Icons.slack />
          </Circle>
           <Circle ref={confluenceRef}>
            <Icons.confluence />
          </Circle>
        </div>

        {/* Center Hub */}
        <div className="flex h-full items-center justify-center">
            <Circle ref={centerHubRef} className="size-24 border-neutral-300">
                <Icons.centralHub />
            </Circle>
        </div>

        {/* Operations Layer */}
        <div className="flex h-full flex-col justify-between" style={{height: "70%"}}>
           <Destination ref={askHRRef} text="AskHR">
             <Target className="text-neutral-500" />
           </Destination>
           <Destination ref={hiringOpsRef} text="Hiring Ops">
             <Briefcase className="text-neutral-500" />
           </Destination>
           <Destination ref={reviewPrepRef} text="Employee Reviews">
             <Pen className="text-neutral-500" />
           </Destination>
           <Destination ref={onboardingBuddyRef} text="Employee Onboarding">
            <Sprout className="text-neutral-500" />
           </Destination>
        </div>

        {/* AI HR Employee Hub */}
        <div className="flex h-full items-center justify-center">
            <AICircle ref={aiHREmployeeRef} text="AI HR Employee">
                <Bot className="size-8" />
            </AICircle>
        </div>

        {/* AI Operations - Right Column */}
        <div className="flex h-full flex-col justify-between" style={{height: "85%"}}>
           <Destination ref={performanceAnalyticsRef} text="Performance Analytics">
             <BarChart3 className="text-blue-600" />
           </Destination>
           <Destination ref={talentAcquisitionRef} text="Talent Acquisition">
             <UserPlus className="text-green-600" />
           </Destination>
           <Destination ref={employeeEngagementRef} text="Employee Engagement">
             <MessageSquare className="text-purple-600" />
           </Destination>
           <Destination ref={complianceMonitoringRef} text="Compliance Monitoring">
             <Award className="text-orange-600" />
           </Destination>
           <Destination ref={workforceInsightsRef} text="Workforce Insights">
             <Brain className="text-indigo-600" />
           </Destination>
        </div>
      </div>

      {/* Beams from left integrations to center */}
      <AnimatedBeam containerRef={containerRef} fromRef={googleDriveRef} toRef={centerHubRef} curvature={-40} endXOffset={-10} active={true} duration={3} delay={0.5} />
      <AnimatedBeam containerRef={containerRef} fromRef={notionRef} toRef={centerHubRef} curvature={-20} endXOffset={-10} active={true} duration={3} delay={0.7} />
      <AnimatedBeam containerRef={containerRef} fromRef={figmaRef} toRef={centerHubRef} curvature={-10} endXOffset={-10} active={true} duration={3} delay={0.9} />
      <AnimatedBeam containerRef={containerRef} fromRef={microsoftRef} toRef={centerHubRef} curvature={10} endXOffset={-10} active={true} duration={3} delay={1.1} />
      <AnimatedBeam containerRef={containerRef} fromRef={slackRef} toRef={centerHubRef} curvature={20} endXOffset={-10} active={true} duration={3} delay={1.3} />
      <AnimatedBeam containerRef={containerRef} fromRef={confluenceRef} toRef={centerHubRef} curvature={40} endXOffset={-10} active={true} duration={3} delay={1.5} />
      
      {/* Beams from center to operations */}
      <AnimatedBeam containerRef={containerRef} fromRef={centerHubRef} toRef={askHRRef} startXOffset={10} curvature={-20} active={true} duration={3} delay={0.8} />
      <AnimatedBeam containerRef={containerRef} fromRef={centerHubRef} toRef={hiringOpsRef} startXOffset={10} curvature={-10} active={true} duration={3} delay={1.0} />
      <AnimatedBeam containerRef={containerRef} fromRef={centerHubRef} toRef={reviewPrepRef} startXOffset={10} curvature={10} active={true} duration={3} delay={1.2} />
      <AnimatedBeam containerRef={containerRef} fromRef={centerHubRef} toRef={onboardingBuddyRef} startXOffset={10} curvature={20} active={true} duration={3} delay={1.4} />

      {/* Beams from operations to AI HR Employee */}
      <AnimatedBeam containerRef={containerRef} fromRef={askHRRef} toRef={aiHREmployeeRef} startXOffset={10} endXOffset={-15} curvature={-15} active={true} duration={3} delay={1.6} />
      <AnimatedBeam containerRef={containerRef} fromRef={hiringOpsRef} toRef={aiHREmployeeRef} startXOffset={10} endXOffset={-15} curvature={-5} active={true} duration={3} delay={1.8} />
      <AnimatedBeam containerRef={containerRef} fromRef={reviewPrepRef} toRef={aiHREmployeeRef} startXOffset={10} endXOffset={-15} curvature={5} active={true} duration={3} delay={2.0} />
      <AnimatedBeam containerRef={containerRef} fromRef={onboardingBuddyRef} toRef={aiHREmployeeRef} startXOffset={10} endXOffset={-15} curvature={15} active={true} duration={3} delay={2.2} />

      {/* Beams from AI HR Employee to AI Operations */}
      <AnimatedBeam containerRef={containerRef} fromRef={aiHREmployeeRef} toRef={performanceAnalyticsRef} startXOffset={15} curvature={-25} active={true} duration={3} delay={2.4} gradientStartColor="#8b5cf6" gradientStopColor="#06b6d4" />
      <AnimatedBeam containerRef={containerRef} fromRef={aiHREmployeeRef} toRef={talentAcquisitionRef} startXOffset={15} curvature={-12} active={true} duration={3} delay={2.6} gradientStartColor="#8b5cf6" gradientStopColor="#10b981" />
      <AnimatedBeam containerRef={containerRef} fromRef={aiHREmployeeRef} toRef={employeeEngagementRef} startXOffset={15} curvature={0} active={true} duration={3} delay={2.8} gradientStartColor="#8b5cf6" gradientStopColor="#a855f7" />
      <AnimatedBeam containerRef={containerRef} fromRef={aiHREmployeeRef} toRef={complianceMonitoringRef} startXOffset={15} curvature={12} active={true} duration={3} delay={3.0} gradientStartColor="#8b5cf6" gradientStopColor="#f97316" />
      <AnimatedBeam containerRef={containerRef} fromRef={aiHREmployeeRef} toRef={workforceInsightsRef} startXOffset={15} curvature={25} active={true} duration={3} delay={3.2} gradientStartColor="#8b5cf6" gradientStopColor="#6366f1" />

    </div>
  );
}

const Icons = {
  googleDrive: () => (
    <svg width="20" height="20" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  ),
  notion: () => (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" fill="#ffffff" />
      <path d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="#000000" fillRule="evenodd" clipRule="evenodd" />
    </svg>
  ),
  microsoft: () => (
    <svg width="20" height="20" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
        <path d="M1,1H10V10H1V1Z" fill="#f25022"/>
        <path d="M11,1H20V10H11V1Z" fill="#7fba00"/>
        <path d="M1,11H10V20H1V11Z" fill="#00a4ef"/>
        <path d="M11,11H20V20H11V11Z" fill="#ffb900"/>
    </svg>
  ),
  slack: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.042 15.16a2.08 2.08 0 0 1-2.08-2.083v-2.08A2.08 2.08 0 0 1 5.043 8.92h2.08v2.08H5.042v2.08z" fill="#36C5F0"/>
        <path d="M8.917 15.16a2.08 2.08 0 0 1 2.083-2.08h6.244a2.08 2.08 0 1 1 0 4.16H11a2.08 2.08 0 0 1-2.083-2.08z" fill="#2EB67D"/>
        <path d="M8.92 5.042a2.08 2.08 0 0 1 2.08-2.083h2.08A2.08 2.08 0 0 1 15.16 5.04v2.08H13.08v-2.08H11a2.08 2.08 0 0 1-2.08-2.08z" fill="#ECB22E"/>
        <path d="M8.92 8.917a2.08 2.08 0 0 1 2.08-2.083h2.08v6.244a2.08 2.08 0 1 1-4.16 0V8.917z" fill="#E01E5A"/>
    </svg>
  ),
  confluence: () => (
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM8.035 8.912C8.035 8.912 9.932 5.144 12.001 5.144C14.069 5.144 15.965 8.912 15.965 8.912L12.001 16.857L8.035 8.912Z" fill="#2684FF"/>
    </svg>
  ),
  centralHub: () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.1537 12.1121L27.8878 18.8462C28.4901 19.4485 28.4901 20.5515 27.8878 21.1538L21.1537 27.8879C19.949 29.0926 18.0509 29.0926 16.8462 27.8879L12.1121 23.1538V16.8462L16.8462 12.1121C18.0509 10.9074 19.949 10.9074 21.1537 12.1121Z" stroke="#F56565" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.8462 27.8879L12.1121 21.1538C11.5098 20.5515 11.5098 19.4485 12.1121 18.8462L18.8462 12.1121C20.0509 10.9074 21.949 10.9074 23.1537 12.1121L27.8878 16.8462V23.1538L23.1537 27.8879C21.949 29.0926 20.0509 29.0926 18.8462 27.8879Z" stroke="#F56565" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};