import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { defaultPortfolio, mergePortfolio, type PortfolioData } from "@/lib/portfolio-content";

const BUCKET = "portfolio-images";

/** Returns a signed URL for a stored image path (1 year expiry). */
export async function getImageUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365);
  if (error) return null;
  return data.signedUrl;
}

export async function fetchPortfolio(): Promise<PortfolioData> {
  const { data } = await supabase.from("portfolio_content").select("data").eq("id", "main").maybeSingle();
  return mergePortfolio(data?.data);
}

export async function savePortfolio(next: PortfolioData): Promise<void> {
  const { error } = await supabase
    .from("portfolio_content")
    .upsert({ id: "main", data: JSON.parse(JSON.stringify(next)) });
  if (error) throw error;
}

export async function uploadPortfolioImage(file: File, subdir = "misc"): Promise<string> {
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${subdir}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

/** Fetches the portfolio content once, exposes it to components. */
export function usePortfolio() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolio);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    fetchPortfolio()
      .then((d) => { if (alive) setData(d); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  return { data, loading, setData };
}

/** Resolves a batch of image paths to signed URLs. */
export function useImageUrls(paths: Array<string | null | undefined>) {
  const [urls, setUrls] = useState<Record<string, string>>({});
  useEffect(() => {
    let alive = true;
    const wanted = paths.filter(Boolean) as string[];
    if (wanted.length === 0) { setUrls({}); return; }
    Promise.all(wanted.map(async (p) => [p, await getImageUrl(p)] as const)).then((pairs) => {
      if (!alive) return;
      const next: Record<string, string> = {};
      for (const [p, u] of pairs) if (u) next[p] = u;
      setUrls(next);
    });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths.join("|")]);
  return urls;
}

/** Simple auth + admin-role hook. */
export function useAdmin() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user.id ?? null;
      if (!alive) return;
      setUserId(uid);
      if (uid) {
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", uid);
        if (!alive) return;
        setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, []);

  return { userId, isAdmin, loading };
}
