const Datastore = require('nedb')
export class Repository<T> {
	private _db: typeof Datastore
	private _path: string

	public get db() {
		return this._db
	}

	public get path() {
		return this._path
	}

	static create<T>(path: string) {
		const repository = new this<T>()

		repository.setPath(path)
		repository.initDb()

		return repository
	}

	public initDb() {
		this._db = new Datastore({
			filename: this._path,
			autoload: true,
			timestampData: true,
		})

		return this
	}

	public reload() {
		this._db.loadDatabase()
	}

	public setPath(path: string) {
		this._path = path
		return this
	}

	public find(params: any): Promise<T[]> {
		return new Promise((resolve, reject) => {
			this._db.find(params, (err: any, docs: T[]) => {
				if (err) reject(err)
				resolve(docs)
			})
		})
	}

	public findOne(params: any): Promise<T> {
		return new Promise((resolve, reject) => {
			this._db.findOne(params, (err: any, doc: T) => {
				if (err) resolve(err)
				else resolve(doc)
			})
		})
	}

	public remove(_id: string) {
		return new Promise((resolve, reject) => {
			this._db.remove({ _id }, {}, (err: any) => {
				console.log(err)
				if (err) reject(err)
				else resolve(null)
			})
		})
	}

	public updateOne(params: any, set: any) {
		return new Promise((resolve, reject) => {
			this._db.update(params, { $set: set }, (err: any, result: any) => {
				if (err) reject(err)
				else resolve(result)
			})
		})
	}

	public insert(data: Partial<T>): Promise<T> {
		return new Promise((resolve, reject) => {
			this._db.insert(data, (err: any, result: T) => {
				if (err) reject(err)
				else resolve(result)
			})
		})
	}
}
