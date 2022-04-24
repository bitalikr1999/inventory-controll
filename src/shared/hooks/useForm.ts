import { useState } from 'react'

export interface IUseFormState {
	[key: string]: string | number | boolean | any
}
type IValidateMethod<T> = (data: T) => FormErrors<T>

type FormErrors<T> = Partial<Record<keyof T, string>>


/**
 * @values - form values object 
 * @set - function to set values 
 * @errors - form values errors, key = values key and value = error 
 * @setField - set one field 
 * @SetError - set one error, key = field 
 * @SetErrors - set all errors
 * @onSubmit - validate and call callback
 */
export interface IForm<T> {
	values: T
	set: (form: T) => void
	errors: FormErrors<T>
	setField: (key: keyof T, value: any) => any
	setError: (key: keyof T, error: string) => void
	setErrors: (errors: Record<keyof T, string>) => void
	onSubmit: (callback: () => void) => () => void
}


/**
 * 
 * @param initValue 
 * @param validateMethod  - method must validate values and return error
 * @returns 
 */
export const useForm = <T extends IUseFormState>(
	initValue: Partial<T>,
	validateMethod: IValidateMethod<T>
): IForm<T> => {
	const [values, setForm] = useState(initValue as T)
	const [errors, setErrors] = useState<FormErrors<T>>({})

	const setFormError = (f: keyof T, e: string = null) => {
		setErrors((oldErrors) => {
			return { ...oldErrors, [f]: e }
		})
	}
	const setFormField = (f: keyof T, v: any) => {
		setForm((oldForm) => {
			return { ...oldForm, [f]: v }
		})
		setFormError(f, null)
	}

	const validate = () => {
		const _errors: any = validateMethod(values)
		if (_errors) {
			setErrors(_errors)
			return true
		}
	}

	const onSubmit = (callback: () => void): any => {
		if (validate && validate()) return
		callback()
	}

	return {
		values,
		set: setForm,
		errors,
		setField: setFormField,
		setError: setFormError,
		setErrors,
		onSubmit,
	}
}
