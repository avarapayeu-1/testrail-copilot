import { faker } from '@faker-js/faker';

/**
 * Project data structure
 */
export interface ProjectData {
  name: string;
  announcement?: string;
  showAnnouncement?: boolean;
  isCompleted?: boolean;
}

/**
 * Generate random project data
 * @returns Random project data object
 */
export function generateProjectData(): ProjectData {
  return {
    name: `Test Project ${faker.string.uuid().substring(0, 8)}`,
    announcement: faker.lorem.sentence(),
    showAnnouncement: faker.datatype.boolean(),
  };
}

/**
 * Generate random project update data
 * @returns Random project update data
 */
export function generateProjectUpdateData(): ProjectData {
  return {
    name: `Updated Project ${faker.string.uuid().substring(0, 8)}`,
    announcement: faker.lorem.paragraph(),
    showAnnouncement: faker.datatype.boolean(),
  };
}
