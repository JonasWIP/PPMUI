/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ChatService {
    /**
     * Create a new chat task
     * Create a new chat task with the provided configuration and message
     * @returns any Chat task created successfully
     * @throws ApiError
     */
    public static postApiChatTasks({
        requestBody,
    }: {
        requestBody: {
            configuration?: {
                model?: string;
                temperature?: number;
                maxTokens?: number;
                apiKey?: string;
                apiEndpoint?: string;
            };
            text?: string;
            images?: Array<string>;
            newTab?: boolean;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
        taskId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tasks',
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
     * Get all chat tasks
     * Get a list of all chat tasks
     * @returns any Chat tasks retrieved successfully
     * @throws ApiError
     */
    public static getApiChatTasks(): CancelablePromise<{
        status?: string;
        message?: string;
        tasks?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/tasks',
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
     * Get chat task details
     * Get details for a specific chat task
     * @returns any Chat task details retrieved successfully
     * @throws ApiError
     */
    public static getApiChatTasks1({
        taskId,
    }: {
        /**
         * ID of the chat task
         */
        taskId: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
        exists?: boolean;
        isActive?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/tasks/{taskId}',
            path: {
                'taskId': taskId,
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
     * Resume a chat task
     * Resume a previously created chat task
     * @returns any Chat task resumed successfully
     * @throws ApiError
     */
    public static putApiChatTasksResume({
        taskId,
    }: {
        /**
         * ID of the chat task to resume
         */
        taskId: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/chat/tasks/{taskId}/resume',
            path: {
                'taskId': taskId,
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
     * Send a message to a task
     * Send a message to an existing chat task
     * @returns any Message sent successfully
     * @throws ApiError
     */
    public static postApiChatTasksMessages({
        taskId,
        requestBody,
    }: {
        /**
         * ID of the chat task
         */
        taskId: string,
        requestBody: {
            text?: string;
            images?: Array<string>;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
        messageId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tasks/{taskId}/messages',
            path: {
                'taskId': taskId,
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
     * Get all messages for a task
     * Get the message history for a specific chat task
     * @returns any Messages retrieved successfully
     * @throws ApiError
     */
    public static getApiChatTasksMessages({
        taskId,
    }: {
        /**
         * ID of the chat task
         */
        taskId: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
        messages?: Array<{
            id?: string;
            taskId?: string;
            text?: string;
            images?: Array<string>;
            timestamp?: string;
            sender?: 'user' | 'ai';
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/tasks/{taskId}/messages',
            path: {
                'taskId': taskId,
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
     * Press the primary button
     * Simulate pressing the primary button in the chat UI
     * @returns any Primary button pressed successfully
     * @throws ApiError
     */
    public static postApiChatTasksButtonPrimary({
        taskId,
    }: {
        /**
         * ID of the chat task
         */
        taskId: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tasks/{taskId}/button/primary',
            path: {
                'taskId': taskId,
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
     * Press the secondary button
     * Simulate pressing the secondary button in the chat UI
     * @returns any Secondary button pressed successfully
     * @throws ApiError
     */
    public static postApiChatTasksButtonSecondary({
        taskId,
    }: {
        /**
         * ID of the chat task
         */
        taskId: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/tasks/{taskId}/button/secondary',
            path: {
                'taskId': taskId,
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
     * Get the current configuration
     * Get the current configuration settings for the chat
     * @returns any Configuration retrieved successfully
     * @throws ApiError
     */
    public static getApiChatConfig(): CancelablePromise<{
        status?: string;
        message?: string;
        config?: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
            apiKey?: string;
            apiEndpoint?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/config',
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
     * Update the configuration
     * Update the configuration settings for the chat
     * @returns any Configuration updated successfully
     * @throws ApiError
     */
    public static putApiChatConfig({
        requestBody,
    }: {
        requestBody: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
            apiKey?: string;
            apiEndpoint?: string;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/chat/config',
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
     * Get custom instructions
     * Get the current custom instructions for the chat
     * @returns any Custom instructions retrieved successfully
     * @throws ApiError
     */
    public static getApiChatInstructions(): CancelablePromise<{
        status?: string;
        message?: string;
        instructions?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/instructions',
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
     * Update custom instructions
     * Update the custom instructions for the chat
     * @returns any Custom instructions updated successfully
     * @throws ApiError
     */
    public static putApiChatInstructions({
        requestBody,
    }: {
        requestBody: {
            instructions?: string;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/chat/instructions',
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
     * Get all profiles
     * Get a list of all API configuration profiles
     * @returns any Profiles retrieved successfully
     * @throws ApiError
     */
    public static getApiChatProfiles(): CancelablePromise<{
        status?: string;
        message?: string;
        profiles?: Array<string>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/profiles',
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
     * Create a new profile
     * Create a new API configuration profile
     * @returns any Profile created successfully
     * @throws ApiError
     */
    public static postApiChatProfiles({
        requestBody,
    }: {
        requestBody: {
            name: string;
        },
    }): CancelablePromise<{
        status?: string;
        message?: string;
        profileId?: string;
        name?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/chat/profiles',
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
     * Get the active profile
     * Get the currently active API configuration profile
     * @returns any Active profile retrieved successfully
     * @throws ApiError
     */
    public static getApiChatProfilesActive(): CancelablePromise<{
        status?: string;
        message?: string;
        activeProfile?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/profiles/active',
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
     * Set the active profile
     * Set the active API configuration profile
     * @returns any Profile activated successfully
     * @throws ApiError
     */
    public static putApiChatProfilesActivate({
        name,
    }: {
        /**
         * Name of the profile to activate
         */
        name: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/chat/profiles/{name}/activate',
            path: {
                'name': name,
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
     * Delete a profile
     * Delete an API configuration profile
     * @returns any Profile deleted successfully
     * @throws ApiError
     */
    public static deleteApiChatProfiles({
        name,
    }: {
        /**
         * Name of the profile to delete
         */
        name: string,
    }): CancelablePromise<{
        status?: string;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/chat/profiles/{name}',
            path: {
                'name': name,
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
     * Get extension status
     * Get the extension's ready status
     * @returns any Extension status retrieved successfully
     * @throws ApiError
     */
    public static getApiChatStatus(): CancelablePromise<{
        status?: string;
        message?: string;
        ready?: boolean;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/chat/status',
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
