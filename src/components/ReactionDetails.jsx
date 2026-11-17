export default function ReactionDetails({ reactions, ownIds, user, onDelete }) {
  if (!reactions.length) return null

  return (
    <ul className="mt-2 space-y-1 text-sm text-slate-600">
      {reactions.map((reaction) => {
        const esPropia =
          ownIds.has(reaction.id) ||
          (Boolean(user?.id) && reaction.user?.id === user.id)

        return (
          <li key={reaction.id} className="flex items-center justify-between gap-2">
            <span>
              {reaction.user?.name ?? 'Anónimo'} · {reaction.type}
            </span>
            {esPropia && (
              <button
                type="button"
                onClick={() => onDelete(reaction.id)}
                className="text-xs text-red-600 hover:underline"
              >
                Quitar
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}
