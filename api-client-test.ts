/**
 * Simple test to verify the ProjectsApiClient is working with the generated types
 */
import { projectsApi } from './lib/projectsApi';
import { ProjectsService } from './lib/generated/services/ProjectsService';

// Log the available methods from the generated ProjectsService
console.log('Available methods in ProjectsService:');
console.log(Object.keys(ProjectsService).join(', '));

// Log the available methods from the projectsApi client
console.log('\nAvailable methods in projectsApi:');
console.log(Object.keys(projectsApi).join(', '));

// This is just a type check, not an actual API call
const typeCheck = async () => {
  try {
    // Check that the types are compatible
    type ProjectsServiceListResponse = Awaited<ReturnType<typeof ProjectsService.getProjects>>;
    type ProjectsApiListResponse = Awaited<ReturnType<typeof projectsApi.listProjects>>;
    
    // This should compile if the types are compatible
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const testCompatibility = (response: ProjectsServiceListResponse): ProjectsApiListResponse => response;
    
    console.log('Type check passed: ProjectsApiClient is compatible with generated types');
  } catch (error) {
    console.error('Type check failed:', error);
  }
};

typeCheck();