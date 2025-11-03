declare module '@storybook/nextjs-vite' {
 export type Meta<TArgs = unknown> = {
 component?: unknown
 args?: TArgs
 parameters?: Record<string, unknown>
 render?: (...args: unknown[]) => unknown
 [key: string]: unknown
 }

 export type StoryObj<TArgs = unknown> = {
 args?: Partial<TArgs>
 name?: string
 parameters?: Record<string, unknown>
 play?: (...args: unknown[]) => unknown | Promise<unknown>
 render?: (...args: unknown[]) => unknown
 [key: string]: unknown
 }
}

declare module 'storybook/test' {
 export function fn<T = unknown>(impl?: (...args: unknown[]) => T): (...args: unknown[]) => T
}
