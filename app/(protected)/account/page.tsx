"use client";

import { useCallback, useEffect, useState } from "react";
import {
  KwidButton,
  KwidInput,
  KwidSwitch,
  KwidSection,
} from "@/components/kwid";

// Prevent static generation for client component
export const dynamic = 'force-dynamic';

interface AccountSettings {
  stopOnHumanReply?: boolean;
}

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  locale: string | null;
}

const AccountPage = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [settings, setSettings] = useState<AccountSettings>({});
  const [stopOnHumanReply, setStopOnHumanReply] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAccountData = useCallback(async () => {
    try {
      const [userResponse, settingsResponse] = await Promise.all([
        fetch("/api/account"),
        fetch("/api/organization/settings"),
      ]);

      if (userResponse.ok) {
        const userPayload = (await userResponse.json()) as {
          success: boolean;
          data: UserData;
        };
        if (userPayload.success) {
          setUser(userPayload.data);
        }
      }

      if (settingsResponse.ok) {
        const settingsPayload = (await settingsResponse.json()) as {
          success: boolean;
          data: { settings: AccountSettings };
        };
        if (settingsPayload.success) {
          setSettings(settingsPayload.data.settings);
          setStopOnHumanReply(
            settingsPayload.data.settings.stopOnHumanReply ?? false,
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch account data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountData();
  }, [fetchAccountData]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/organization/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stopOnHumanReply,
        }),
      });

      if (!response.ok) {
        throw new Error("Не удалось сохранить настройки");
      }

      const payload = (await response.json()) as { success: boolean };

      if (!payload.success) {
        throw new Error("Не удалось сохранить настройки");
      }

      alert("Настройки успешно сохранены");
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Не удалось сохранить настройки. Попробуйте еще раз.");
    } finally {
      setIsSaving(false);
    }
  }, [stopOnHumanReply]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            Настройки аккаунта
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Загрузка...
          </p>
        </header>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Настройки аккаунта
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Управление поведением AI-агентов и уведомлениями
        </p>
      </header>

      <KwidSection
        title="Профиль пользователя"
        description="Информация о вашем аккаунте"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <KwidInput
            label="Имя"
            value={user?.fullName ?? ""}
            placeholder="Ваше имя"
            disabled
          />
          <KwidInput
            label="Email"
            type="email"
            value={user?.email ?? ""}
            placeholder="email@example.com"
            disabled
          />
        </div>
      </KwidSection>

      <KwidSection
        title="Общие настройки"
        description="Если включить, агенты перестанут отвечать, как только человек отправит сообщение в этом чате."
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Останавливать агентов ИИ при ответе человека
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Агенты автоматически отключаются после сообщения менеджера.
              </p>
            </div>
            <KwidSwitch
              checked={stopOnHumanReply}
              onCheckedChange={setStopOnHumanReply}
            />
          </div>

          <div className="fi-form-actions pt-4">
            <KwidButton
              onClick={handleSave}
              disabled={isSaving}
              variant="primary"
              size="md"
            >
              {isSaving ? "Сохранение…" : "Сохранить изменения"}
            </KwidButton>
          </div>
        </div>
      </KwidSection>
    </div>
  );
};

export default AccountPage;
