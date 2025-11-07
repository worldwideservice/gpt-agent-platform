import '@testing-library/jest-dom'
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Очистка после каждого теста
afterEach(() => {
  cleanup()
})

// Расширяем expect для jest-dom матчеров
expect.extend({
  // Можно добавить кастомные матчеры если нужно
})


