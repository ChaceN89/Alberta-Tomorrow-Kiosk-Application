/**
  File: ModuleTitleBar.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Oct 30, 2026

  Description:
  - Show the title and description for a module-specific map.

  Usage:
  - Rendered by ModuleExploreMap.

  Notes:
  - The title is supplied by the module's localized map content.
 */
type ModuleTitleBarProps = {
  title: string
  description: string
}

export function ModuleTitleBar({ title, description }: ModuleTitleBarProps) {
  return (
    <section
      aria-labelledby="module-map-title"
      className="mapping-module-title-bar panel bg-surface/95 p-4 shadow-xl backdrop-blur"
    >
      <h1 id="module-map-title" className="text-xl md:text-2xl">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted md:text-base">{description}</p>
    </section>
  )
}
