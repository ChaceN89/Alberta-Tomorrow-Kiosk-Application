/**
  File: ViewablePlayerJournalAsset.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render an accessible preview card that opens a player asset.

  Usage:
  - Rendered by PlayerJournalAssetList for each asset.

  Notes:
  - The open callback receives the button so viewers can animate from its origin.
 */
export type PlayerJournalAsset = {
  id: string
  title: string
  description: string
  previewSrc: string
  ariaLabel: string
  onOpen: (origin: Element) => void
}

type ViewablePlayerJournalAssetProps = Omit<PlayerJournalAsset, 'id'>

export function ViewablePlayerJournalAsset({
  title,
  description,
  previewSrc,
  ariaLabel,
  onOpen,
}: ViewablePlayerJournalAssetProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3">
      <button
        type="button"
        className="block shrink-0 rounded-xl"
        aria-label={ariaLabel}
        onClick={(event) => onOpen(event.currentTarget)}
      >
        <img
          src={previewSrc}
          alt=""
          className="h-24 w-32 rounded-xl object-cover"
        />
      </button>
      <div className="min-w-0">
        <p className="font-semibold text-pine">{title}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </div>
  )
}
