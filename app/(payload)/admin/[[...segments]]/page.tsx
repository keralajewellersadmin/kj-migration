import { redirect } from "next/navigation";
import { ADMIN_PATH } from "@/lib/admin-path";

type Args = {
  params: Promise<{ segments?: string[] }>;
};

const Page = async ({ params }: Args) => {
  const { segments } = await params;
  const suffix = segments?.length ? `/${segments.join("/")}` : "";
  redirect(`${ADMIN_PATH}${suffix}`);
};

export default Page;
