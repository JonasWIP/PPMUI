// Simple test script for the ProjectsApiClient
import { projectsApi } from './lib/projectsApi';

async function testApiClient() {
  console.log('Testing ProjectsApiClient...');
  
  try {
    // Test the listProjects method
    console.log('Calling projectsApi.listProjects()...');
    const projects = await projectsApi.listProjects();
    console.log('Response:', JSON.stringify(projects, null, 2));
    console.log('Test successful!');
  } catch (error) {
    console.error('Error testing API client:', error);
  }
}

testApiClient();