import { ModulePage } from '@/components/module-page'

export const revalidate = 300

export default function ProgressPage() {
  return <ModulePage type="progress" pageClassName="fade-bottom-page" />
}
