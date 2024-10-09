import supabase from "@/utils/supabase";

export const addAssignedToStudent = async ({ studentId, bookId }) => {
  try {
    const { data, error } = await supabase
      .from('assignToStudent')
      .select('*')
      .eq('assignedBookId', bookId)

    if (error) {
      throw new Error("error assignToStudent", error)
    }

    const assignedToStudent = data[0].assignedStudents || []
    if (assignedToStudent.length === 0) {
      const { data: updateData, error: updateError } = await supabase
        .from('assignToStudent')
        .update({ assignedStudents: [studentId] })
        .eq('assignedBookId', bookId)

      if (updateError) {
        throw new Error("error upgate assignToStudent", updateError)
      }

      return updateData;
    }
    console.log(assignedToStudent);


    const isDuplicated = assignedToStudent.includes(studentId)
    if (!isDuplicated) {
      assignedToStudent.push(studentId)

      const { data: updateData, error: updateError } = await supabase
        .from('assignToStudent')
        .update({
          assignedStudents: assignedToStudent

        })
        .eq('assignedBookId', bookId)

      if (updateError) {
        throw new Error("error upgate issue book", updateError)
      }
      return updateData;
    } else {
      console.log(`Duplicate Student ID: ${studentId}`);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const removeAssignedToStudent = async ({ studentId, bookId }) => {
  try {
    const { data, error } = await supabase
      .from('assignToStudent')
      .select('*')
      .eq('assignedBookId', bookId)
    if (error) {
      throw new Error("error assignToStudent", error)
    }

    const assignedBookToStudent = data[0].assignedStudents || []
    console.log("assignedBookToStudent", assignedBookToStudent);

    if (assignedBookToStudent.length === 0) {
      console.log(`No Student have been assigned a book ${bookId}`);
      return;
    }

    const isStudentPresent = assignedBookToStudent.includes(studentId)
    console.log("isStudentPresent", isStudentPresent);
    if (!isStudentPresent) {
      console.log(`Student ID ${studentId} not found in the list of assigned students.`);
      return;
    }

    const updatedStudents = assignedBookToStudent.filter((id) => id !== studentId)
    console.log("updatedStudents", updatedStudents);
    const { data: updateData, error: updateError } = await supabase
      .from('assignToStudent')
      .update({ assignedStudents: updatedStudents })
      .eq('assignedBookId', bookId)

    if (updateError) {
      throw new Error("error upgate issue book", updateError)
    }
    console.log(`Student ID ${studentId} has been removed from book`);
    return updateData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}