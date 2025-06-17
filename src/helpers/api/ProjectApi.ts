import { APIResponse } from '@playwright/test';
import { BaseTestRailApi } from './BaseTestRailApi';
import logger from '../../utils/Logger';
import { ProjectData } from '../../data/ProjectData';

/**
 * TestRail Project API Helper Class
 * This class provides methods for project-related operations in TestRail
 */
export class ProjectApi extends BaseTestRailApi {
  /**
   * Create a new project in TestRail
   * @param projectData Project data object
   * @returns API response with created project data
   */
  async createProject(projectData: ProjectData): Promise<APIResponse> {
    const url = this.buildUrl('add_project');
    
    logger.info(`API Call: POST ${url}`);
    logger.info(`Creating project: ${projectData.name}`);
    
    const response = await this.apiContext.post(url, {
      data: {
        name: projectData.name,
        announcement: projectData.announcement || '',
        show_announcement: projectData.showAnnouncement || false,
      }
    });
    
    logger.info(`API Response: Status ${response.status()} for POST ${url}`);
    
    return response;
  }

  /**
   * Get project details by ID
   * @param projectId Project ID
   * @returns API response with project data
   */
  async getProject(projectId: number): Promise<APIResponse> {
    const url = this.buildUrl(`get_project/${projectId}`);
    
    logger.info(`API Call: GET ${url}`);
    
    const response = await this.apiContext.get(url);
    
    logger.info(`API Response: Status ${response.status()} for GET ${url}`);
    
    return response;
  }
  /**
   * Update an existing project
   * @param projectId Project ID to update
   * @param projectData Project data to update
   * @returns API response with updated project data
   */
  async updateProject(projectId: number, projectData: ProjectData): Promise<APIResponse> {
    // API accepts boolean values directly
    const url = this.buildUrl(`update_project/${projectId}`);
    
    logger.info(`API Call: POST ${url}`);
    logger.info(`Updating project ID: ${projectId} with data: ${JSON.stringify(projectData)}`);
    
    const data = {
      name: projectData.name,
      announcement: projectData.announcement,
      show_announcement: projectData.showAnnouncement,
      is_completed: projectData.isCompleted
    };
    
    const response = await this.apiContext.post(url, {
      data
    });
    
    logger.info(`API Response: Status ${response.status()} for POST ${url}`);
    
    return response;
  }

  /**
   * Delete a project
   * @param projectId Project ID to delete
   * @returns API response
   */
  async deleteProject(projectId: number): Promise<APIResponse> {
    const url = this.buildUrl(`delete_project/${projectId}`);
    
    logger.info(`API Call: POST ${url}`);
    logger.info(`Deleting project ID: ${projectId}`);
    
    const response = await this.apiContext.post(url, {});
    
    logger.info(`API Response: Status ${response.status()} for POST ${url}`);
    
    return response;
  }

  /**
   * Get all projects
   * @returns API response with list of projects
   */
  async getAllProjects(): Promise<APIResponse> {
    const url = this.buildUrl('get_projects');
    
    logger.info(`API Call: GET ${url}`);
    
    const response = await this.apiContext.get(url);
    
    logger.info(`API Response: Status ${response.status()} for GET ${url}`);
    
    return response;
  }
}
