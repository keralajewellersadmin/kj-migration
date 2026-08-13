/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from "next";
import config from "@payload-config";
import { importMap } from "../importMap";
import { RootPage, generatePageMetadata } from "@payloadcms/next/views";
import CustomLogin from "@/components/admin/CustomLogin";

type Args = {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] }>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: Args): Promise<Metadata> => {
  const { segments } = await params;
  if (segments?.[0] === "login") {
    return {
      title: "Login - Payload",
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

  return RootPage({ config, importMap, params, searchParams });
};

export default Page;
