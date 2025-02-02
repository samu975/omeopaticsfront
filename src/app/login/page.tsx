'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import useUserStore from '@/store/userStore'

const LoginPage = () => {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    cedula: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!credentials.cedula || !credentials.password) {
      toast.error('Por favor complete todos los campos')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        // Store user data in localStorage and Zustand
        localStorage.setItem('user', JSON.stringify(data))
        setUser(data)
        
        toast.success('Login exitoso', {
          onClose: () => router.push('/'),
          autoClose: 2000
        })
      } else {
        toast.error(data.message || 'Credenciales inválidas')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 text-white">
      <div className="max-w-md w-full bg-base-100 rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Cédula</span>
            </label>
            <input
              type="text"
              name="cedula"
              className="input input-bordered w-full"
              value={credentials.cedula}
              onChange={handleChange}
              placeholder="Ingrese su cédula"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Contraseña</span>
            </label>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <ToastContainer position="bottom-center" />
      </div>
    </div>
  )
}

export default LoginPage