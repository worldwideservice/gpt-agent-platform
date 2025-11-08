interface AuthLayoutProps {
 children: React.ReactNode
}

// Prevent static generation
export const dynamic = 'force-dynamic'

const AuthLayout = ({ children }: AuthLayoutProps) => {
 return (
 <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
 {children}
 </div>
 )
}

export default AuthLayout






