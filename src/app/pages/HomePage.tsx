/**
  File: HomePage.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 23, 2026

  Description:
  - Display available expeditions from the registry with journal progress.

  Usage:
  - App route pages are rendered by the router.

  Notes:
  - None.
 */
import { useTranslation } from 'react-i18next'
import { ModuleCard } from '../../components/modules/ModuleCard'
import { modules } from '../../modules/registry'

export function HomePage() {
  const { t } = useTranslation('home')

  return (
    <section aria-labelledby="home-title" className="space-y-8">
      <div className="space-y-3">
        <p className="font-semibold text-pine">{t('eyebrow')}</p>
        <h1 id="home-title">{t('title')}</h1>
        <p className="text-lg text-muted">{t('description')}</p>
      </div>
      <ul
        data-tour="expedition-list"
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
      >
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </ul>
    </section>
  )
}

// keep the headers releatvley simple thoughout the application - should have a simple summary of a fiel t olook over, and a good refercen for looking itno changes or issues
/*
  File: FileName.tsx | Author: Chace Nielson
  Date Created: Oct 23, 2026
  Date Updated: Oct 24, 2026 - CN - Brief description of the change.
  Date Updated: Oct 28, 2026 - CN - Brief description of the latest change. Add meaningful changes in chronological order, with the newest entry last. Keep descriptions short; use Git for detailed history.

  Description:
  - Describe the file's purpose and main responsibilities.
  - Add supporting details where useful.

  Usage:
  - Explain where this file or component belongs in the application.
  - Include setup requirements or usage instructions when needed.
  - Provide a short usage example if it helps clarify integration.
  - Describe integration and intended use. Avoid maintaining an exhaustive list of files that import the component.

  Notes:
  - Optional: document important assumptions or limitations.
  - Explain design decisions that are not obvious from the code.
  - Record planned improvements using a TODO prefix.
  - Explain constraints and reasoning rather than repeating the code. Write future work as an actionable item, such as TODO: Support reduced-motion preferences.
*/
