import type { Preview } from '@storybook/nextjs-vite'
import '../app/globals.css'

const preview: Preview = {
 parameters: {
 controls: {
 matchers: {
 color: /(background|color)$/i,
 date: /Date$/i,
 },
 },

 a11y: {
 test: 'todo'
 },

 docs: {
 toc: true,
 },

 nextjs: {
 appDirectory: true,
 },
 },
};

export default preview;