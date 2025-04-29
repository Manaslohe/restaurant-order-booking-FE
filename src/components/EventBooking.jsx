import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { validatePhone, validateDateTime } from '../utils/validation'
import { LucideLoader2, Plus, Minus } from 'lucide-react'

function EventBooking({ onCreateOrder }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    bookerName: '',
    mobileNumber: '',
    guestCount: 1,
    date: '',
    time: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      validatePhone(formData.mobileNumber)
      validateDateTime(formData.date, formData.time);
      
      const success = await onCreateOrder({
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`).toISOString()
      });
      
      if (success) {
        setFormData({ eventName: '', bookerName: '', mobileNumber: '', guestCount: 1, date: '', time: '' });
        toast.success('Event booking created successfully!');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleDateChange = (e) => {
    const today = new Date().toISOString().split('T')[0]
    if (e.target.value < today) {
      toast.error('Cannot select past dates')
      return
    }
    setFormData({...formData, date: e.target.value})
  }

  const handleTimeChange = (e) => {
    const selectedDateTime = new Date(`${formData.date}T${e.target.value}`)
    if (selectedDateTime < new Date()) {
      toast.error('Cannot select past time')
      return
    }
    setFormData({...formData, time: e.target.value})
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              value={formData.eventName}
              onChange={(e) => setFormData({...formData, eventName: e.target.value})}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        transition-all hover:border-gray-300 shadow-sm
                        placeholder:text-gray-400 touch-manipulation"
              placeholder="Enter event name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Booker Name
            </label>
            <input
              type="text"
              value={formData.bookerName}
              onChange={(e) => setFormData({...formData, bookerName: e.target.value})}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        transition-all hover:border-gray-300 shadow-sm
                        placeholder:text-gray-400 touch-manipulation"
              placeholder="Enter booker name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
              className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                        transition-all hover:border-gray-300 shadow-sm
                        placeholder:text-gray-400 touch-manipulation"
              placeholder="Enter mobile number"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white
                          focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                          transition-all hover:border-gray-300 shadow-sm
                          placeholder:text-gray-400 touch-manipulation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Event Time
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={handleTimeChange}
                className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl bg-white
                          focus:ring-2 focus:ring-orange-500 focus:border-orange-500
                          transition-all hover:border-gray-300 shadow-sm
                          placeholder:text-gray-400 touch-manipulation"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Expected Guests
            </label>
            <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-2 shadow-sm">
              <button
                type="button"
                onClick={() => setFormData({...formData, guestCount: Math.max(1, formData.guestCount - 1)})}
                className="w-14 h-14 bg-white rounded-full hover:bg-gray-100 
                          transition-all active:scale-95 shadow-md text-gray-600
                          flex items-center justify-center touch-manipulation"
              >
                <Minus className="w-6 h-6" />
              </button>
              <input
                type="number"
                min="1"
                value={formData.guestCount}
                onChange={(e) => setFormData({...formData, guestCount: parseInt(e.target.value)})}
                className="flex-1 p-4 text-lg border-none bg-transparent text-center
                          focus:ring-0 focus:outline-none font-medium text-gray-800
                          touch-manipulation"
                required
              />
              <button
                type="button"
                onClick={() => setFormData({...formData, guestCount: formData.guestCount + 1})}
                className="w-14 h-14 bg-white rounded-full hover:bg-gray-100 
                          transition-all active:scale-95 shadow-md text-gray-600
                          flex items-center justify-center touch-manipulation"
              >
                <Plus className="w-6 h-6" />
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
          {loading ? 'Creating Event Order...' : 'Create Event Order'}
        </button>
      </form>
    </div>
  )
}

export default EventBooking
