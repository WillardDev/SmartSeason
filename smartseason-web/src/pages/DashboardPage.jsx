import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import FieldCard from '../components/FieldCard'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const stageColors = {
  Planted:   '#86efac',
  Growing:   '#22c55e',
  Ready:     '#15803d',
  Harvested: '#d1d5db',
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate  = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get('/dashboard').then(r => r.data),
  })

  const stageData = data?.stage_breakdown
    ? Object.entries(data.stage_breakdown).map(([name, count]) => ({ name, count }))
    : []

  return (
    <Layout>
      {/* Hero banner */}
      <div className="relative rounded-3xl overflow-hidden mb-10 fade-up fade-up-1"
        style={{ minHeight: '220px' }}>
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, var(--green-950) 0%, var(--green-800) 100%)' }} />
        {/* Subtle grid texture */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 40px,rgba(255,255,255,.15) 40px,rgba(255,255,255,.15) 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,rgba(255,255,255,.15) 40px,rgba(255,255,255,.15) 41px)'
          }} />
        <div className="relative z-10 p-10 flex items-end justify-between h-full min-h-[220px]">
          <div>
            <p className="display-light text-xs mb-3"
              style={{ color: 'var(--green-400)', letterSpacing: '0.3em', fontSize: '10px' }}>
              {user?.role === 'admin' ? 'Season Overview' : 'My Fields'}
            </p>
            <h1 className="display text-5xl text-white mb-2" style={{ lineHeight: 0.95 }}>
              Good morning,<br/>{user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm mt-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {user?.role === 'admin'
                ? 'Monitor all fields and agent activity across the season.'
                : 'Here are the fields currently assigned to you.'}
            </p>
          </div>

          {!isLoading && (
            <div className="hidden md:flex gap-6 text-right">
              <div>
                <p className="display text-5xl text-white">{data?.total_fields ?? 0}</p>
                <p className="display-light text-xs mt-1" style={{ color: 'var(--green-400)', fontSize: '10px' }}>
                  Total Fields
                </p>
              </div>
              <div>
                <p className="display text-5xl" style={{ color: 'var(--green-400)' }}>
                  {data?.status_breakdown?.['At Risk'] ?? 0}
                </p>
                <p className="display-light text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>
                  At Risk
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-gray-400">Loading season data...</div>
      ) : (
        <>
          {/* Stat strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 fade-up fade-up-2">
            {[
              { label: 'Total Fields',   value: data?.total_fields ?? 0,                         color: 'var(--green-900)' },
              { label: 'Active',         value: data?.status_breakdown?.['Active']    ?? 0,       color: 'var(--green-700)' },
              { label: 'At Risk',        value: data?.status_breakdown?.['At Risk']   ?? 0,       color: '#d97706' },
              { label: 'Completed',      value: data?.status_breakdown?.['Completed'] ?? 0,       color: '#6b7280' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-6">
                <p className="display text-4xl mb-1" style={{ color }}>{value}</p>
                <p className="display-light text-xs" style={{ color: 'var(--green-800)', fontSize: '10px' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 fade-up fade-up-3">
            {/* Stage chart */}
            <div className="card p-6">
              <p className="display-light text-xs mb-6"
                style={{ color: 'var(--green-800)', letterSpacing: '0.2em', fontSize: '10px' }}>
                Fields by Stage
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={stageData} barSize={40}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Nunito Sans' }}
                    axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Nunito Sans' }}
                    axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #f0fdf4',
                      fontFamily: 'Nunito Sans', fontSize: 12 }}
                    cursor={{ fill: '#f0fdf4' }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {stageData.map(entry => (
                      <Cell key={entry.name} fill={stageColors[entry.name] ?? '#d1d5db'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* At-risk panel */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="display-light text-xs"
                  style={{ color: 'var(--green-800)', letterSpacing: '0.2em', fontSize: '10px' }}>
                  At Risk Fields
                </p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: '#fef3c7', color: '#92400e' }}>
                  {data?.at_risk_fields?.length ?? 0} fields
                </span>
              </div>

              {(!data?.at_risk_fields || data.at_risk_fields.length === 0) ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">🌱</div>
                  <p className="text-sm text-gray-400 font-medium">All fields on track</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-44 overflow-y-auto">
                  {data.at_risk_fields.map(field => (
                    <div key={field.id}
                      onClick={() => navigate(`/fields/${field.id}`)}
                      className="flex items-center justify-between p-3 rounded-xl cursor-pointer
                        hover:opacity-90 transition-opacity"
                      style={{ background: '#fffbeb' }}>
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#92400e' }}>{field.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: '#b45309' }}>
                          {field.crop_type} · {field.stage}
                        </p>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: '#d97706' }}>→</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* CTA row */}
          <div className="flex gap-3 fade-up fade-up-3">
            <button onClick={() => navigate('/fields')} className="btn-primary"
              style={{ background: 'var(--green-800)' }}>
              View All Fields →
            </button>
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/fields/new')}
                className="inline-flex items-center gap-2 border-2 font-semibold px-6 py-3
                  rounded-full transition-all duration-200 tracking-wide text-sm uppercase
                  hover:bg-green-50"
                style={{ borderColor: 'var(--green-800)', color: 'var(--green-800)' }}>
                + Add Field
              </button>
            )}
          </div>
        </>
      )}
    </Layout>
  )
}
