import supabase from "@/utils/supabase";

export const issueBook = async ({ studentId, bookId }) => {
  try {
    const { data, error } = await supabase
      .from('issueBook')
      .select('*')
      .eq('student_id', studentId)

    if (error) {
      throw new Error("error issueBook", error)
    }

    const issuedBooks = data[0].issueBooks || []
    if (issuedBooks.length === 0) {
      // upgate issue book
      const { data: updateData, error: updateError } = await supabase
        .from('issueBook')
        .update({ issueBooks: [bookId] })
        .eq('student_id', studentId)

      if (updateError) {
        throw new Error("error upgate issue book", updateError)
      }
      return updateData;
    }

    const isDuplicated = issuedBooks.includes(bookId)
    if (!isDuplicated) {
      issuedBooks.push(bookId)

      const { data: updateData, error: updateError } = await supabase
        .from('issueBook')
        .update({ issueBooks: issuedBooks })
        .eq('student_id', studentId)

      if (updateError) {
        throw new Error("error upgate issue book", updateError)
      }
      return updateData;
    } else {
      console.log(`Duplicate book ID: ${bookId}`);
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const returnBook = async ({ studentId, bookId }) => {
  try {
    const { data, error } = await supabase
      .from('issueBook')
      .select('*')
      .eq('student_id', studentId)

    if (error) {
      throw new Error("error issueBook", error)
    }

    const issuedBooks = data[0].issueBooks || []
    if (issuedBooks.length === 0) {
      console.log(`No books have been issued to student ID: ${studentId}`);
      return;
    }

    const isBookPresent = issuedBooks.includes(bookId)
    if (!isBookPresent) {
      console.log(`Book ID: ${bookId} not found in the list of issued books.`);
      return;
    }

    const updatedBooks = issuedBooks.filter(id => id !== bookId);

    const { data: updateData, error: updateError } = await supabase
      .from('issueBook')
      .update({ issueBooks: updatedBooks })
      .eq('student_id', studentId);

    if (updateError) {
      throw new Error(`Error updating issueBooks: ${updateError.message}`);
    }

    console.log(`Book ID: ${bookId} successfully returned.`);
    return updateData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}