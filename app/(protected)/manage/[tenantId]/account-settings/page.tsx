"use client";

import { useEffect, useState } from "react";
import {
  KwidButton,
  KwidInput,
  KwidSection,
  KwidSwitch,
} from "@/components/kwid";

interface UserData {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
}

interface ChatPageProps {
  params: Promise<{ tenantId: string }>;
}

const AccountPage = ({ params }: ChatPageProps) => {
  const [resolvedParams, setResolvedParams] = useState<{
    tenantId: string;
  } | null>(null);
  const [user, setUser] = useState<UserData | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [stopOnHumanReply, setStopOnHumanReply] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/account");
        if (response.ok) {
          const data = (await response.json()) as {
            success: boolean;
            data: UserData;
          };
          if (data.success) {
            setUser(data.data);
            setFullName(data.data.fullName || "");
            setEmail(data.data.email || "");
          }
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
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

      if (response.ok) {
        alert("Настройки сохранены");
      } else {
        throw new Error("Не удалось сохранить настройки");
      }
    } catch (error) {
      console.error("Failed to save settings", error);
      alert("Ошибка сохранения настроек");
    } finally {
      setIsSaving(false);
    }
  };

  if (!resolvedParams || isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-y-8 py-8">
      <header className="fi-header flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="fi-header-heading text-2xl font-bold tracking-tight text-gray-950 dark:text-white sm:text-3xl">
          Настройки аккаунта
        </h1>
      </header>

      <div className="fi-section rounded-lg border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
        <header className="fi-section-header flex flex-col gap-3 px-6 py-4">
          <h3 className="fi-section-header-heading text-base font-semibold leading-6 text-gray-950 dark:text-white">
            Общие
          </h3>
        </header>
        <div className="fi-section-content p-6">
          <div className="fi-fo-field-wrp space-y-2">
            <div className="flex items-center gap-x-3 justify-between">
              <label className="fi-fo-field-wrp-label inline-flex items-center gap-x-3">
                <span className="text-sm font-medium leading-6 text-gray-950 dark:text-white">
                  Останавливать агентов ИИ при ответе человека
                </span>
              </label>
              <KwidSwitch
                checked={stopOnHumanReply}
                onCheckedChange={setStopOnHumanReply}
              />
            </div>
            <p className="fi-fo-field-wrp-helper-text break-words text-sm text-gray-500">
              Если включено, агенты ИИ перестанут отвечать в этом чате после того, как человек отправит сообщение.
            </p>
          </div>
        </div>
      </div>

      <div className="fi-ac gap-3 flex flex-wrap items-center justify-start">
        <KwidButton
          onClick={handleSave}
          disabled={isSaving}
          variant="primary"
          size="md"
          style={{
            '--c-400': 'var(--primary-400)',
            '--c-500': 'var(--primary-500)',
            '--c-600': 'var(--primary-600)',
          } as React.CSSProperties}
          className="fi-color-custom"
        >
          <span className="fi-btn-label">
            {isSaving ? "Сохранение…" : "Сохранить изменения"}
          </span>
        </KwidButton>
      </div>
    </section>
  );
};

export default AccountPage;
