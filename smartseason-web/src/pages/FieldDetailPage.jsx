import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Layout from '../components/Layout'
import StatusBadge from '../components/StatusBadge'
import StageBadge from '../components/StageBadge'

const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']

export default function FieldDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [stage, setStage] = useState('')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')

  const { data: field, isLoading } = useQuery({
    queryKey: ['field', id],
    queryFn: () => api.get(`/fields/${id}`).then(r => r.data.data),
    onSuccess: (data) => { if (!stage) setStage(data.stage) },
  })

  const mutation = useMutation({
    mutationFn: (payload) => api.post(`/fields/${id}/updates`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['field', id])
      queryClient.invalidateQueries(['fields'])
      queryClient.invalidateQueries(['dashboard'])
      setNotes('')
      setFormError('')
      setFormSuccess('Update saved successfully.')
      setTimeout(() => setFormSuccess(''), 3000)
    },
    onError: (err) => {
      setFormError(err.response?.data?.message ?? 'Something went wrong.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    if (!stage) return setFormError('Please select a stage.')
    mutation.mutate({ stage, notes })
  }

  if (isLoading) return <Layout><div className="text-center py-16 text-gray-400">Loading...</div></Layout>
  if (!field)   return <Layout><div className="text-center py-16 text-gray-400">Field not found.</div></Layout>

  const canUpdate = user.role === 'agent' ||
    (user.role === 'admin')   // admins can also update

  return (
    <Layout>
      {/* Back */}
      <button
        onClick={() => navigate('/fields')}
        className="text-sm text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← Back to fields
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Field info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{field.name}</h1>
                <p className="text-gray-400 mt-1">{field.crop_type}</p>
              </div>
              <StatusBadge status={field.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
              <InfoBlock label="Current Stage">
                <StageBadge stage={field.stage} />
              </InfoBlock>
              <InfoBlock label="Planting Date">
                <span className="text-sm font-medium text-gray-700">
                  {new Date(field.planting_date).toLocaleDateString('en-KE', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </InfoBlock>
              <InfoBlock label="Assigned Agent">
                <span className="text-sm font-medium text-gray-700">
                  {field.agent?.name ?? <span className="text-gray-300 italic">Unassigned</span>}
                </span>
              </InfoBlock>
            </div>
          </div>

          {/* Update History */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Update History</h2>
            {(!field.updates || field.updates.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-6">No updates yet.</p>
            ) : (
              <div className="space-y-4">
                {field.updates.map((update, i) => (
                  <div key={update.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full mt-1 ${i === 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {i < field.updates.length - 1 && (
                        <div className="w-px flex-1 bg-gray-100 mt-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StageBadge stage={update.stage} />
                        <span className="text-xs text-gray-400">
                          by {update.agent?.name} · {new Date(update.created_at).toLocaleString('en-KE', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      {update.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mt-1">
                          {update.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Update form */}
        {canUpdate && (
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24">
              <h2 className="font-semibold text-gray-800 mb-4">Log an Update</h2>

              {formSuccess && (
                <div className="bg-green-50 text-green-700 text-sm px-3 py-2 rounded-lg mb-4">
                  {formSuccess}
                </div>
              )}
              {formError && (
                <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    New Stage
                  </label>
                  <select
                    value={stage}
                    onChange={e => setStage(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                  >
                    <option value="">Select stage...</option>
                    {STAGES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Notes / Observations
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Describe what you observed in the field..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={mutation.isLoading}
                  className="w-full bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
                >
                  {mutation.isLoading ? 'Saving...' : 'Save Update'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

function InfoBlock({ label, children }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      {children}
    </div>
  )
}
