-- Создание таблицы шаблонов email
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT,
  variables JSONB DEFAULT '[]', -- массив названий переменных
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS политика
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view email templates from their organization" ON email_templates
  FOR SELECT USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can create email templates in their organization" ON email_templates
  FOR INSERT WITH CHECK (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can update email templates in their organization" ON email_templates
  FOR UPDATE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

CREATE POLICY "Users can delete email templates in their organization" ON email_templates
  FOR DELETE USING (auth.uid() IN (
    SELECT user_id FROM members
    WHERE org_id = email_templates.org_id
    AND status = 'active'
  ));

-- Индексы
CREATE INDEX idx_email_templates_org_id ON email_templates(org_id);
CREATE INDEX idx_email_templates_active ON email_templates(org_id, is_active);

-- Триггер для updated_at
CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Добавляем несколько шаблонов по умолчанию
INSERT INTO email_templates (org_id, name, subject, html, text, variables) VALUES
('00000000-0000-0000-0000-000000000000', 'Приветственное письмо', 'Добро пожаловать!', '<h1>Добро пожаловать, {{client_name}}!</h1><p>Спасибо за ваше обращение. Мы рады приветствовать вас в нашей компании.</p><p>В ближайшее время с вами свяжется наш менеджер.</p><p>С уважением,<br>Команда поддержки</p>', 'Добро пожаловать, {{client_name}}! Спасибо за ваше обращение. Мы рады приветствовать вас в нашей компании. В ближайшее время с вами свяжется наш менеджер. С уважением, Команда поддержки', '["client_name"]'),

('00000000-0000-0000-0000-000000000000', 'Подтверждение заказа', 'Ваш заказ №{{order_number}} принят', '<h2>Заказ №{{order_number}} успешно принят</h2><p>Уважаемый {{client_name}},</p><p>Ваш заказ на сумму {{order_amount}} ₽ принят и находится в обработке.</p><p>Мы свяжемся с вами для уточнения деталей доставки.</p><p>Спасибо за выбор нашей компании!</p>', 'Заказ №{{order_number}} успешно принят. Уважаемый {{client_name}}, Ваш заказ на сумму {{order_amount}} ₽ принят и находится в обработке. Мы свяжемся с вами для уточнения деталей доставки. Спасибо за выбор нашей компании!', '["order_number", "client_name", "order_amount"]'),

('00000000-0000-0000-0000-000000000000', 'Напоминание о встрече', 'Напоминание о встрече {{meeting_date}}', '<h3>Напоминание о встрече</h3><p>Уважаемый {{client_name}},</p><p>Напоминаем вам о запланированной встрече:</p><ul><li>Дата: {{meeting_date}}</li><li>Время: {{meeting_time}}</li><li>Тема: {{meeting_topic}}</li></ul><p>Если у вас изменились планы, пожалуйста, сообщите нам заранее.</p><p>Ждем вас!</p>', 'Напоминание о встрече. Уважаемый {{client_name}}, Напоминаем вам о запланированной встрече: Дата: {{meeting_date}}, Время: {{meeting_time}}, Тема: {{meeting_topic}}. Если у вас изменились планы, пожалуйста, сообщите нам заранее. Ждем вас!', '["client_name", "meeting_date", "meeting_time", "meeting_topic"]'),

('00000000-0000-0000-0000-000000000000', 'Ответ на жалобу', 'Мы рассмотрели вашу жалобу', '<h3>Рассмотрение вашей жалобы</h3><p>Уважаемый {{client_name}},</p><p>Мы внимательно рассмотрели вашу жалобу и приняли следующие меры:</p><p>{{resolution_text}}</p><p>Мы стремимся к тому, чтобы все наши клиенты были довольны качеством обслуживания.</p><p>Если у вас есть дополнительные вопросы, пожалуйста, свяжитесь с нами.</p><p>С уважением,<br>Служба поддержки клиентов</p>', 'Рассмотрение вашей жалобы. Уважаемый {{client_name}}, Мы внимательно рассмотрели вашу жалобу и приняли следующие меры: {{resolution_text}}. Мы стремимся к тому, чтобы все наши клиенты были довольны качеством обслуживания. Если у вас есть дополнительные вопросы, пожалуйста, свяжитесь с нами. С уважением, Служба поддержки клиентов', '["client_name", "resolution_text"]');
