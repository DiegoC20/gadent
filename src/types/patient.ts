export type AppointmentStatus = 'none' | 'completed' | 'missed'

export interface PatientAppointment {
  date: string
  doctor: string
  reason: string
  status: string
  comment: string
}

export interface PatientDetail {
  nombres: string
  apellidos: string
  apodo: string
  documento: string
  telefono: string
  email: string
  fechaNacimiento: string
  paisNacimiento: string
  telFijo: string
  numeroHC: string
  sexo: string
  aseguradora: string
  lineaNegocio: string
  grupo: string
  ocupacion: string
  adicional: string
  ultimaCita: string
  createdAt: string
  age: number
}

export interface Patient {
  id: number
  name: string
  avatar: string
  lastAppointment: string
  lastAppointmentStatus: AppointmentStatus
  nextAppointment: string
  task: string
  budget?: { current: number; total: number }
  source: string
  comment: string
  detail: PatientDetail
  appointments: PatientAppointment[]
}
