import { QuizPageClient } from '@/components/quiz/QuizPageClient'

type Props = { params: Promise<{ locale: string; id: string }> }

export default async function QuizPage({ params }: Props) {
  const { id } = await params
  return <QuizPageClient id={id} />
}
