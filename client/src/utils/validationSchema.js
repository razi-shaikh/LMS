import * as Yup from 'yup'

export const bookSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  author: Yup.string().required("Author is required"),
  publisher: Yup.string().required("Publisher is required"),
  isbn: Yup
    .number()
    .typeError("ISBN must be a number")
    .required("ISBN is required"),
});

export const bookUpdateSchema = Yup.object({
  name: Yup.string(),
  author: Yup.string(),
  publisher: Yup.string(),
  isbn: Yup
    .number()
    .typeError("ISBN must be a number")
});

export const studentSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  rollNo: Yup
    .number()
    .typeError("Roll No must be a number")
    .required("Roll No is required"),
  class: Yup.string().required("Class is required"),
  phoneNo: Yup
    .number()
    .typeError("Phone No must be a number")
    .required("Phone No is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  pinCode: Yup
    .number()
    .typeError("Pincode must be a number")
    .required("Pincode is required")
});