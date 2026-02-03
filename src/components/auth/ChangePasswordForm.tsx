'use client'

import React, { useEffect, useState } from 'react'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Button from '@/components/ui/button/Button'
import { changePasswordApi } from '@/api/auth/changePassword'
import { useRouter } from 'next/navigation'

export default function ChangePasswordForm() {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState(false)

  useEffect(() => {
    localStorage.removeItem('forgot_email')
  }, [])

  const validatePasswords = () => {
    if (!currentPassword) {
      return 'Current password is required.'
    }
    if (!newPassword || newPassword.length < 6) {
      return 'New password must be at least 6 characters.'
    }
    if (newPassword !== confirmPassword) {
      return 'Passwords do not match.'
    }
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched(true)
    setError('')

    const validationError = validatePasswords()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const resetToken = localStorage.getItem('reset_token') || ''

      const res = await changePasswordApi({
        currentPassword,
        newPassword,
        resetToken,
      })

      if (res.status) {
        router.push('/password-complete?success=1')
      } else {
        setError(res.message || 'Unable to change password')
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const passwordError = touched && validatePasswords()

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-6">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90">
              Change Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your current and new password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className="mb-4">
              <Label>
                Current Password <span className="text-error-500">*</span>
              </Label>
              <Input
                type="password"
                value={currentPassword}
                placeholder="Enter current password"
                onChange={(e) => {
                  setCurrentPassword(e.target.value)
                  setTouched(true)
                }}
              />
            </div>

            {/* New Password */}
            <div className="mb-4">
              <Label>
                New Password <span className="text-error-500">*</span>
              </Label>
              <Input
                type="password"
                value={newPassword}
                placeholder="Enter new password"
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  setTouched(true)
                }}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <Label>
                Confirm Password <span className="text-error-500">*</span>
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                placeholder="Confirm new password"
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setTouched(true)
                }}
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
