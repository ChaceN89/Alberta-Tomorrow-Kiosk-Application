/**
  File: PlayerJournalAssetList.tsx | Author: Chace Nielson
  Date Created: Nov 5, 2026
  Date Updated: Nov 5, 2026

  Description:
  - Render the list of player assets shown on the journal title page.

  Usage:
  - Supply translated asset details and an open action for each asset.

  Notes:
  - Add future planes, characters, or maps as items; the preview layout is shared.
 */
import {
  ViewablePlayerJournalAsset,
  type PlayerJournalAsset,
} from './ViewablePlayerJournalAsset'

// Render the list of player journal assets with their viewable previews.
type PlayerJournalAssetListProps = {
  assets: readonly PlayerJournalAsset[]
}

export function PlayerJournalAssetList({
  assets,
}: PlayerJournalAssetListProps) {
  return (
    <ul className="flex w-full max-w-xl flex-col gap-4">
      {assets.map(({ id, ...asset }) => (
        <li key={id}>
          <ViewablePlayerJournalAsset {...asset} />
        </li>
      ))}
    </ul>
  )
}
