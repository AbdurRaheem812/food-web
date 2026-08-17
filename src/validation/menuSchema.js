import * as Yup from 'yup';

export const categorySchema = Yup.object({
  name: Yup.string().min(1, 'Category name is required').required('Category name is required'),
});

export const menuItemSchema = Yup.object({
  name: Yup.string().min(1, 'Item name is required').required('Item name is required'),
  description: Yup.string().notRequired(),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be greater than 0')
    .required('Price is required'),
  categoryId: Yup.string().notRequired(),
  isVeg: Yup.boolean().notRequired(),
});