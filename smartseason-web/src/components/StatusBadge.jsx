const config = {
  Active:    { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500'  },
  'At Risk': { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-500'  },
  Completed: { bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400'   },
}

export default function StatusBadge({ status }) {
  const c = config[status] ?? config['Active']
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {status}
    </span>
  )
}
