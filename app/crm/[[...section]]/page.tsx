import { CrmApp } from "@/components/crm/crm-app";
export default async function CrmPage({
  params,
}: {
  params: Promise<{ section?: string[] }>;
}) {
  const { section } = await params;
  return <CrmApp section={section?.[0] ?? "overview"} />;
}
