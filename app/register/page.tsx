import { RegisterHeader } from "@/components/auth/register-header"
import { RegisterForm } from "@/components/auth/register-form"
import { RegisterFooter } from "@/components/auth/register-footer"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary/5 via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <RegisterHeader />
        <RegisterForm />
        <RegisterFooter />
      </div>
    </div>
  )
}
