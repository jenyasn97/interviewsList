export interface IInterview {
  id: string
  company: string
  vacancyLink: string
  hrName: string
  contactTelegram?: string
  contactWhatsApp?: string
  contactPhone?: string
  createdAt: Date
  salaryFrom?: number
  salaryTo?: number
  stage?: IStage[]
  result?: 'Refusal' | 'Offer'
}

export interface IStage {
  name: string
  date: Date | null
  description: string
}
