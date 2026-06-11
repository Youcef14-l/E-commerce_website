"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="inline-block mb-12">
          <span className="text-2xl font-serif font-bold tracking-wider">LUXE</span>
        </Link>

        {!submitted ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-serif font-medium tracking-tight mb-3">
                Reset your password
              </h1>
              <p className="text-muted-foreground">
                Enter your email address and we&apos;ll send you instructions to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl bg-secondary border-0"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 group"
              >
                Send Reset Link
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </form>
          </>
        ) : (
          /* Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-serif font-medium tracking-tight mb-3">
              Check your email
            </h1>
            <p className="text-muted-foreground mb-8">
              We&apos;ve sent a password reset link to{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Didn&apos;t receive the email? Check your spam folder or</p>
              <Button
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="rounded-full"
              >
                Try another email
              </Button>
            </div>
          </motion.div>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
