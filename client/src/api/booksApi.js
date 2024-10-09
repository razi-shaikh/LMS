import supabase from "@/utils/supabase";

export const getBooks = async () => {

  const { data: books, error } = await supabase
    .from('books')
    .select('*')

  if (error) {
    console.error('getBooks Error', error)
    throw new Error("Error while getting list of books. Try again later.");
  }
  return books
}

export const createBook = async (book) => {
  let pictureUrl = null;

  if (book.picture) {
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('book-pictures')
      .upload(`public/${Date.now()}-${book.picture.name}`, book.picture);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error("Error while uploading the picture. Try again later.");
    }
    console.log("uploadData", uploadData);

    const { data: publicUrl } = supabase
      .storage
      .from('book-pictures')
      .getPublicUrl(uploadData.path);
    console.log("publicUrl", publicUrl);
    pictureUrl = publicUrl.publicUrl;
  }
  const { data, error } = await supabase
    .from('books')
    .insert([
      {
        ...book,
        picture: pictureUrl,
      },
    ])
    .select()

  if (error) {
    console.error('createBook Error', error)
    throw new Error("Error while creating book. Try again later.");
  }

  const bookId = data[0].id;

  const { error: assignToStudentError } = await supabase
    .from('assignToStudent')
    .insert([{
      assignedBookId: bookId,
      assignedStudents: [],
    }])
    .select();

  if (assignToStudentError) {
    console.error('assignToStudentError Error', assignToStudentError);
    throw new Error("Error while creating issue record. Try again later.");
  }

  return { message: "Book Created Successfully" };
}

export const updateBook = async ({ bookId, book }) => {
  console.log(bookId, book);
  try {
    if (book.picture) {
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('book-pictures')
        .upload(`public/${Date.now()}-${book.picture.name}`, book.picture);
      if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error("Error while uploading the picture. Try again later.");
      }
      console.log("uploadData", uploadData);
      const { data: publicUrl } = supabase
        .storage
        .from('book-pictures')
        .getPublicUrl(uploadData.path);

      console.log("publicUrl", publicUrl);
      book.picture = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from('books')
      .update([{ ...book }])
      .eq('id', bookId)

    if (error) {
      console.error('updateBook Error', error)
      throw new Error("Error while updating book. Try again later.");
    }
    console.log(data);

    return { message: "Book Updated Successfully" };
  } catch (error) {
    console.error('updateBook Error', error)
    throw new Error("Error while updating book. Try again later.");
  }
}
