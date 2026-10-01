import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Container,
  Eyebrow,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { useSeo } from "@/hooks/use-seo";
import { track } from "@/lib/analytics";
import { getSessionId } from "@/lib/session";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  FileUp,
  Link2,
  Loader2,
  MessageSquare,
  Newspaper,
  Paperclip,
  Rocket,
  Search,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

const KINDS = [
  { id: "project", label: "Project", icon: Rocket },
  { id: "note", label: "Build note", icon: Newspaper },
  { id: "question", label: "Question", icon: MessageSquare },
] as const;

type PostKind = (typeof KINDS)[number]["id"];

const MAX_BYTES = 6 * 1024 * 1024;

function timeAgo(timestamp: number) {
  const seconds = Math.max(1, Math.round((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function kindMeta(kind: PostKind) {
  return KINDS.find((item) => item.id === kind) ?? KINDS[0];
}

export default function Community() {
  const { isAuthenticated, user } = useAuth();
  const sessionId = getSessionId();

  const posts = useQuery(api.posts.list, { limit: 40 });
  const comments = useQuery(api.comments.listRecent, { limit: 300 });
  const mine = useQuery(
    api.posts.listMine,
    isAuthenticated ? { sessionId } : "skip",
  );

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
  const createPost = useMutation(api.posts.create);
  const removePost = useMutation(api.posts.remove);
  const addComment = useMutation(api.comments.add);

  useSeo({
    title: "Community",
    description:
      "Student projects, build notes and honest questions from the DishaYaaN community. Publish your own work, attach files and get answers from mentors and peers.",
    path: "/community",
    keywords: [
      "student projects",
      "student community",
      "build logs",
      "mentor answers",
    ],
  });

  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<PostKind | "all">("all");

  const [displayName, setDisplayName] = useState(user?.name ?? "");
  const [kind, setKind] = useState<PostKind>("project");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [link, setLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    track("community_view");
  }, []);

  const mineIds = useMemo(
    () => new Set((mine ?? []).map((post) => post._id)),
    [mine],
  );

  const commentsByPost = useMemo(() => {
    const map: Record<
      string,
      Array<{ _id: string; authorName: string; body: string }>
    > = {};
    (comments ?? []).forEach((comment) => {
      const list = (map[comment.postId] ??= []);
      list.push({
        _id: comment._id,
        authorName: comment.authorName,
        body: comment.body,
      });
    });
    return map;
  }, [comments]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (posts ?? []).filter((post) => {
      if (kindFilter !== "all" && post.kind !== kindFilter) return false;
      if (!needle) return true;
      return [post.title, post.body, post.authorName, ...post.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [posts, query, kindFilter]);

  const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (file && file.size > MAX_BYTES) {
      setError("That file is larger than 6 MB. Compress it and try again.");
      return;
    }

    setStatus("sending");
    try {
      let fileId: Id<"_storage"> | undefined;
      if (file) {
        const uploadUrl = await generateUploadUrl();
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });
        if (!response.ok) {
          throw new Error("The file upload failed. Please try again.");
        }
        const payload = (await response.json()) as { storageId: string };
        fileId = payload.storageId as Id<"_storage">;
      }

      await createPost({
        authorName: displayName || user?.name || "DishaYaaN learner",
        sessionId,
        kind,
        title,
        body,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
          .slice(0, 6),
        link: link || undefined,
        fileId,
        fileName: file?.name,
        contentType: file?.type || undefined,
      });

      track("community_post_create", {
        kind,
        hasFile: Boolean(file),
        tagCount: tags.split(",").filter((tag) => tag.trim()).length,
      });

      setTitle("");
      setBody("");
      setTags("");
      setLink("");
      setFile(null);
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "We could not publish that. Please try again.",
      );
    }
  };

  const handleComment = async (postId: string) => {
    const draft = (drafts[postId] ?? "").trim();
    if (draft.length < 2) return;
    try {
      await addComment({
        postId: postId as Id<"posts">,
        authorName: displayName || user?.name || "DishaYaaN learner",
        sessionId,
        body: draft,
      });
      track("community_comment_add", { length: draft.length });
      setDrafts((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "That comment did not go through.",
      );
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await removePost({ id: postId as Id<"posts">, sessionId });
      track("community_post_delete");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "That post could not be deleted.",
      );
    }
  };

  return (
    <>
      <Section tone="paper" className="border-b-2 border-ink pb-12 pt-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end">
            <SectionHeader
              eyebrow="Student community"
              eyebrowTone="violet"
              title="Show the work. Ask the awkward question."
              lead="This is where students publish their own projects, upload build logs and ask questions that do not fit in a classroom. Mentors read it and answer here, in public, so the next student finds it too."
            />
            <div className="border-2 border-ink bg-panel-2 p-5 text-ink">
              <Eyebrow tone="cyan">House rules</Eyebrow>
              <ul className="mt-4 space-y-2 text-xs leading-relaxed text-ink/80">
                <li>Publish only your own work — credit anyone who helped.</li>
                <li>No personal contact details, no school addresses, no photos of other people.</li>
                <li>Critique the project, never the person. Mentors apply the same rule.</li>
                <li>Uploads stay under 6 MB and stay on your own storage record.</li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="white" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <div>
              <div className="flex flex-col gap-3 border-2 border-ink bg-paper p-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search posts, tags or authors"
                    className="border-2 border-ink pl-9"
                    aria-label="Search community posts"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["all", ...KINDS.map((item) => item.id)] as Array<
                    PostKind | "all"
                  >).map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={kindFilter === value}
                      onClick={() => setKindFilter(value)}
                      className={cn(
                        "border-2 border-ink px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
                        kindFilter === value
                          ? "bg-neo-yellow text-deep"
                          : "bg-card hover:bg-paper",
                      )}
                    >
                      {value === "all" ? "All" : kindMeta(value).label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-5 font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {posts === undefined
                  ? "Loading the feed"
                  : `${visible.length} of ${posts.length} posts`}
              </p>

              <div className="mt-4 space-y-5">
                {visible.length === 0 ? (
                  <div className="border-2 border-dashed border-ink/40 bg-paper p-8 text-center">
                    <Users className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-3 text-sm font-bold">
                      {posts && posts.length > 0
                        ? "Nothing matches that filter yet."
                        : "The feed is empty — be the first to publish."}
                    </p>
                    <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
                      Your project does not have to be finished. A half-built rover
                      with an honest write-up teaches more than a perfect screenshot.
                    </p>
                  </div>
                ) : null}

                {visible.map((post) => {
                  const meta = kindMeta(post.kind as PostKind);
                  const Icon = meta.icon;
                  const postComments = commentsByPost[post._id] ?? [];
                  const isMine = mineIds.has(post._id);
                  return (
                    <Reveal key={post._id}>
                      <article className="border-2 border-ink bg-card">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink bg-paper px-4 py-3">
                          <span className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider">
                            <Icon className="size-3.5 text-neo-violet" />
                            {meta.label}
                          </span>
                          <span className="font-mono text-[11px] font-semibold text-muted-foreground">
                            {post.authorName} · {timeAgo(post._creationTime)}
                          </span>
                        </div>

                        <div className="p-5">
                          <h3 className="text-lg font-bold leading-snug">
                            {post.title}
                          </h3>
                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                            {post.body}
                          </p>

                          {post.tags.length > 0 ? (
                            <ul className="mt-4 flex flex-wrap gap-1.5">
                              {post.tags.map((tag) => (
                                <li
                                  key={tag}
                                  className="border border-ink/30 bg-paper px-2 py-0.5 font-mono text-[11px] font-medium"
                                >
                                  #{tag}
                                </li>
                              ))}
                            </ul>
                          ) : null}

                          <div className="mt-4 flex flex-wrap gap-3">
                            {post.fileUrl ? (
                              <a
                                href={post.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold transition-colors hover:bg-neo-cyan hover:text-deep"
                              >
                                <Paperclip className="size-3.5" />
                                {post.fileName ?? "Attachment"}
                              </a>
                            ) : null}
                            {post.link ? (
                              <a
                                href={post.link}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 border-2 border-ink bg-paper px-3 py-1.5 text-xs font-bold transition-colors hover:bg-neo-cyan hover:text-deep"
                              >
                                <Link2 className="size-3.5" />
                                Open the project
                              </a>
                            ) : null}
                          </div>
                        </div>

                        <div className="border-t-2 border-ink bg-paper p-4">
                          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                            {postComments.length === 0
                              ? "No comments yet"
                              : `${postComments.length} comment${postComments.length === 1 ? "" : "s"}`}
                          </p>

                          {postComments.length > 0 ? (
                            <ul className="mt-3 space-y-3">
                              {postComments.slice(-3).map((comment) => (
                                <li
                                  key={comment._id}
                                  className="border-l-2 border-neo-violet pl-3"
                                >
                                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                    {comment.authorName}
                                  </p>
                                  <p className="mt-0.5 text-sm leading-snug">
                                    {comment.body}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          ) : null}

                          {isAuthenticated ? (
                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                              <Input
                                value={drafts[post._id] ?? ""}
                                onChange={(event) =>
                                  setDrafts((prev) => ({
                                    ...prev,
                                    [post._id]: event.target.value,
                                  }))
                                }
                                placeholder="Add something useful — a question, a fix, a next step"
                                className="border-2 border-ink"
                                aria-label={`Comment on ${post.title}`}
                              />
                              <Button
                                type="button"
                                variant="neo"
                                className="font-bold"
                                onClick={() => void handleComment(post._id)}
                              >
                                Comment
                              </Button>
                            </div>
                          ) : (
                            <p className="mt-3 text-xs text-muted-foreground">
                              <Link
                                to={`/auth?returnTo=/community`}
                                className="font-bold text-neo-cyan hover:underline"
                              >
                                Sign in
                              </Link>{" "}
                              to comment or publish your own work.
                            </p>
                          )}

                          {isMine ? (
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-ink/25 pt-3">
                              <span className="inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <ShieldCheck className="size-3.5 text-neo-green" />
                                Published by you
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="font-bold text-destructive"
                                onClick={() => void handleDelete(post._id)}
                              >
                                <Trash2 className="size-3.5" />
                                Delete post
                              </Button>
                            </div>
                          ) : null}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              {isAuthenticated ? (
                <form
                  onSubmit={handlePublish}
                  className="border-2 border-ink bg-card shadow-neo-violet"
                >
                  <div className="flex items-center gap-3 border-b-2 border-ink bg-neo-violet px-5 py-3 text-white">
                    <Upload className="size-4" />
                    <span className="font-mono text-sm font-bold uppercase tracking-[0.12em]">
                      Publish your work
                    </span>
                  </div>

                  <div className="space-y-4 p-5">
                    <div>
                      <Label className="font-mono text-xs font-bold uppercase tracking-[0.14em]">
                        What is this?
                      </Label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {KINDS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            aria-pressed={kind === item.id}
                            onClick={() => setKind(item.id)}
                            className={cn(
                              "border-2 border-ink px-2 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
                              kind === item.id
                                ? "bg-neo-yellow text-deep"
                                : "bg-paper hover:bg-card",
                            )}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="post-author"
                        className="font-mono text-xs font-bold uppercase tracking-[0.14em]"
                      >
                        Display name
                      </Label>
                      <Input
                        id="post-author"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        placeholder="How should we credit you?"
                        className="border-2 border-ink"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="post-title"
                        className="font-mono text-xs font-bold uppercase tracking-[0.14em]"
                      >
                        Title
                      </Label>
                      <Input
                        id="post-title"
                        required
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Line-following rover that survives a tiled floor"
                        className="border-2 border-ink"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="post-body"
                        className="font-mono text-xs font-bold uppercase tracking-[0.14em]"
                      >
                        What did you build or learn?
                      </Label>
                      <Textarea
                        id="post-body"
                        required
                        rows={6}
                        value={body}
                        onChange={(event) => setBody(event.target.value)}
                        placeholder="What you tried, what broke, what you would tell the next student. Plain honesty beats polish."
                        className="border-2 border-ink"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="post-tags"
                        className="font-mono text-xs font-bold uppercase tracking-[0.14em]"
                      >
                        Tags
                      </Label>
                      <Input
                        id="post-tags"
                        value={tags}
                        onChange={(event) => setTags(event.target.value)}
                        placeholder="Arduino, sensors, Class 9"
                        className="border-2 border-ink"
                      />
                      <p className="text-[11px] leading-snug text-muted-foreground">
                        Separate up to six tags with commas.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="post-link"
                        className="font-mono text-xs font-bold uppercase tracking-[0.14em]"
                      >
                        Project link (optional)
                      </Label>
                      <Input
                        id="post-link"
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        placeholder="https://github.com/…"
                        className="border-2 border-ink"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="post-file"
                        className="font-mono text-xs font-bold uppercase tracking-[0.14em]"
                      >
                        Attach a file
                      </Label>
                      <label
                        htmlFor="post-file"
                        className="flex cursor-pointer items-center gap-3 border-2 border-dashed border-ink/40 bg-paper px-3 py-3 text-xs font-semibold hover:bg-card"
                      >
                        <FileUp className="size-4 shrink-0 text-neo-violet" />
                        <span className="min-w-0 truncate">
                          {file ? file.name : "Photo, PDF, report or zip — up to 6 MB"}
                        </span>
                      </label>
                      <input
                        id="post-file"
                        type="file"
                        accept="image/*,application/pdf,.zip,.txt,.md,.csv"
                        className="sr-only"
                        onChange={(event) =>
                          setFile(event.target.files?.[0] ?? null)
                        }
                      />
                    </div>

                    {error ? (
                      <p className="border-2 border-ink bg-destructive/10 p-3 text-xs font-medium text-destructive">
                        {error}
                      </p>
                    ) : null}

                    {status === "sent" ? (
                      <p className="border-2 border-ink bg-neo-green p-3 text-xs font-bold text-deep">
                        Published. It is live in the feed above.
                      </p>
                    ) : null}

                    <Button
                      type="submit"
                      variant="neo-violet"
                      className="w-full font-bold"
                      disabled={status === "sending"}
                    >
                      {status === "sending" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Upload className="size-4" />
                      )}
                      {status === "sending" ? "Publishing" : "Publish to community"}
                    </Button>
                    <p className="text-[11px] leading-snug text-muted-foreground">
                      Your post is public and credited to the display name above.
                      Never upload anything private, and never someone else&rsquo;s
                      work.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="border-2 border-ink bg-panel-2 p-6 text-ink">
                  <Eyebrow tone="violet">Sign in to publish</Eyebrow>
                  <p className="mt-4 text-sm font-semibold">
                    Posting, uploading files and commenting need an account. Reading
                    never does.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-ink/70">
                    It takes a one-time email code — no password, no card.
                  </p>
                  <Button asChild variant="neo-cyan" className="mt-5 w-full font-bold">
                    <Link to="/auth?returnTo=/community">
                      Sign in or create an account
                    </Link>
                  </Button>
                </div>
              )}

              <div className="border-2 border-ink bg-card p-5">
                <Eyebrow tone="cyan">Where to start</Eyebrow>
                <ul className="mt-4 space-y-2 text-xs leading-relaxed text-muted-foreground">
                  <li>
                    &ldquo;What should I build in Class 8?&rdquo; — a perfectly good
                    first post.
                  </li>
                  <li>
                    Share one photo of the wiring, one paragraph on what failed.
                  </li>
                  <li>
                    Tag it honestly and a mentor covering that domain will answer.
                  </li>
                </ul>
                <Button asChild variant="neo" size="sm" className="mt-4 w-full font-bold">
                  <Link to="/catalog">Browse the catalogue</Link>
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
