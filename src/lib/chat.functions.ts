import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { NAIJA_SYSTEM_PROMPT } from "@/lib/naija";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
  scheduleContext: z.string().max(2000).optional(),
});

export const sendChat = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const system = data.scheduleContext
      ? `${NAIJA_SYSTEM_PROMPT}\n\nUSER'S CURRENT SCHEDULE CONTEXT:\n${data.scheduleContext}`
      : NAIJA_SYSTEM_PROMPT;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: system }, ...data.messages],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("Slow down small — too many requests. Try again in a moment.");
      if (res.status === 402) throw new Error("AI credits don finish o. Top up for workspace settings.");
      const t = await res.text();
      console.error("AI gateway error:", res.status, t);
      throw new Error("AI no respond well. Try again abeg.");
    }
    const j = await res.json();
    const reply: string = j.choices?.[0]?.message?.content ?? "Hmm, I no get word for this one. Try again?";
    return { reply };
  });
