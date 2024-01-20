import React, { useState } from 'react'
import { EyeSVG } from './svg/EyeSVG'

interface InputFormProps {
  label: string
  value: string
  setValue: (newValue: string) => void
  error?: string
  password?: boolean
}

export const InputForm: React.FC<InputFormProps> = ({
  label,
  value,
  setValue,
  error,
  password,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <>
      <label htmlFor={label} className='text-sm font-semibold text-zinc-400'>
        {label}
      </label>
      <div className='relative flex flex-col'>
        <input
          value={value}
          id={label}
          onChange={handleInputChange}
          type={showPassword || !password ? 'text' : 'password'}
          className={`h-8 w-full border border-zinc-900 bg-transparent px-2 outline-none focus:border-blue-600 ${
            error && '!border-red-500'
          }`}
        />
        {password && (
          <span
            onClick={() => {
              setShowPassword(!showPassword)
            }}
            className='absolute bottom-0 right-0 cursor-pointer p-1.5 text-zinc-300'
          >
            <EyeSVG />
          </span>
        )}
      </div>
      {error && <p className='-my-2 text-xs text-red-500'>{error}</p>}
    </>
  )
}
