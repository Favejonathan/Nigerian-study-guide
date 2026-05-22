import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { sendChat } from "@/lib/chat.functions";
import {
  DAY_NAMES,
  fmtTime,
  nowHHMM,
  ScheduleItem,
  sortByStart,
  summariseDay,
  todayDow,
} from "@/lib/schedule";
import {
  STUDY_REMINDERS,
  STUDY_DONE_PRAISE,
  GREETINGS,
  dailyPick,
  randomPick,
} from "@/lib/naija";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function AppPage() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["schedule"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schedule_items")
        .select("*")
        .order("day_of_week")
        .order("start_time");
      if (error) throw error;
      return data as ScheduleItem[];
    },
  });

  const dow = todayDow();
  const todayItems = useMemo(
    () => sortByStart(items.filter((i) => i.day_of_week === dow)),
    [items, dow]
  );

  // ===== Notifications: poll every 30s for items that just started =====
  const firedRef = useRef<Set<string>>(new Set());
  const finishedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Reset daily
    const dayKey = new Date().toDateString();
    const stored = sessionStorage.getItem("naija-day-key");
    if (stored !== dayKey) {
      firedRef.current.clear();
      finishedRef.current.clear();
      sessionStorage.setItem("naija-day-key", dayKey);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = nowHHMM();
      todayItems
        .filter((i) => i.kind === "study")
        .forEach((i, idx) => {
          const startKey = `start-${i.id}`;
          const endKey = `end-${i.id}`;
          if (i.start_time.slice(0, 5) === now && !firedRef.current.has(startKey)) {
            firedRef.current.add(startKey);
            toast(randomPick(STUDY_REMINDERS), {
              description: `Study session: ${i.title} (${fmtTime(i.start_time)}–${fmtTime(i.end_time)})`,
              duration: 8000,
            });
          }
          if (i.end_time.slice(0, 5) === now && !finishedRef.current.has(endKey)) {
            finishedRef.current.add(endKey);
            toast.success(randomPick(STUDY_DONE_PRAISE), {
              description: `${i.title} — session done.`,
              duration: 10000,
            });
          }
        });
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, [todayItems]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Tabs defaultValue="today">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <TodayPanel todayItems={todayItems} dow={dow} />
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <SchedulePanel items={items} onChanged={() => qc.invalidateQueries({ queryKey: ["schedule"] })} />
        </TabsContent>

        <TabsContent value="chat" className="mt-6">
          <ChatPanel items={items} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

/* -------------------- TODAY -------------------- */
function TodayPanel({ todayItems, dow }: { todayItems: ScheduleItem[]; dow: number }) {
  const greeting = dailyPick(GREETINGS);
  const studyTip = dailyPick(STUDY_REMINDERS, 1);
  const dayName = DAY_NAMES[dow];

  return (
    <div className="space-y-4">
      <Card className="border-primary/20 bg-card p-6">
        <p className="text-sm uppercase tracking-widest text-primary">{dayName}</p>
        <h2 className="mt-1 text-2xl font-bold">{greeting}</h2>
        <p className="mt-2 text-muted-foreground">{studyTip}</p>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold">Your plan for today</h3>
        {todayItems.length === 0 ? (
          <p className="mt-3 text-muted-foreground">
            Nothing on your list for today, my person. Free day or go to the
            Schedule tab to add something.
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {todayItems.map((i) => (
              <li
                key={i.id}
                className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3"
              >
                <div>
                  <p className="font-medium">{i.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {fmtTime(i.start_time)} – {fmtTime(i.end_time)}
                  </p>
                </div>
                <span
                  className={
                    i.kind === "class"
                      ? "rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground"
                      : "rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground"
                  }
                >
                  {i.kind}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* -------------------- SCHEDULE -------------------- */
function SchedulePanel({ items, onChanged }: { items: ScheduleItem[]; onChanged: () => void }) {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<"class" | "study">("study");
  const [day, setDay] = useState<string>(String(todayDow()));
  const [start, setStart] = useState("17:00");
  const [end, setEnd] = useState("18:00");
  const [saving, setSaving] = useState(false);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("schedule_items").insert({
      user_id: user.id,
      title,
      kind,
      day_of_week: parseInt(day, 10),
      start_time: start,
      end_time: end,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Added! No wahala.");
    setTitle("");
    onChanged();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("schedule_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    onChanged();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="text-lg font-semibold">Add to your schedule</h3>
        <form onSubmit={add} className="mt-4 space-y-3">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. MTH 101 or Maths revision" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Kind</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as "class" | "study")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="study">Study session</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Day</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DAY_NAMES.map((n, i) => (
                    <SelectItem key={n} value={String(i)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start</Label>
              <Input type="time" value={start} onChange={(e) => setStart(e.target.value)} required />
            </div>
            <div>
              <Label>End</Label>
              <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} required />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "..." : "Add"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold">Weekly schedule</h3>
        <div className="mt-4 space-y-4">
          {DAY_NAMES.map((name, idx) => {
            const dayItems = sortByStart(items.filter((i) => i.day_of_week === idx));
            return (
              <div key={name}>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{name}</p>
                {dayItems.length === 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground/70">Empty</p>
                ) : (
                  <ul className="mt-2 space-y-1">
                    {dayItems.map((i) => (
                      <li key={i.id} className="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-sm">
                        <span>
                          <span className="font-medium">{i.title}</span>{" "}
                          <span className="text-muted-foreground">· {fmtTime(i.start_time)}–{fmtTime(i.end_time)} · {i.kind}</span>
                        </span>
                        <button onClick={() => remove(i.id)} className="text-xs text-destructive hover:underline">remove</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* -------------------- CHAT -------------------- */
function ChatPanel({ items }: { items: ScheduleItem[] }) {
  const dow = todayDow();
  const dayName = DAY_NAMES[dow];
  const todayItems = useMemo(() => sortByStart(items.filter((i) => i.day_of_week === dow)), [items, dow]);
  const scheduleContext = useMemo(
    () => summariseDay(todayItems, dayName) + `\n\nFull week items count: ${items.length}`,
    [todayItems, dayName, items.length]
  );

  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: `${dailyPick(GREETINGS)} I be StudyPikin, your study buddy. Ask me wetin you get today, or talk study tip. Make we go!`,
    },
  ]);
  const [input, setInput] = useState("");
  const callChat = useServerFn(sendChat);

  const mutation = useMutation({
    mutationFn: async (msgs: Msg[]) =>
      callChat({ data: { messages: msgs, scheduleContext } }),
    onSuccess: (res) => {
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  function send(text: string) {
    if (!text.trim() || mutation.isPending) return;
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    mutation.mutate(next);
  }

  return (
    <Card className="flex h-[70vh] flex-col p-0">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2 text-primary-foreground"
                  : "mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-2 text-secondary-foreground"
              }
            >
              <p className="whitespace-pre-wrap text-sm">{m.content}</p>
            </div>
          ))}
          {mutation.isPending && (
            <div className="mr-auto max-w-[80%] rounded-2xl rounded-bl-sm bg-secondary px-4 py-2 text-sm text-muted-foreground">
              Typing...
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-border bg-card p-3">
        <div className="mx-auto flex max-w-2xl flex-wrap gap-2 pb-2">
          <QuickChip onClick={() => send("Wetin I get today? Give me my full schedule.")}>Wetin I get today?</QuickChip>
          <QuickChip onClick={() => send("Give me one quick Naija study tip for today.")}>Quick study tip</QuickChip>
          <QuickChip onClick={() => send("Motivate me small, I no wan read.")}>Motivate me</QuickChip>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="mx-auto flex max-w-2xl gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to StudyPikin..."
            disabled={mutation.isPending}
          />
          <Button type="submit" disabled={mutation.isPending || !input.trim()}>Send</Button>
        </form>
      </div>
    </Card>
  );
}

function QuickChip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
    >
      {children}
    </button>
  );
}