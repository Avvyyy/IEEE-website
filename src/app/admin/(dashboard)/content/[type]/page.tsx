import { notFound } from "next/navigation";
import { ADMIN_SECTIONS } from "@/lib/admin-sections";
import { getRawContent } from "@/lib/content";
import { ContentEditorClient } from "@/components/admin/ContentEditorClient";
import type { JsonValue } from "@/components/admin/JsonEditor";

export const dynamic = "force-dynamic";

export default async function AdminContentTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const section = ADMIN_SECTIONS.find((s) => s.type === type);
  if (!section) notFound();

  const data = (await getRawContent(type)) as JsonValue;

  return <ContentEditorClient type={type} label={section.label} initialData={data} />;
}
