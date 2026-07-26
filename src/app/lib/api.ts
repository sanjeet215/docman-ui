export type MultipartJsonPostOptions = {
  baseUrl?: string;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

// Posts multipart/form-data with repeated files field and one JSON part
export async function postMultipartWithJson(
  endpoint: string,
  filesFieldName: string,
  files: File[],
  jsonFieldName: string,
  json: unknown,
  options: MultipartJsonPostOptions = {}
): Promise<Response> {
  const base = options.baseUrl || process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const url = `${base.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const form = new FormData();
  files.forEach((file) => form.append(filesFieldName, file, file.name));
  form.append(
    jsonFieldName,
    new Blob([JSON.stringify(json)], { type: "application/json" })
  );

  const res = await fetch(url, {
    method: "POST",
    body: form,
    // Don't set Content-Type; browser sets correct multipart boundary
    headers: options.headers,
    signal: options.signal,
  });
  return res;
}
