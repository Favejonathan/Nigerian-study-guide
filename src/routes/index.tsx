import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
        <p className="mb-4 inline-block rounded-full border border-border bg-card px-4 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Naija Study Buddy
        </p>
        <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">
          <span className="text-primary">StudyPikin</span> — your study guide
          wey sabi book pass you.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Tell am your classes and study times. E go remind you when time
          reach ("Time don reach ooo!") and hail you when you done
          ("Well done, your papa sabi who he send come school").
        </p>
        <div className="mt-10 flex justify-center gap-3">
          {signedIn ? (
            <Button asChild size="lg">
              <Link to="/app">Open app</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link to="/auth">Start free</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/auth">I get account</Link>
              </Button>
            </>
          )}
        </div>

        <div className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          {[
            { t: "Plan am", d: "Add your classes and study sessions for each day." },
            { t: "Hear am", d: "Naija reminders when study time reach." },
            { t: "Chop praise", d: "Fresh shakara every day after you study finish." },
          ].map((f) => (
            <div key={f.t} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-primary">{f.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{f.d}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
