import type { Config } from 'tailwindcss'

const config: Config = {
 darkMode: ['class'],
 content: [
 './pages/**/*.{js,ts,jsx,tsx,mdx}',
 './components/**/*.{js,ts,jsx,tsx,mdx}',
 './app/**/*.{js,ts,jsx,tsx,mdx}',
 './lib/**/*.{js,ts,jsx,tsx,mdx}',
 ],
 theme: {
 	extend: {
 		colors: {
 			custom: {
 				'50': '#f0f9ff',
 				'100': '#e0f2fe',
 				'200': '#bae6fd',
 				'300': '#7dd3fc',
 				'400': '#38bdf8',
 				'500': '#0ea5e9',
 				'600': '#0284c7',
 				'700': '#0369a1',
 				'800': '#075985',
 				'900': '#0c4a6e'
 			},
 			primary: {
 				'50': '#eff6ff',
 				'100': '#dbeafe',
 				'200': '#bfdbfe',
 				'300': '#93c5fd',
 				'400': '#60a5fa',
 				'500': '#3b82f6',
 				'600': '#2563eb',
 				'700': '#1d4ed8',
 				'800': '#1e40af',
 				'900': '#1e3a8a',
 				DEFAULT: 'hsl(var(--primary))',
 				foreground: 'hsl(var(--primary-foreground))'
 			},
 			gray: {
 				'50': '#f9fafb',
 				'100': '#f3f4f6',
 				'200': '#e5e7eb',
 				'300': '#d1d5db',
 				'400': '#9ca3af',
 				'500': '#6b7280',
 				'600': '#4b5563',
 				'700': '#374151',
 				'800': '#1f2937',
 				'900': '#111827'
 			},
 			background: 'hsl(var(--background))',
 			foreground: 'hsl(var(--foreground))',
 			card: {
 				DEFAULT: 'hsl(var(--card))',
 				foreground: 'hsl(var(--card-foreground))'
 			},
 			popover: {
 				DEFAULT: 'hsl(var(--popover))',
 				foreground: 'hsl(var(--popover-foreground))'
 			},
 			secondary: {
 				DEFAULT: 'hsl(var(--secondary))',
 				foreground: 'hsl(var(--secondary-foreground))'
 			},
 			muted: {
 				DEFAULT: 'hsl(var(--muted))',
 				foreground: 'hsl(var(--muted-foreground))'
 			},
 			accent: {
 				DEFAULT: 'hsl(var(--accent))',
 				foreground: 'hsl(var(--accent-foreground))'
 			},
 			destructive: {
 				DEFAULT: 'hsl(var(--destructive))',
 				foreground: 'hsl(var(--destructive-foreground))'
 			},
 			border: 'hsl(var(--border))',
 			input: 'hsl(var(--input))',
 			ring: 'hsl(var(--ring))',
 			chart: {
 				'1': 'hsl(var(--chart-1))',
 				'2': 'hsl(var(--chart-2))',
 				'3': 'hsl(var(--chart-3))',
 				'4': 'hsl(var(--chart-4))',
 				'5': 'hsl(var(--chart-5))'
 			}
 		},
 		borderRadius: {
 			lg: 'var(--radius)',
 			md: 'calc(var(--radius) - 2px)',
 			sm: 'calc(var(--radius) - 4px)'
 		},
 		fontFamily: {
 			sans: [
 				'Inter',
 				'ui-sans-serif',
 				'system-ui',
 				'sans-serif'
 			]
 		},
		keyframes: {
			'accordion-down': {
				from: {
					height: '0'
				},
				to: {
					height: 'var(--radix-accordion-content-height)'
				}
			},
			'accordion-up': {
				from: {
					height: 'var(--radix-accordion-content-height)'
				},
				to: {
					height: '0'
				}
			},
			aurora: {
				from: {
					backgroundPosition: '50% 50%, 50% 50%'
				},
				to: {
					backgroundPosition: '350% 50%, 350% 50%'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			aurora: 'aurora 60s linear infinite'
		}
 	}
 },
 plugins: [require("tailwindcss-animate")],
}
export default config

