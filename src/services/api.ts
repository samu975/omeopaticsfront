import { User, Formula, Answer, FollowUp } from '../types/models';
import Cookies from 'js-cookie';

const API_URL = '/api';

const getHeaders = (includeContentType = false): HeadersInit => {
  const headers = new Headers();
  
  // Obtener el token de las cookies
  const token = Cookies.get('token');
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  if (includeContentType) {
    headers.append('Content-Type', 'application/json');
  }
  
  return headers;
};

// Servicios de Usuario
export const userService = {
  async login(cedula: string, password: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ cedula, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }

    const data = await response.json();
    // Guardar el token en las cookies
    Cookies.set('token', data.token, { expires: 7 }); // Expira en 7 días
    return data;
  },

  async register(userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al registrar usuario');
    }

    return response.json();
  },

  async getProfile(): Promise<User> {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener perfil');
    }

    return response.json();
  },

  async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return response.json();
  },

  async getUserById(userId: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuario');
    }

    return response.json();
  },

  async updateUser(userId: string, userData: Partial<User>): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar usuario');
    }

    return response.json();
  },

  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar usuario');
    }
  },
};

// Servicios de Fórmulas
export const formulaService = {
  async create(formulaData: Partial<Formula>): Promise<Formula> {
    const response = await fetch(`${API_URL}/formulas`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(formulaData),
    });

    if (!response.ok) {
      throw new Error('Error al crear fórmula');
    }

    return response.json();
  },

  async getAll(): Promise<Formula[]> {
    const response = await fetch(`${API_URL}/formulas`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener fórmulas');
    }

    return response.json();
  },

  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/formulas/${id}`);
    if (!res.ok) throw new Error('Error al obtener fórmula');
    return res.json();
  },

  async update(id: string, formulaData: Partial<Formula>): Promise<Formula> {
    const response = await fetch(`${API_URL}/formulas/${id}`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify(formulaData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar fórmula');
    }

    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/formulas/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al eliminar fórmula');
    }
  },

  async getByUserId(userId: string): Promise<Formula[]> {
    const response = await fetch(`${API_URL}/formulas/user/${userId}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener fórmulas del usuario');
    }

    return response.json();
  },

  async submitAnswers(id: string, answers: Answer[]): Promise<Formula> {
    const response = await fetch(`${API_URL}/formulas/${id}/answers`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      throw new Error('Error al enviar respuestas');
    }

    return response.json();
  },
};

// Servicios de Seguimiento
export const followUpService = {
  async create(followUpData: Partial<FollowUp>): Promise<FollowUp> {
    const response = await fetch(`${API_URL}/follow-ups`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(followUpData),
    });

    if (!response.ok) {
      throw new Error('Error al crear seguimiento');
    }

    return response.json();
  },

  async getAll(): Promise<FollowUp[]> {
    const response = await fetch(`${API_URL}/follow-ups`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener seguimientos');
    }

    return response.json();
  },

  async getById(id: string): Promise<FollowUp> {
    const response = await fetch(`${API_URL}/follow-ups/${id}`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener seguimiento');
    }

    return response.json();
  },
}; 