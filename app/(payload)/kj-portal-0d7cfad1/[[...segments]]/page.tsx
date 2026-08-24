import type { Metadata } from "next";
import config from "@payload-config";
import { importMap } from "../../admin/importMap";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import { redirect } from "next/navigation";
import CustomLogin from "@/components/admin/login/CustomLogin";
import { ADMIN_PATH } from "@/lib/admin-path";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: Args): Promise<Metadata> => {
  const { segments } = await params;
  if (segments?.[0] === "login" || segments?.[0] === "setup-account") {
    return {
      title: segments?.[0] === "login" ? "Login - Payload" : "Setup Account - Payload",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return generatePageMetadata({ config, params, searchParams });
};

const Page = async ({ params, searchParams }: Args) => {
  const { segments } = await params;
  if (segments?.[0] === "login") return <CustomLogin />;
  if (segments?.[0] === "site-settings") {
    redirect(`${ADMIN_PATH}/globals/site-settings`);
  }

  return RootPage({ config, importMap, params, searchParams });
};

export default Page;
