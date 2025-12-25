function saveAppointment(e){
  e.preventDefault();
  const data = {
    name: document.getElementById('name').value,
    contact: document.getElementById('contact').value,
    service: document.getElementById('service').value,
    date: document.getElementById('date').value,
  }
  const all = JSON.parse(localStorage.getItem('appointments')||'[]')
  all.push(data)
  localStorage.setItem('appointments', JSON.stringify(all))
  const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = 'appointment.json'
  a.click()
  alert('Appointment saved locally; you can send to hospital via email')
}
window.saveAppointment = saveAppointment
