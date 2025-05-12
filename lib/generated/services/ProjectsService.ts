/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProjectsService {
    /**
     * Initialize a project
     * Initialize a project with provided configuration and commands
     * @returns any Project initialized successfully
     * @throws ApiError
     */
    public static postProjectsInitialize({
        projectName,
        requestBody,
    }: {
        /**
         * Name of the project to initialize. Replace ":projectName" in the URL with your actual project name.
         */
        projectName: string,
        requestBody: {
            commands?: Array<string>;
            config?: {
                repoUrl?: string;
                isTemplate?: boolean;
                projectName?: string;
                deployment?: {
                    dev?: Array<string>;
                };
                previewUrl?: string;
                liveUrl?: string;
            };
            initGit?: boolean;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
        projectName?: string;
        projectPath?: string;
        config?: {
            repoUrl?: string;
            isTemplate?: boolean;
            projectName?: string;
            deployment?: {
                dev?: Array<string>;
            };
            previewUrl?: string;
            liveUrl?: string;
        };
        commands?: Array<string>;
        output?: Array<{
            command?: string;
            stdout?: string;
            stderr?: string;
            exitCode?: number;
            duration?: number;
        }>;
        gitInitialized?: boolean;
        nextSteps?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{projectName}/initialize',
            path: {
                'projectName': projectName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Deploy a project
     * Deploy a project by committing and pushing changes to trigger the build pipeline
     * @returns any Project deployed successfully
     * @throws ApiError
     */
    public static postProjectsDeploy({
        projectName,
        requestBody,
    }: {
        /**
         * Name of the project to deploy
         */
        projectName: string,
        requestBody: {
            commitMessage: string;
            /**
             * Branch to push to (optional, defaults to current branch)
             */
            branch?: string;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
        projectName?: string;
        gitStatus?: {
            hasChanges?: boolean;
            branch?: string;
        };
        commit?: {
            hash?: string;
            message?: string;
        };
        push?: {
            success?: boolean;
            remote?: string;
            branch?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{projectName}/deploy',
            path: {
                'projectName': projectName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Start a project
     * Start a project by running the development commands specified in its config.jaison file
     * @returns any Project started successfully
     * @throws ApiError
     */
    public static postProjectsStart({
        projectName,
    }: {
        /**
         * Name of the project to start
         */
        projectName: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
        projectName?: string;
        commands?: Array<string>;
        output?: Array<{
            command?: string;
            stdout?: string;
            stderr?: string;
            exitCode?: number;
            duration?: number;
        }>;
        duration?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{projectName}/start',
            path: {
                'projectName': projectName,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Stop a project
     * Stop a project by terminating any running development processes
     * @returns any Project stopped successfully
     * @throws ApiError
     */
    public static postProjectsStop({
        projectName,
    }: {
        /**
         * Name of the project to stop
         */
        projectName: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
        projectName?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/{projectName}/stop',
            path: {
                'projectName': projectName,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * List all projects
     * List all projects in the projects directory
     * @returns any Projects retrieved successfully
     * @throws ApiError
     */
    public static getProjects(): CancelablePromise<{
        status?: string;
        message?: string;
        directories?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Clone or fork a repository
     * Clone or fork a repository into the projects folder
     * @returns any Repository cloned or forked successfully
     * @throws ApiError
     */
    public static postProjectsClone({
        requestBody,
    }: {
        requestBody: {
            repositoryUrl: string;
            projectName?: string;
            /**
             * When true, creates a fork instead of a simple clone
             */
            forkMode?: boolean;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
        projectName?: string;
        projectPath?: string;
        isFork?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/clone',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Create a new project
     * Create a new project with given instructions and name
     * @returns any Project created successfully
     * @throws ApiError
     */
    public static postProjectsCreate({
        requestBody,
    }: {
        requestBody: {
            projectName: string;
            instructions?: string;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
        projectName?: string;
        projectPath?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Delete a project
     * Delete a project from the projects folder
     * @returns any Project deleted successfully
     * @throws ApiError
     */
    public static deleteProjects({
        projectName,
    }: {
        /**
         * Name of the project to delete
         */
        projectName: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/projects/{projectName}',
            path: {
                'projectName': projectName,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get project configuration
     * Get the configuration for a specific project
     * @returns any Project configuration retrieved successfully
     * @throws ApiError
     */
    public static getProjectsConfig({
        projectName,
    }: {
        /**
         * Name of the project
         */
        projectName: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
        config?: {
            repoUrl?: string;
            isTemplate?: boolean;
            projectName?: string;
            deployment?: {
                dev?: Array<string>;
                live?: Array<string>;
            };
            previewUrl?: string;
            liveUrl?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/{projectName}/config',
            path: {
                'projectName': projectName,
            },
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Update project configuration
     * Update the configuration for a specific project
     * @returns any Project configuration updated successfully
     * @throws ApiError
     */
    public static putProjectsConfig({
        projectName,
        requestBody,
    }: {
        /**
         * Name of the project
         */
        projectName: string,
        requestBody: {
            repoUrl?: string;
            isTemplate?: boolean;
            projectName?: string;
            deployment?: {
                dev?: Array<string>;
                live?: Array<string>;
            };
            previewUrl?: string;
            liveUrl?: string;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/projects/{projectName}/config',
            path: {
                'projectName': projectName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not found`,
                500: `Internal server error`,
            },
        });
    }
}
