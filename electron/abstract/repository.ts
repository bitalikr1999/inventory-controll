export abstract class Repository<T> {
	constructor(public db: any) {}

	public find(params: any): Promise<T[]> {
		return new Promise((resolve, reject) => {
			this.db.find(params, (err: any, docs: T[]) => {
				if (err) reject(err)
				resolve(docs)
			})
		})
	}

	public findOne(params: any): Promise<T> {
		return new Promise((resolve, reject) => {
			this.db.findOne(params, (err: any, doc: T) => {
				if (err) resolve(err)
				else resolve(doc)
			})
		})
	}

	public remove(_id: string) {
		return new Promise((resolve, reject) => {
			this.db.remove({ _id }, {}, (err: any) => {
				console.log(err)
				if (err) reject(err)
				else resolve(null)
			})
		})
	}

	public updateOne(params: any, set: any) {
		return new Promise((resolve, reject) => {
			this.db.updateOne(
				params,
				{ $set: set },
				(err: any, result: any) => {
					if (err) reject(err)
					else resolve(result)
				},
			)
		})
	}

	public insert(data: Partial<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this.db.insert(data, (err: any, result: T) => {
				if (err) reject(err)
				else resolve(result)
			})
		})
	}
}
