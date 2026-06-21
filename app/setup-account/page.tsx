import { SetupAccountForm } from "@/components/admin/SetupAccountForm";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: { code?: string };
}

export default function SetupAccountPage({ searchParams }: PageProps) {
  const code = searchParams.code?.trim() ?? null;

  if (!code) {
    redirect("/login?error=invalid-invite");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <SetupAccountForm inviteCode={code} />
      </div>
    </main>
  );
}