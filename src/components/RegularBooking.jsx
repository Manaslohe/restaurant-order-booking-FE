import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { validatePhone } from '../utils/validation'
import { LucideLoader2 } from 'lucide-react'

function RegularBooking({ onCreateOrder }) {
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    thaliCount: 1
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      validatePhone(formData.phone)
      
      const success = await onCreateOrder(formData)
      if (success) {
        setFormData({ phone: '', name: '', thaliCount: 1 })
        toast.success('Order created successfully!')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setFormData({ ...formData, phone: value })
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Phone Number
              <span className="text-xs text-gray-400 ml-1">(10 digits)</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={handlePhoneChange}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        transition-all hover:border-gray-300 shadow-sm
                        placeholder:text-gray-400 touch-manipulation"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        transition-all hover:border-gray-300 shadow-sm
                        placeholder:text-gray-400 touch-manipulation"
              placeholder="Enter customer name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Thalis
            </label>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setFormData({...formData, thaliCount: Math.max(1, formData.thaliCount - 1)})}
                className="w-14 h-14 text-2xl bg-white rounded-full hover:bg-gray-100 
                          transition-all active:scale-95 shadow-md text-gray-600
                          flex items-center justify-center touch-manipulation"
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={formData.thaliCount}
                onChange={(e) => setFormData({...formData, thaliCount: parseInt(e.target.value)})}
                className="flex-1 p-4 text-lg border-none bg-transparent text-center
                          focus:ring-0 focus:outline-none font-medium text-gray-800
                          touch-manipulation"
                required
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, thaliCount: formData.thaliCount + 1})}
                className="w-14 h-14 text-2xl bg-white rounded-full hover:bg-gray-100 
                          transition-all active:scale-95 shadow-md text-gray-600
                          flex items-center justify-center touch-manipulation"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full p-4 text-lg bg-gradient-to-r from-orange-500 to-orange-600 
                    text-white rounded-xl hover:from-orange-600 hover:to-orange-700 
                    transition-all hover:scale-[1.02] active:scale-98
                    shadow-md hover:shadow-xl font-semibold disabled:opacity-60
                    flex items-center justify-center gap-2 touch-manipulation"
        >
          {loading && <LucideLoader2 className="animate-spin h-5 w-5" />}
          {loading ? 'Creating Order...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}

export default RegularBooking