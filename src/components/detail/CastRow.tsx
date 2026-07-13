import type { CastMember } from "@/types/media"

function Avatar({ member }: { member: CastMember }) {
  const initial = member.name.trim().charAt(0)
  return (
    <div className="flex w-20 shrink-0 flex-col items-center gap-2 text-center">
      {member.profileUrl ? (
        <img
          src={member.profileUrl || "/placeholder.svg"}
          alt={member.name}
          className="size-16 rounded-full border border-white/10 object-cover"
        />
      ) : (
        <span className="grid size-16 place-items-center rounded-full border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.03] text-lg font-semibold text-foreground/80">
          {initial}
        </span>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium">{member.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{member.role}</p>
      </div>
    </div>
  )
}

export function CastRow({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null
  return (
    <section aria-label="演员和主创">
      <h2 className="mb-3 text-base font-semibold tracking-tight">演员和主创</h2>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-1">
        {cast.map((m) => (
          <Avatar key={m.id} member={m} />
        ))}
      </div>
    </section>
  )
}
