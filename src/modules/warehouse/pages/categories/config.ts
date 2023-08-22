import { ProductCategory } from '@/@types/enums'
import cerealsImg from '@/assets/cereals.jpeg'
import meatImg from '@/assets/meat.jpeg'
import fishImg from '@/assets/fish.jpeg'
import fruitsImg from '@/assets/fruits.jpeg'
import groceriesImg from '@/assets/groceries.jpeg'
import milkImg from '@/assets/milk.jpeg'
import mushroomsImg from '@/assets/mushrooms.jpeg'
import vegetablesImg from '@/assets/vegetables.jpeg'

export const categoriesList = [
	{
		value: ProductCategory.Meat,
		image: meatImg,
	},
	{
		value: ProductCategory.Fish,
		image: fishImg,
	},
	{
		value: ProductCategory.Fruits,
		image: fruitsImg,
	},
	{
		value: ProductCategory.Vegetables,
		image: vegetablesImg,
	},
	{
		value: ProductCategory.Milk,
		image: milkImg,
	},
	{
		value: ProductCategory.Cereals,
		image: cerealsImg,
	},
	{
		value: ProductCategory.Groceries,
		image: groceriesImg,
	},

	{
		value: ProductCategory.Mushrooms,
		image: mushroomsImg,
	},
]
