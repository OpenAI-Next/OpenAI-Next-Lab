import { BASE_URL_B, CommonApiTypes } from "@/app/providers/interfaces";

export interface ApiRequestConfig {
  endpoint: string;
  options: RequestInit & {
    method: RequestInit["method"];
    headers: RequestInit["headers"];
  };
  returnType?: keyof Pick<Response, "json" | "text" | "blob" | "arrayBuffer">;
}

export const makeApiRequest = async (config: ApiRequestConfig) => {
  const res = await fetch([BASE_URL_B, config.endpoint].join("/"), {
    ...config.options,
  });
  const data = await res[config.returnType || "json"]();
  console.log(`[Fetch Response] ${config.endpoint}`, data);
  return data;
};

/**
 * 替换 endpoint 中的参数, 例如 /api/v1/user/{id} => /api/v1/user/123
 * @param params - endpoint 参数，例如 { id: "123", name: "test" }
 * @param endpoint - 带有参数的 endpoint，例如 /api/v1/user/{id}
 * @returns 替换后的 endpoint
 * @example replaceEndpointParams({ id: "123" }, "/api/v1/user/{id}") => "/api/v1/user/123"
 */
export const replaceEndpointParams = (
  params: CommonApiTypes["endpoint_params"],
  endpoint: string,
): string => {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(`{${key}}`, value),
    endpoint,
  );
};
