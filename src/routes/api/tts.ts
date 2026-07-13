import { createFileRoute } from "@tanstack/react-router";

// Streams a female TTS audio for the welcome intro via Lovable AI Gateway.
export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }
        let body: { text?: string } = {};
        try {
          body = (await request.json()) as { text?: string };
        } catch {
          // fall through
        }
        const text =
          typeof body.text === "string" && body.text.trim().length > 0
            ? body.text.slice(0, 2000)
            : "Hello, I'm Rohini. Welcome to my portfolio.";

        const upstream = await fetch(
          "https://ai.gateway.lovable.dev/v1/audio/speech",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: text,
              // Professional & clear female voice
              voice: "nova",
              response_format: "mp3",
              instructions:
                "Speak in a warm, professional and clear female voice. Confident, welcoming and articulate — like a polished portfolio narrator. Natural pacing.",
            }),
          },
        );

        if (!upstream.ok) {
          const errText = await upstream.text().catch(() => "");
          return new Response(errText || "TTS failed", {
            status: upstream.status,
          });
        }

        return new Response(upstream.body, {
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
