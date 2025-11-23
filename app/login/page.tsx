import { LoginHeader } from "@/components/auth/login-header"
import { LoginForm } from "@/components/auth/login-form"
import { LoginFooter } from "@/components/auth/login-footer"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <LoginHeader />
        <LoginForm />
        <LoginFooter />
      </div>
    </div>
  )
}
