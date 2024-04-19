"use server";

const {
  getAccounts,
  getCourses,
  getEnrollmentsInCourse,
  getOptions,
  getUsersInAccount,
} = require("node-canvas-api");

export async function getAllAccounts() {
  return getAccounts();
}

export async function getAllUsers(account: number) {
  if (!account) {
    const allAcounts = await getAccounts();
    const users = await Promise.all(
      allAcounts.map((account: any) => getUsersInAccount(account.id))
    );
    return users.flat();
  } else {
    const users = await getUsersInAccount(account);
    return users;
  }
}

/*
example of an enrollment object:
{
associated_user_id: null
course_id: 16
course_integration_id: null
course_section_id: 8
created_at: "2024-04-17T09:42:26Z"
end_at: null
enrollment_state: "active"
grades: {html_url: 'https://canvas.juacs.org/courses/16/grades/26', current_grade: null, current_score: null, final_grade: null, final_score: 10.81, …}
html_url: "https://canvas.juacs.org/courses/16/users/26"
id: 97
last_activity_at: "2024-04-17T10:22:27Z"
last_attended_at: null
limit_privileges_to_course_section: false
role: "StudentEnrollment"
role_id: 11
root_account_id: 1
section_integration_id: null
sis_account_id: null
sis_course_id: "TT-01"
sis_import_id: null
sis_section_id: null
sis_user_id: "abdelaziz.belhaj@hotmail.com"
start_at: null
total_activity_time: 121
type: "StudentEnrollment"
updated_at: "2024-04-17T09:58:45Z"
user: {id: 26, name: 'Abdelaziz BELHAJ', created_at: '2024-03-25T09:45:59Z', sortable_name: 'BELHAJ, Abdelaziz', short_name: 'Abdelaziz BELHAJ', …}
user_id: 26
}
*/

export async function giveMeEnrollments() {
  // const allUsers = await getUsersInAccount(1);
  // const enrollments = await Promise.all(
  //   allUsers.map((user: any) => get(user.id)) // missing api for enrollments by user
  // );
  // return enrollments.flat();

  // multiple enrollments for the same user are listed seperately
  const courses = await getCourses(1);
  const enrollments = await Promise.all(
    courses.map((course: any) => getEnrollmentsInCourse(course.id))
  );

  // group enrollments by user
  const enrollmentsByUser = enrollments.flat().reduce((acc, enrollment) => {
    const { user, ...rest } = enrollment;
    // console.log(`USER IS:`, user);
    // console.log(`-----------------------`);
    // console.log(`-----------------------`);
    // console.log(`ENROLLMENT IS:`, rest);
    // console.log('');
    // console.log('');

    if (!acc[enrollment.id]) {
      acc[enrollment.id] = {
        user: user,
        enrollments: [],
      };
    }
    acc[enrollment.id].enrollments.push(rest);

    return acc;
  }, {});
  return enrollmentsByUser;
}
