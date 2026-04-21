import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import StageBadge from './StageBadge'

export default function FieldCard({ field }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/fields/${field.id}`)}
      className="card cursor-pointer group overflow-hidden"
    >
      {/* Top color bar by status */}
      <div className={`h-1 w-full ${
        field.status === 'At Risk'   ? 'bg-amber-400' :
        field.status === 'Completed' ? 'bg-gray-300'  : 'bg-green-500'
      }`} />

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-base group-hover:text-green-800 transition-colors"
              style={{ color: 'var(--soil)', letterSpacing: '-0.01em' }}>
              {field.name}
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest mt-0.5 text-gray-400">
              {field.crop_type}
            </p>
          </div>
          <StatusBadge status={field.status} />
        </div>

        <div className="flex items-center justify-between">
          <StageBadge stage={field.stage} />
          {field.agent ? (
            <p className="text-xs text-gray-400">
              <span className="font-semibold text-gray-600">{field.agent.name}</span>
            </p>
          ) : (
            <p className="text-xs italic text-gray-300">Unassigned</p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Planted {new Date(field.planting_date).toLocaleDateString('en-KE', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
          <span className="text-xs font-semibold uppercase tracking-widest text-green-600
            opacity-0 group-hover:opacity-100 transition-opacity">
            View →
          </span>
        </div>
      </div>
    </div>
  )
}
