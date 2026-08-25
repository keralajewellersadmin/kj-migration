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

function cleanTitle(title: any): any {
  if (typeof title === "string") {
    return title.replace(/\s*-\s*Payload/i, " - Kerala Jewellers Admin").replace(/Payload/i, "Kerala Jewellers Admin");
  }
  if (title && typeof title === "object") {
    const copy = { ...title };
    if (typeof copy.absolute === "string") {
      copy.absolute = copy.absolute.replace(/\s*-\s*Payload/i, " - Kerala Jewellers Admin").replace(/Payload/i, "Kerala Jewellers Admin");
    }
    if (typeof copy.default === "string") {
      copy.default = copy.default.replace(/\s*-\s*Payload/i, " - Kerala Jewellers Admin").replace(/Payload/i, "Kerala Jewellers Admin");
    }
    if (typeof copy.template === "string") {
      copy.template = copy.template.replace(/\s*-\s*Payload/i, " - Kerala Jewellers Admin").replace(/Payload/i, "Kerala Jewellers Admin");
    }
    return copy;
  }
  return title;
}

export const generateMetadata = async ({
  params,
  searchParams,
}: Args): Promise<Metadata> => {
  const { segments } = await params;
  if (segments?.[0] === "login" || segments?.[0] === "setup-account") {
    return {
      title: segments?.[0] === "login" ? "Login - Kerala Jewellers Admin" : "Setup Account - Kerala Jewellers Admin",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseMeta = await generatePageMetadata({ config, params, searchParams });
  if (baseMeta) {
    baseMeta.title = cleanTitle(baseMeta.title);
  }
  return baseMeta;
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
