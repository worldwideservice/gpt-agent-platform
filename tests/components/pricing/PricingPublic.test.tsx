import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PricingPublic } from '@/components/pricing/PricingPublic'

// Мокаем next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

// Мокаем pricingData
vi.mock('@/components/pricing/pricingData', () => ({
  PRICING_PLANS: [
    {
      id: 'launch',
      name: 'Launch',
      priceMonthly: 18,
      priceYearly: 15,
      perConversation: '~$0.06 за разговор',
      features: [
        { label: '1 агентов', value: 'text' },
        { label: '500 статей базы знаний', value: 'text' },
        { label: 'Ответов / месяц', value: 'select' },
      ],
      unavailableForResponses: [2500, 5000, 10000, 15000, 20000],
    },
    {
      id: 'scale',
      name: 'Scale',
      priceMonthly: 45,
      priceYearly: 38,
      perConversation: '~$0.16 за разговор',
      features: [
        { label: '10 агентов', value: 'text' },
        { label: '100,000 статей базы знаний', value: 'text' },
        { label: 'Ответов / месяц', value: 'select' },
      ],
    },
    {
      id: 'max',
      name: 'Max',
      priceMonthly: 90,
      priceYearly: 75,
      perConversation: '~$0.32 за разговор',
      features: [
        { label: 'Неограниченное количество агентов', value: 'text' },
        { label: 'Неограниченное количество статей', value: 'text' },
        { label: 'Ответов / месяц', value: 'select' },
        { label: 'Доступные модели ИИ:', value: 'models' },
      ],
      availableModels: ['OpenAI GPT-4.1', 'OpenAI GPT-5'],
    },
  ],
  PRICING_RESPONSE_COUNTS: ['1,000', '2,500', '5,000', '10,000', '15,000', '20,000'],
  PRICING_FAQ: [
    {
      question: 'Могу ли я изменить свой план позже?',
      answer: 'Да, вы можете изменить план в любое время.',
    },
    {
      question: 'Предоставляете ли вы возврат средств?',
      answer: 'Да, мы предоставляем 30-дневную гарантию возврата денег.',
    },
  ],
}))

describe('PricingPublic Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render pricing page', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText(/подберите подходящий план/i)).toBeInTheDocument()
  })

  it('should render guarantee badge', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText(/30 дней гарантии возврата денег/i)).toBeInTheDocument()
  })

  it('should render all pricing plans', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText('Launch')).toBeInTheDocument()
    expect(screen.getByText('Scale')).toBeInTheDocument()
    expect(screen.getByText('Max')).toBeInTheDocument()
  })

  it('should show monthly pricing by default', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText('18')).toBeInTheDocument() // Launch monthly price
    expect(screen.getByText('45')).toBeInTheDocument() // Scale monthly price
    expect(screen.getByText('90')).toBeInTheDocument() // Max monthly price
  })

  it('should switch to yearly pricing', async () => {
    const user = userEvent.setup()
    render(<PricingPublic />)
    
    const yearlyButton = screen.getByRole('button', { name: /ежегодно/i })
    await user.click(yearlyButton)
    
    expect(screen.getByText('15')).toBeInTheDocument() // Launch yearly price
    expect(screen.getByText('38')).toBeInTheDocument() // Scale yearly price
    expect(screen.getByText('75')).toBeInTheDocument() // Max yearly price
  })

  it('should show recommended badge for scale plan', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText(/рекомендуем/i)).toBeInTheDocument()
  })

  it('should render response count selector', () => {
    render(<PricingPublic />)
    
    const selectors = screen.getAllByDisplayValue('15,000')
    expect(selectors.length).toBeGreaterThan(0)
  })

  it('should change response count', async () => {
    const user = userEvent.setup()
    render(<PricingPublic />)
    
    const select = screen.getAllByRole('combobox')[0]
    await user.selectOptions(select, '10,000')
    
    expect(select).toHaveValue('10,000')
  })

  it('should show unavailable message for launch plan with high response count', async () => {
    const user = userEvent.setup()
    render(<PricingPublic />)
    
    // Выбираем 2,500 ответов (недоступно для Launch)
    const select = screen.getAllByRole('combobox')[0]
    await user.selectOptions(select, '2,500')
    
    expect(screen.getByText(/недоступно для выбранного количества ответов/i)).toBeInTheDocument()
  })

  it('should render plan features', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText(/1 агентов/i)).toBeInTheDocument()
    expect(screen.getByText(/10 агентов/i)).toBeInTheDocument()
    expect(screen.getByText(/неограниченное количество агентов/i)).toBeInTheDocument()
  })

  it('should render per conversation pricing', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText(/~\$0\.06 за разговор/i)).toBeInTheDocument()
    expect(screen.getByText(/~\$0\.16 за разговор/i)).toBeInTheDocument()
    expect(screen.getByText(/~\$0\.32 за разговор/i)).toBeInTheDocument()
  })

  it('should render FAQ section', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText(/остались вопросы/i)).toBeInTheDocument()
    expect(screen.getByText(/частые вопросы/i)).toBeInTheDocument()
    expect(screen.getByText(/могу ли я изменить свой план позже/i)).toBeInTheDocument()
  })

  it('should render FAQ answers', () => {
    render(<PricingPublic />)
    
    expect(screen.getByText(/да, вы можете изменить план в любое время/i)).toBeInTheDocument()
    expect(screen.getByText(/да, мы предоставляем 30-дневную гарантию/i)).toBeInTheDocument()
  })

  it('should render contact email', () => {
    render(<PricingPublic />)
    
    const emailLink = screen.getByRole('link', { name: /sales@gptagent.com/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute('href', 'mailto:sales@gptagent.com')
  })

  it('should render FAQ link', () => {
    render(<PricingPublic />)
    
    const faqLink = screen.getByRole('link', { name: /открыть faq по биллингу/i })
    expect(faqLink).toBeInTheDocument()
    expect(faqLink).toHaveAttribute('href', '/support/articles/billing-faq')
  })

  it('should render plan selection buttons', () => {
    render(<PricingPublic />)
    
    const buttons = screen.getAllByRole('link', { name: /выбрать план/i })
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should disable unavailable plans', async () => {
    const user = userEvent.setup()
    render(<PricingPublic />)
    
    // Выбираем 2,500 ответов
    const select = screen.getAllByRole('combobox')[0]
    await user.selectOptions(select, '2,500')
    
    // Кнопка Launch должна быть недоступна
    const unavailableButton = screen.getByRole('link', { name: /недоступно/i })
    expect(unavailableButton).toBeInTheDocument()
  })
})

