export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project-admin",
  MEMBER: "member",
};

export const AvailableUserRole = Object.values(UserRolesEnum); //creates the array of the enum

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  REVIEW: "review",
  DONE: "done",
};

export const AvailableTaskStatus = Object.values(TaskStatusEnum);
