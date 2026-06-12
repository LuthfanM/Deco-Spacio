async function readApiResponse<T = unknown>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  const plainText = text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    __nonJsonResponse: true,
    error_message:
      plainText ||
      `Expected JSON response but received ${contentType || "unknown content"}.`,
  } as T;
}

export { readApiResponse };
