
import { BeamOptions } from "./collision-mechanism";

export interface BeamTheme {
  bgFrom: string;
  bgTo: string;
  beamColor: string;
  explosionColors: string[];
}

export const beamThemes: Record<string, BeamTheme> = {
  default: {
    bgFrom: "from-white",
    bgTo: "to-neutral-100",
    beamColor: "from-indigo-500 via-purple-500 to-transparent",
    explosionColors: ["from-indigo-500 to-purple-500"],
  },
  purple: {
    bgFrom: "from-purple-50",
    bgTo: "to-purple-100",
    beamColor: "from-purple-600 via-purple-400 to-transparent",
    explosionColors: ["from-purple-600 to-purple-400"],
  },
  blue: {
    bgFrom: "from-blue-50",
    bgTo: "to-blue-100",
    beamColor: "from-blue-600 via-blue-400 to-transparent",
    explosionColors: ["from-blue-600 to-blue-400"],
  },
  green: {
    bgFrom: "from-green-50",
    bgTo: "to-green-100",
    beamColor: "from-green-600 via-green-400 to-transparent",
    explosionColors: ["from-green-600 to-green-400"],
  },
  amber: {
    bgFrom: "from-amber-50",
    bgTo: "to-amber-100",
    beamColor: "from-amber-600 via-amber-400 to-transparent",
    explosionColors: ["from-amber-600 to-amber-400"],
  },
  gradient: {
    bgFrom: "from-purple-50",
    bgTo: "to-pink-100",
    beamColor: "from-purple-600 via-pink-500 to-transparent",
    explosionColors: ["from-purple-600 to-pink-500", "from-pink-500 to-purple-600"],
  },
};

export const defaultBeams: BeamOptions[] = [
  {
    initialX: 10,
    translateX: 10,
    duration: 7,
    repeatDelay: 3,
    delay: 2,
  },
  {
    initialX: 600,
    translateX: 600,
    duration: 3,
    repeatDelay: 3,
    delay: 4,
  },
  {
    initialX: 100,
    translateX: 100,
    duration: 7,
    repeatDelay: 7,
    className: "h-6",
  },
  {
    initialX: 400,
    translateX: 400,
    duration: 5,
    repeatDelay: 14,
    delay: 4,
  },
  {
    initialX: 800,
    translateX: 800,
    duration: 11,
    repeatDelay: 2,
    className: "h-20",
  },
  {
    initialX: 1000,
    translateX: 1000,
    duration: 4,
    repeatDelay: 2,
    className: "h-12",
  },
  {
    initialX: 1200,
    translateX: 1200,
    duration: 6,
    repeatDelay: 4,
    delay: 2,
    className: "h-6",
  },
];

export const createFastBeams = (): BeamOptions[] => 
  defaultBeams.map(beam => ({
    ...beam,
    duration: beam.duration ? beam.duration * 0.5 : 4,
    repeatDelay: beam.repeatDelay ? beam.repeatDelay * 0.5 : 1,
  }));

export const createSlowBeams = (): BeamOptions[] => 
  defaultBeams.map(beam => ({
    ...beam,
    duration: beam.duration ? beam.duration * 1.5 : 10,
    repeatDelay: beam.repeatDelay ? beam.repeatDelay * 1.5 : 5,
  }));

export const createDenseBeams = (): BeamOptions[] => [
  ...defaultBeams,
  {
    initialX: 300,
    translateX: 300,
    duration: 5,
    repeatDelay: 2,
    className: "h-8",
  },
  {
    initialX: 500,
    translateX: 500,
    duration: 6,
    repeatDelay: 3,
    className: "h-10",
  },
  {
    initialX: 700,
    translateX: 700,
    duration: 7,
    repeatDelay: 4,
    className: "h-5",
  },
  {
    initialX: 900,
    translateX: 900,
    duration: 8,
    repeatDelay: 5,
    className: "h-7",
  },
];
