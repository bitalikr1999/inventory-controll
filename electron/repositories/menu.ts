import { app } from 'electron'
import { Repository } from 'electron/abstract'
import { dbCwd } from 'electron/config'
import { getMenuKey } from 'electron/helpers'
import { AddMenuPayload, IMenu } from 'electron/typing'
import _ from 'lodash'
import path from 'path'
class MenusRepository extends Repository<IMenu> {
	public async findByDate(date: string): Promise<IMenu[]> {
		return new Promise((resolve, reject) => {
			this.db.find(
				{ dateGroupKey: getMenuKey(date) },
				(err: any, docs: IMenu[]) => {
					if (err) reject(err)
					resolve(docs)
				},
			)
		})
	}

	public findOne(_id: string): Promise<IMenu> {
		return new Promise((resolve, reject) => {
			this.db.findOne({ _id }, (err: any, doc: IMenu) => {
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
			this.db.update(params, { $set: set }, (err: any, result: any) => {
				if (err) reject(err)
				else resolve(result)
			})
		})
	}

	// public insert(data: AddMenuPayload): Promise<IMenu> {
	// 	return new Promise((resolve, reject) => {
	// 		this.db.insert(data, (err: any, result: IMenu) => {
	// 			if (err) reject(err)
	// 			else resolve(result)
	// 		})
	// 	})
	// }
}

export const menusRepository = new MenusRepository()
	.setPath(path.join(dbCwd, 'menus.db'))
	.initDb()
