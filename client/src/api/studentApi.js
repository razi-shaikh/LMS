import supabase from "@/utils/supabase";

export const getStudents = async () => {

  const { data: students, error } = await supabase
    .from('students')
    .select('*')

  if (error) {
    console.error('getBooks Error', error)
    throw new Error("Error while getting list of books. Try again later.");
  }
  return students
}

export const createStudent = async (student) => {
  let pictureUrl = null;
  if (student.picture) {
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('student-picture')
      .upload(`public/${Date.now()}-${student.picture.name}`, student.picture);

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error("Error while uploading the picture. Try again later.");
    }

    const { data: publicUrl } = supabase
      .storage
      .from('student-picture')
      .getPublicUrl(uploadData.path);
    console.log("publicUrl", publicUrl);
    pictureUrl = publicUrl.publicUrl;
  }

  const { data, error } = await supabase
    .from('students')
    .insert([{
      ...student,
      picture: pictureUrl
    }])
    .select();

  if (error) {
    console.error('createStudent Error', error);
    throw new Error("Error while creating student. Try again later.");
  }

  const studentId = data[0].student_id;

  const { error: issueBookError } = await supabase
    .from('issueBook')
    .insert([{
      student_id: studentId,
      issueBooks: []
    }])
    .select();


  if (issueBookError) {
    console.error('createIssueBook Error', issueBookError);
    throw new Error("Error while creating issue record. Try again later.");
  }

  return { message: "Student Created Sussfully" };
};

export const updateStudent = async ({ studentId, student }) => {
  console.log(studentId, student);
  try {
    if (student.picture) {
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('student-picture')
        .upload(`public/${Date.now()}-${student.picture.name}`, student.picture);
      if (uploadError) {
        console.error('Upload Error:', uploadError);
        throw new Error("Error while uploading the picture. Try again later.");
      }
      console.log("uploadData", uploadData);
      const { data: publicUrl } = supabase
        .storage
        .from('student-picture')
        .getPublicUrl(uploadData.path);

      console.log("publicUrl", publicUrl);
      student.picture = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from('students')
      .update([{ ...student }])
      .eq('student_id', studentId)

    if (error) {
      console.error('updateStudent Error', error)
      throw new Error("Error while updating student. Try again later.");
    }
    console.log(data);

    return { message: "Student Updated Successfully" };
  } catch (error) {
    console.error('updateStudent Error', error)
    throw new Error("Error while updating student. Try again later.");
  }
}