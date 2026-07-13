import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { HeartPulse, LogIn, UserPlus, Loader2 } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({ next: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  component: AuthPage,
  head: () => ({
    meta: [
      { title: "Admin Sign In · Rohini" },
      { name: "description", content: "Sign in to manage the portfolio content." },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: (search.next as string) || "/admin" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, search.next]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/admin" },
        });
        if (error) throw error;
        toast.success("Account created — you're signed in.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-hero-gradient p-6">
      <Link to="/" className="absolute left-6 top-6 text-xs font-semibold text-[color:var(--color-violet-deep)]">← Back to site</Link>
      <div className="w-full max-w-md rounded-3xl glass-strong p-8 shadow-glow-violet">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-[color:var(--color-violet)] to-[color:var(--color-coral)] text-white">
            <HeartPulse className="size-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold">Portfolio Admin</h1>
            <p className="text-xs text-muted-foreground">{mode === "signin" ? "Sign in to edit your content." : "Create the admin account. First signup becomes owner."}</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <label className="text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm outline-none focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">Password</span>
            <input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-border bg-white/80 px-4 py-3 text-sm outline-none focus:border-[color:var(--color-violet)] focus:ring-2 focus:ring-[color:var(--color-violet)]/25" />
          </label>
          <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-violet)] px-5 py-3 text-sm font-semibold text-white shadow-glow-violet transition hover:scale-[1.02] disabled:opacity-60">
            {busy ? <Loader2 className="size-4 animate-spin" /> : mode === "signin" ? <LogIn className="size-4" /> : <UserPlus className="size-4" />}
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="mt-4 w-full text-center text-xs font-semibold text-[color:var(--color-violet-deep)]">
          {mode === "signin" ? "First time here? Create the admin account →" : "Already have an account? Sign in →"}
        </button>
      </div>
    </div>
  );
}
