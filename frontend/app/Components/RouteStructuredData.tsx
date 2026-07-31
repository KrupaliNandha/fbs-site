import Script from "next/script";
import {
  getGlobalSchemas,
  getRouteSchemas,
  type PublicPagePath,
} from "@/app/lib/seo";
import { getRequestBaseUrl } from "@/app/lib/request-url";

function schemaId(prefix: string, index: number) {
  return `${prefix}-${index}`;
}

export async function GlobalStructuredData() {
  const baseUrl = await getRequestBaseUrl();
  const schemas = getGlobalSchemas(baseUrl);

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={schemaId("global-schema", index)}
          id={schemaId("global-schema", index)}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </Script>
      ))}
    </>
  );
}

export async function RouteStructuredData({ path }: { path: PublicPagePath }) {
  const baseUrl = await getRequestBaseUrl();
  const schemas = getRouteSchemas(path, baseUrl);
  const prefix = `route-schema-${path.replace(/\W+/g, "-") || "home"}`;

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={schemaId(prefix, index)}
          id={schemaId(prefix, index)}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </Script>
      ))}
    </>
  );
}
