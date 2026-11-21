import { Boxes, MessagesSquare, PackageCheck, RefreshCw, Truck, Warehouse, type LucideIcon } from "lucide-react";

export type TopicId = "storage" | "transit" | "loading" | "transfer" | "godown" | "general";

export type Topic = { id: TopicId; name: string; short: string; detail: string; icon: LucideIcon; starters: string[] };

export const TOPICS: Topic[] = [
  { id: "storage", name: "Short-Term Storage", short: "1–7 days", detail: "Park cargo between pickup, delivery and onward dispatch.", icon: PackageCheck,
    starters: ["I need space for 3 days", "How much space is available?", "What are the rates?"] },
  { id: "transit", name: "Transit Cargo", short: "Hold en route", detail: "Hold goods in Neemrana while the next leg is arranged.", icon: Boxes,
    starters: ["My load arrives tomorrow", "Where exactly is the warehouse?", "Is the site secure?"] },
  { id: "loading", name: "Loading & Unloading", short: "Cargo handling", detail: "Handling at the bay with a pallet jack and drum trolley.", icon: Truck,
    starters: ["What handling equipment do you have?", "Can you unload drums?", "What are the rates?"] },
  { id: "transfer", name: "Truck-to-Truck Transfer", short: "Direct transfer", detail: "Move cargo straight from one truck to another on site.", icon: RefreshCw,
    starters: ["I need a truck-to-truck transfer", "Is there space for two trucks?", "Where exactly is the warehouse?"] },
  { id: "godown", name: "Temporary Godown", short: "Short stop", detail: "Short-term godown space when your operation needs a pause.", icon: Warehouse,
    starters: ["How big is the godown?", "What are the timings?", "Is the site secure?"] },
  { id: "general", name: "General Questions", short: "Anything else", detail: "Directions, availability or anything else about the facility.", icon: MessagesSquare,
    starters: ["Where exactly is the warehouse?", "What are the timings?", "I want to talk to the team"] },
];

export const topicById = (id: string | undefined): Topic => TOPICS.find((topic) => topic.id === id) ?? TOPICS[TOPICS.length - 1];
