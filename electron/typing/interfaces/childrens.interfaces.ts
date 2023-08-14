export interface AddChildrenPayload {
	groupId: string
	name: string
	birthday: string
	paymentPercent?: number
	halfPaymentReason?: string
}

export interface EditChildrenPayload extends AddChildrenPayload {
	_id: string
}
