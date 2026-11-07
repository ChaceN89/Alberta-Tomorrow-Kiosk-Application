/**
  File: ModuleTitleBar.tsx | Author: Chace Nielson
  Date Created: Oct 30, 2026
  Date Updated: Nov 6, 2026

  Description:
    - Show a compact module title that expands to reveal its description.

  Usage:
  - Rendered by ModuleExploreMap.

  Notes:
    - The title and description are supplied by the module's localized map content.
 */
import { useId, useState } from 'react'

type ModuleTitleBarProps = {
  title: string
  description: string
}

export function ModuleTitleBar({ title, description }: ModuleTitleBarProps) {
  const [isDescriptionVisible, setDescriptionVisible] = useState(false)
  const descriptionId = useId()

  return (
    <section
      aria-labelledby="module-map-title"
      className="mapping-module-title-bar panel bg-surface/95 p-4 shadow-xl backdrop-blur"
    >
      <h1 id="module-map-title" className="text-xl md:text-2xl">
        <button
          type="button"
          className="mapping-module-title-bar__toggle"
          aria-expanded={isDescriptionVisible}
          aria-controls={descriptionId}
          onClick={() => setDescriptionVisible((visible) => !visible)}
        >
          <span>{title}</span>
          <span
            aria-hidden="true"
            className="mapping-module-title-bar__chevron"
          />
        </button>
      </h1>
      <p
        id={descriptionId}
        hidden={!isDescriptionVisible}
        className="mapping-module-title-bar__description text-sm text-muted md:text-base"
      >
        {description}
      </p>
    </section>
  )
}
