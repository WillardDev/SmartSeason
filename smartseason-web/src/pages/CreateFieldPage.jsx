import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'
import Layout from '../components/Layout'

const STAGES = ['Planted', 'Growing', 'Ready', 'Harvested']

export default function CreateFieldPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: '',
    crop_type: '',
    planting_date: '',
    stage: 'Planted',
    assigned_agent_id: '',
  })
  const [error, setError] = useState('')

  // Load agents for the dropdown
  const { data: agents = [] } = useQuery({
    queryKey: ['agents'],
    queryFn: () =>
      api.get('/fields').then(r => {
        // Extract unique agents from existing fields, or fetch users separately
        return []
      }),
  })

  // Better: fetch all users with role=agent (add this endpoint or filter)
  // For now we'll use a separate simple endpoint — see note below
  const { data: allUsers = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(r => r.data.data).catch(() => []),
  })

  const agentUsers = allUsers.filter(u => u.role === 'agent')

  const mutation = useMutation({
    mutationFn: (payload) => api.post('/fields', payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['fields'])
      queryClient.invalidateQueries(['dashboard'])
      navigate(`/fields/${res.data.data.id}`)
    },
    onError: (err) => {
      const errors = err.response?.data?.errors
      if (errors) {
        setError(Object.values(errors).flat().join(' '))
      } else {
        setError(err.response?.data?.message ?? 'Something went wrong.')
      }
    },
  })

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const payload = { ...form }
    if (!payload.assigned_agent_id) delete payload.assigned_agent_id
    mutation.mutate(payload)
  }

  return (
    <Layout>
      <button
        onClick={() => navigate('/fields')}
        className="text-sm text-gray-400 hover:text-gray-700 mb-6 flex items-center gap-1"
      >
        ← Back to fields
      </button>

      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Field</h1>
        <p className="text-sm text-gray-400 mb-8">Register a new field and assign it to an agent.</p>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField label="Field Name" required>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. North Plot A"
                className="input"
                required
              />
            </FormField>

            <FormField label="Crop Type" required>
              <input
                name="crop_type"
                value={form.crop_type}
                onChange={handleChange}
                placeholder="e.g. Maize, Tomatoes, Wheat..."
                className="input"
                required
              />
            </FormField>

            <FormField label="Planting Date" required>
              <input
                name="planting_date"
                type="date"
                value={form.planting_date}
                onChange={handleChange}
                className="input"
                required
              />
            </FormField>

            <FormField label="Initial Stage">
              <select name="stage" value={form.stage} onChange={handleChange} className="input bg-white">
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Assign to Agent">
              <select
                name="assigned_agent_id"
                value={form.assigned_agent_id}
                onChange={handleChange}
                className="input bg-white"
              >
                <option value="">— Unassigned —</option>
                {agentUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </FormField>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="flex-1 bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
              >
                {mutation.isLoading ? 'Creating...' : 'Create Field'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/fields')}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}
