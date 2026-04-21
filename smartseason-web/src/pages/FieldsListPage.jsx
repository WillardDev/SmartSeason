import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Layout from '../components/Layout'
import FieldCard from '../components/FieldCard'

const STAGES   = ['All', 'Planted', 'Growing', 'Ready', 'Harvested']
const STATUSES = ['All', 'Active', 'At Risk', 'Completed']

export default function FieldsListPage() {
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [stageFilter,  setStageFilter]  = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')

  const { data: fields = [], isLoading } = useQuery({
    queryKey: ['fields'],
    queryFn: () => api.get('/fields').then(r => r.data.data),
  })

  const filtered = fields.filter(f => {
    const matchStage  = stageFilter  === 'All' || f.stage  === stageFilter
    const matchStatus = statusFilter === 'All' || f.status === statusFilter
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                        f.crop_type.toLowerCase().includes(search.toLowerCase())
    return matchStage && matchStatus && matchSearch
  })

  return (
    <Layout>
      {/* Page header */}
      <div className="mb-8 fade-up fade-up-1">
        <p className="display-light text-xs mb-2"
          style={{ color: 'var(--green-700)', letterSpacing: '0.25em', fontSize: '10px' }}>
          {user?.role === 'admin' ? 'All Fields' : 'Assigned Fields'}
        </p>
        <div className="flex items-end justify-between">
          <h1 className="display text-5xl" style={{ color: 'var(--green-950)' }}>
            Fields
          </h1>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/fields/new')} className="btn-primary"
              style={{ background: 'var(--green-800)' }}>
              + Add Field
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="card p-4 mb-8 fade-up fade-up-2">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search fields or crops..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input flex-1 min-w-48"
          />
          <div className="flex gap-1 flex-wrap">
            {STAGES.map(s => (
              <button key={s} onClick={() => setStageFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  transition-all duration-150 ${
                  stageFilter === s
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                style={stageFilter === s ? { background: 'var(--green-800)' } : {}}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-1 flex-wrap">
            {STATUSES.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  transition-all duration-150 ${
                  statusFilter === s
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
                style={statusFilter === s ? { background: 'var(--green-800)' } : {}}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading fields...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-400 font-medium">No fields match your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 fade-up fade-up-2">
            {filtered.length} {filtered.length === 1 ? 'field' : 'fields'}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-up fade-up-3">
            {filtered.map(field => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}
