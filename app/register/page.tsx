import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Create account", description: "Create a Service Partner account with Bhagwan Warehousing & Dispatch.", robots: { index: false, follow: false } };

export default function RegisterPage() {
  return <RegisterForm />;
}
