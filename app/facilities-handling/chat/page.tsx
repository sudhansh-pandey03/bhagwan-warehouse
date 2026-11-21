import { Suspense } from "react";
import type { Metadata } from "next";
import { FacilityChat } from "../_components/facility-chat";
import "../_components/facilities.css";

export const metadata: Metadata = {
  title: "Partner Chat",
  description: "Chat with the Bhagwan Warehousing dispatch desk.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

/** Reads ?topic= at request time; with Cache Components this must sit inside <Suspense>. */
async function ChatWithTopic({ searchParams }: { searchParams: SearchParams }) {
  const { topic } = await searchParams;
  return <FacilityChat topicId={typeof topic === "string" ? topic : undefined} />;
}

export default function FacilityChatPage({ searchParams }: { searchParams: SearchParams }) {
  return <Suspense fallback={<div className="fh-shell fh-shell-chat" aria-busy="true" />}>
    <ChatWithTopic searchParams={searchParams} />
  </Suspense>;
}
