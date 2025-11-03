declare module 'swagger-jsdoc' {
 export interface Options {
 definition: Record<string, unknown>
 apis: string | readonly string[]
 }

 const swaggerJsdoc: (options: Options) => unknown

 export default swaggerJsdoc
}
