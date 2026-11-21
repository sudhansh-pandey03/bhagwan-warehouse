import type { Metadata } from "next";
import { FacilitiesHub } from "./_components/facilities-hub";

export const metadata: Metadata = {
  title: "Facilities Handling",
  description: "Service Partner workspace for Bhagwan Warehousing & Dispatch, Neemrana.",
  robots: { index: false, follow: false },
};

export default function FacilitiesHandlingPage() {
  return <FacilitiesHub />;
}
