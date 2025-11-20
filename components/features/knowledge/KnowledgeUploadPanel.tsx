'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface KnowledgeUploadPanelProps {
  // No props needed - uploads are organization-level
}

const createSchema = (t: ReturnType<typeof useTranslations<'manage.knowledge.upload'>>) =>
  z
    .object({
      file: z.any(),
    })
    .refine((data) => data.file instanceof File, {
      message: t('validation.file'),
      path: ['file'],
    })

type UploadFormValues = z.infer<ReturnType<typeof createSchema>>

export function KnowledgeUploadPanel(_props: KnowledgeUploadPanelProps = {}) {
  const t = useTranslations('manage.knowledge.upload')
  const schema = useMemo(() => createSchema(t), [t])
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [fileKey, setFileKey] = useState(0)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      file: undefined,
    },
  })

  const onSubmit = async (values: UploadFormValues) => {
    setStatusMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', values.file as File)

      const response = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload.document) {
        throw new Error(payload.error || t('messages.error'))
      }

      setStatusMessage({ type: 'success', text: t('messages.success') })
      setFileKey((key) => key + 1)
      form.reset({ file: undefined })
    } catch (error) {
      const message = error instanceof Error ? error.message : t('messages.error')
      setStatusMessage({ type: 'error', text: message })
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('fields.file.label')}</FormLabel>
                  <FormControl>
                    <Input
                      key={fileKey}
                      type="file"
                      accept=".pdf,.docx,.txt,.md,.html"
                      onChange={(event) => field.onChange(event.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-gray-500">{t('fields.file.helper')}</p>
                </FormItem>
              )}
            />

            {statusMessage && (
              <p
                className={`text-sm ${
                  statusMessage.type === 'success' ? 'text-emerald-600' : 'text-rose-500'
                }`}
              >
                {statusMessage.text}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('actions.uploading') : t('actions.submit')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
