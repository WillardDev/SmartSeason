const config = {
  Planted:   'bg-sky-100 text-sky-700',
  Growing:   'bg-lime-100 text-lime-700',
  Ready:     'bg-emerald-100 text-emerald-700',
  Harvested: 'bg-stone-100 text-stone-600',
}

export default function StageBadge({ stage }) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config[stage] ?? 'bg-gray-100 text-gray-600'}`}>
      {stage}
    </span>
  )
}
