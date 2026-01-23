const MAIN_API_URL = process.env.EXPO_PUBLIC_BASE_API_URL;

export async function getContractPosts() {
  const res = await fetch(`${MAIN_API_URL}/api/contract-posts`);

  if (!res.ok) {
    const text = await res.text();
    console.log("ERROR:", text);
    throw new Error("fetch failed");
  }

  return res.json();
}

export async function getContractPostById(id: string) {
  const res = await fetch(`${MAIN_API_URL}/api/contract-posts/${id}`);
  if (!res.ok) throw new Error("fetch failed");
  return res.json();
}