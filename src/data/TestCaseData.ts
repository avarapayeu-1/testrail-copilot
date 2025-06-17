import { faker } from '@faker-js/faker';

/**
 * Test case data structure
 */
export interface TestCaseData {
  title: string;
  section_id: number;
  template_id?: number;
  type_id?: number;
  priority_id?: number;
  estimate?: string;
  milestone_id?: number;
  refs?: string;
  custom_preconds?: string;
  custom_steps?: string;
  custom_expected?: string;
}

/**
 * Generate random test case data
 * @param sectionId Section ID where the test case will be created
 * @returns Random test case data object
 */
export function generateTestCaseData(sectionId: number): TestCaseData {
  return {
    title: `Test Case ${faker.string.uuid().substring(0, 8)}`,
    section_id: sectionId,
    priority_id: faker.number.int({ min: 1, max: 4 }),
    type_id: faker.number.int({ min: 1, max: 7 }),
    estimate: `${faker.number.int({ min: 1, max: 10 })}m`,
    refs: faker.lorem.word(),
    custom_preconds: faker.lorem.paragraph(),
    custom_expected: faker.lorem.paragraph()
  };
}

/**
 * Generate random test case update data
 * @returns Random test case update data
 */
export function generateTestCaseUpdateData(): Partial<TestCaseData> {
  return {
    title: `Updated Test Case ${faker.string.uuid().substring(0, 8)}`,
    priority_id: faker.number.int({ min: 1, max: 4 }),
    estimate: `${faker.number.int({ min: 1, max: 10 })}m`,
    refs: faker.lorem.word(),
    custom_preconds: faker.lorem.paragraph(),
    custom_expected: faker.lorem.paragraph()
  };
}
