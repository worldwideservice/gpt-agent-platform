/**
 * Refine Auth Provider для интеграции с NextAuth
 */

import { AuthProvider } from "@refinedev/core";
import { auth } from "@/auth";
import { logger } from "@/lib/utils";

/**
 * Проверяет авторизацию пользователя
 */
export const authProvider: AuthProvider = {
  check: async () => {
    try {
      const session = await auth();

      if (session?.user) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
        error: {
          message: "Не авторизовано",
          name: "Unauthenticated",
        },
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: "/login",
        logout: true,
        error: {
          message: "Ошибка проверки авторизации",
          name: "AuthError",
        },
      };
    }
  },

  onError: async (error) => {
    logger.error("[AuthProvider] Error", error instanceof Error ? error : new Error(String(error)), { status: error?.status });

    if (error?.status === 401) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }

    return { error };
  },

  getIdentity: async () => {
    try {
      const session = await auth();

      if (!session?.user) {
        return null;
      }

      return {
        id: session.user.id,
        name: session.user.name || undefined,
        email: session.user.email || undefined,
        avatar: session.user.image || undefined,
      };
    } catch (error) {
      logger.error("[AuthProvider] Error getting identity", error instanceof Error ? error : new Error(String(error)));
      return null;
    }
  },

  login: async ({ email, password, providerName, remember }) => {
    // NextAuth обрабатывает логин через свой API route
    // Этот метод используется только для UI библиотек, которые требуют его
    // Реальная авторизация происходит через NextAuth

    if (providerName === "credentials") {
      try {
        const response = await fetch("/api/auth/callback/credentials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
          credentials: "include",
        });

        if (response.ok) {
          return {
            success: true,
          };
        }

        return {
          success: false,
          error: {
            message: "Неверный email или пароль",
            name: "LoginError",
          },
        };
      } catch (error) {
        return {
          success: false,
          error: {
            message: "Ошибка входа",
            name: "LoginError",
          },
        };
      }
    }

    // Для OAuth провайдеров
    if (providerName) {
      window.location.href = `/api/auth/signin/${providerName}`;
      return {
        success: true,
      };
    }

    return {
      success: false,
      error: {
        message: "Не указан провайдер авторизации",
        name: "LoginError",
      },
    };
  },

  logout: async () => {
    try {
      await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Ошибка выхода",
          name: "LogoutError",
        },
      };
    }
  },

  register: async ({ email, password, providerName }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      if (response.ok) {
        return {
          success: true,
        };
      }

      const errorData = await response.json().catch(() => ({}));

      return {
        success: false,
        error: {
          message: errorData.error || "Ошибка регистрации",
          name: "RegisterError",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Ошибка регистрации",
          name: "RegisterError",
        },
      };
    }
  },

  forgotPassword: async ({ email }) => {
    try {
      const response = await fetch("/api/auth/reset-password/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: {
          message: "Не удалось отправить письмо для восстановления пароля",
          name: "ForgotPasswordError",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Ошибка восстановления пароля",
          name: "ForgotPasswordError",
        },
      };
    }
  },

  updatePassword: async ({ password, confirmationPassword }) => {
    if (password !== confirmationPassword) {
      return {
        success: false,
        error: {
          message: "Пароли не совпадают",
          name: "UpdatePasswordError",
        },
      };
    }

    try {
      const response = await fetch("/api/auth/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (response.ok) {
        return {
          success: true,
        };
      }

      return {
        success: false,
        error: {
          message: "Не удалось обновить пароль",
          name: "UpdatePasswordError",
        },
      };
    } catch (error) {
      return {
        success: false,
        error: {
          message: "Ошибка обновления пароля",
          name: "UpdatePasswordError",
        },
      };
    }
  },
};

