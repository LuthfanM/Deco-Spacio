async function readApiResponse<T = unknown>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  throw new Error(`Expected JSON response but received ${contentType || "unknown content"}`);
}

export { readApiResponse };
