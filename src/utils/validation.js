export const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/
  if (!phoneRegex.test(phone)) {
    throw new Error('Phone number must be exactly 10 digits')
  }
}

export const validateDateTime = (date, time = null) => {
  const selectedDate = time 
    ? new Date(`${date}T${time}`)
    : new Date(date)
  const now = new Date()

  if (selectedDate < now) {
    throw new Error('Cannot select past date or time')
  }
}
