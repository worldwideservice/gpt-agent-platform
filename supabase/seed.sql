-- Seed data for local development
insert into organizations (id, name, slug)
values (
  '00000000-0000-4000-8000-000000000001',
  'Demo Organization',
  'demo-org'
)
on conflict (id) do nothing;

insert into users (id, email, full_name, password_hash, default_org_id)
values (
  '00000000-0000-4000-8000-000000000010',
  'founder@example.com',
  'Founder Demo',
  '$2b$12$PU71OzRHTNh/Xy/9U1YL4.iEaO68BxYe6dTzyxehrptHICIi/nNse',
  '00000000-0000-4000-8000-000000000001'
)
on conflict (id) do nothing;

insert into organization_members (org_id, user_id, role)
values (
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000010',
  'owner'
)
on conflict do nothing;

insert into subscriptions (org_id, plan, status, token_quota, token_used)
values (
  '00000000-0000-4000-8000-000000000001',
  'enterprise',
  'active',
  1000000,
  0
)
on conflict (org_id) do nothing;

insert into organization_settings (org_id, ai_provider, openrouter_api_key, openrouter_default_model, openrouter_embedding_model, provider_configs, metadata)
values (
  '00000000-0000-4000-8000-000000000001',
  'openrouter',
  'sk-or-demo-key',
  'openrouter/gpt-4.1-mini',
  'openai/text-embedding-3-large',
  jsonb_build_object(
    'openrouter',
    jsonb_build_object(
      'apiKey', 'sk-or-demo-key',
      'defaultModel', 'openrouter/gpt-4.1-mini',
      'embeddingModel', 'openai/text-embedding-3-large'
    )
  ),
  jsonb_build_object('source', 'seed')
)
on conflict (org_id) do nothing;

insert into crm_credentials (id, org_id, provider, client_id, client_secret, redirect_uri)
values (
  '00000000-0000-4000-8000-000000000050',
  '00000000-0000-4000-8000-000000000001',
  'kommo',
  'demo-client-id',
  'demo-client-secret',
  'http://localhost:3000/integrations/kommo/oauth/callback'
)
on conflict (id) do nothing;

insert into crm_connections (id, org_id, provider, base_domain, access_token, refresh_token, expires_at, metadata)
values (
  '00000000-0000-4000-8000-000000000060',
  '00000000-0000-4000-8000-000000000001',
  'kommo',
  'example.amocrm.ru',
  'demo-access-token',
  'demo-refresh-token',
  now() + interval '1 day',
  jsonb_build_object('synced_at', now())
)
on conflict (id) do nothing;

insert into crm_pipelines (id, connection_id, external_id, name, is_active, sort_order, metadata)
values
  ('00000000-0000-4000-8000-000000000070', '00000000-0000-4000-8000-000000000060', 'sales_pipeline', 'Sales Pipeline', true, 0, jsonb_build_object('description', 'Demo pipeline'))
on conflict (id) do nothing;

insert into crm_pipeline_stages (id, pipeline_id, external_id, name, sort_order, metadata)
values
  ('00000000-0000-4000-8000-000000000080', '00000000-0000-4000-8000-000000000070', 'stage_new', 'Новый лид', 0, jsonb_build_object('code', 'NEW')),
  ('00000000-0000-4000-8000-000000000081', '00000000-0000-4000-8000-000000000070', 'stage_qualified', 'Квалификация', 1, jsonb_build_object('code', 'QUALIFIED'))
on conflict (id) do nothing;

insert into agents (id, org_id, name, status, default_model, owner_name, messages_total, temperature, max_tokens, instructions, last_activity_at)
values (
  '10000000-0000-4000-8000-000000000100',
  '00000000-0000-4000-8000-000000000001',
  'AI Sales Assistant',
  'active',
  'openrouter:gpt-4.1-mini',
  'Founder Demo',
  152,
  0.70,
  2048,
  'Assist sales managers with lead qualification and follow-up.',
  now() - interval '1 hour'
)
on conflict (id) do nothing;

insert into agent_pipelines (id, org_id, agent_id, pipeline_external_id, name)
values (
  '20000000-0000-4000-8000-000000000200',
  '00000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000100',
  'lead_generation',
  'Generation Lead'
)
on conflict (id) do nothing;

insert into agent_pipeline_stages (id, pipeline_id, org_id, stage_external_id, name, order_index)
values
  ('20000000-0000-4000-8000-000000000210', '20000000-0000-4000-8000-000000000200', '00000000-0000-4000-8000-000000000001', 'new', 'Новый лид', 1),
  ('20000000-0000-4000-8000-000000000211', '20000000-0000-4000-8000-000000000200', '00000000-0000-4000-8000-000000000001', 'qualification', 'Квалификация', 2),
  ('20000000-0000-4000-8000-000000000212', '20000000-0000-4000-8000-000000000200', '00000000-0000-4000-8000-000000000001', 'proposal', 'Предложение', 3)
on conflict (id) do nothing;

insert into agent_stage_policies (id, org_id, agent_id, stage_id, instructions, auto_advance, followup_delay, followup_template)
values
  (
    '20000000-0000-4000-8000-000000000220',
    '00000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000100',
    '20000000-0000-4000-8000-000000000210',
    'Приветствуй клиента, собирай email и тип услуги. Уточни, что ответишь на английском.',
    true,
    interval '0 minutes',
    'Hi {{contact_name}}, thanks for reaching out! I''ll collect a few details to get you to the right specialist.'
  ),
  (
    '20000000-0000-4000-8000-000000000221',
    '00000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000100',
    '20000000-0000-4000-8000-000000000211',
    'Квалифицируй интерес, предложи консультацию, назначь задачу на менеджера.',
    true,
    interval '30 minutes',
    'Following up to make sure we schedule your consultation. Does {{datetime}} work for you?'
  ),
  (
    '20000000-0000-4000-8000-000000000222',
    '00000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000100',
    '20000000-0000-4000-8000-000000000212',
    'Подготовь предложение, отправь email и уточни готовность.',
    false,
    interval '1 day',
    'Just checking in to see if you had a chance to review the proposal. Happy to answer any questions!'
  )
on conflict (id) do nothing;

insert into agent_triggers (id, org_id, agent_id, name, description)
values
  (
    '30000000-0000-4000-8000-000000000300',
    '00000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000100',
    'Тип услуги "AGENT PARTNERSHIP"',
    'Переключить сделку на этап Partnership и уведомить менеджера'
  ),
  (
    '30000000-0000-4000-8000-000000000301',
    '00000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000100',
    'Тип услуги "WORK VISA IN POLAND"',
    'Перевести лиду на стадию визы и отправить письмо'
  ),
  (
    '30000000-0000-4000-8000-000000000302',
    '00000000-0000-4000-8000-000000000001',
    '10000000-0000-4000-8000-000000000100',
    'Тип услуги "SEASONAL VISA IN POLAND"',
    'Создать задачу follow-up через 2 дня'
  )
on conflict (id) do nothing;

insert into agent_trigger_conditions (id, trigger_id, org_id, condition_type, payload, ordering)
values
  (
    '30000000-0000-4000-8000-000000000310',
    '30000000-0000-4000-8000-000000000300',
    '00000000-0000-4000-8000-000000000001',
    'service_type_equals',
    jsonb_build_object('value', 'AGENT PARTNERSHIP'),
    0
  ),
  (
    '30000000-0000-4000-8000-000000000311',
    '30000000-0000-4000-8000-000000000301',
    '00000000-0000-4000-8000-000000000001',
    'service_type_equals',
    jsonb_build_object('value', 'WORK VISA IN POLAND'),
    0
  ),
  (
    '30000000-0000-4000-8000-000000000312',
    '30000000-0000-4000-8000-000000000302',
    '00000000-0000-4000-8000-000000000001',
    'service_type_equals',
    jsonb_build_object('value', 'SEASONAL VISA IN POLAND'),
    0
  )
on conflict (id) do nothing;

insert into agent_trigger_actions (id, trigger_id, org_id, action_type, payload, ordering)
values
  (
    '30000000-0000-4000-8000-000000000320',
    '30000000-0000-4000-8000-000000000300',
    '00000000-0000-4000-8000-000000000001',
    'update_stage',
    jsonb_build_object('stage_external_id', 'agent_partnership'),
    0
  ),
  (
    '30000000-0000-4000-8000-000000000321',
    '30000000-0000-4000-8000-000000000300',
    '00000000-0000-4000-8000-000000000001',
    'notify_manager',
    jsonb_build_object('channel', 'internal'),
    1
  ),
  (
    '30000000-0000-4000-8000-000000000322',
    '30000000-0000-4000-8000-000000000301',
    '00000000-0000-4000-8000-000000000001',
    'update_stage',
    jsonb_build_object('stage_external_id', 'work_visa_pl'),
    0
  ),
  (
    '30000000-0000-4000-8000-000000000323',
    '30000000-0000-4000-8000-000000000301',
    '00000000-0000-4000-8000-000000000001',
    'send_email',
    jsonb_build_object('template', 'work_visa_intro'),
    1
  ),
  (
    '30000000-0000-4000-8000-000000000324',
    '30000000-0000-4000-8000-000000000302',
    '00000000-0000-4000-8000-000000000001',
    'create_task',
    jsonb_build_object('due_in', '2 days', 'description', 'Follow up seasonal visa lead'),
    0
  )
on conflict (id) do nothing;

insert into agent_sequences (id, org_id, agent_id, name, description)
values (
  '31000000-0000-4000-8000-000000000330',
  '00000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000100',
  'Primary Follow-up',
  '3-step follow-up for cold leads'
)
on conflict (id) do nothing;

insert into agent_sequence_steps (id, sequence_id, org_id, step_index, wait_interval, channel, template)
values
  (
    '31000000-0000-4000-8000-000000000331',
    '31000000-0000-4000-8000-000000000330',
    '00000000-0000-4000-8000-000000000001',
    1,
    interval '0 minutes',
    'email',
    'Thanks for contacting us! Here is your consultation link.'
  ),
  (
    '31000000-0000-4000-8000-000000000332',
    '31000000-0000-4000-8000-000000000330',
    '00000000-0000-4000-8000-000000000001',
    2,
    interval '1 day',
    'email',
    'Just checking in if you had a chance to review our offer.'
  ),
  (
    '31000000-0000-4000-8000-000000000333',
    '31000000-0000-4000-8000-000000000330',
    '00000000-0000-4000-8000-000000000001',
    3,
    interval '3 days',
    'whatsapp',
    'Happy to answer any question over chat — when is a good time to talk?'
  )
on conflict (id) do nothing;

insert into sequence_executions (id, org_id, sequence_id, agent_id, lead_id, status, current_step, execution_context)
values (
  '33000000-0000-4000-8000-000000000350',
  '00000000-0000-4000-8000-000000000001',
  '31000000-0000-4000-8000-000000000330',
  '10000000-0000-4000-8000-000000000100',
  'demo-lead-001',
  'running',
  1,
  jsonb_build_object('initiator', 'seed')
)
on conflict (id) do nothing;

insert into automation_rules (
  id,
  org_id,
  agent_id,
  name,
  description,
  trigger_type,
  conditions,
  actions,
  is_active,
  priority,
  metadata
)
values (
  '32000000-0000-4000-8000-000000000340',
  '00000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000100',
  'Ответить новым лидам',
  'Автоматически отправлять приветственное сообщение новым лидам',
  'lead_created',
  jsonb_build_array(
    jsonb_build_object(
      'type', 'field_value',
      'field', 'source',
      'operator', 'not_empty'
    )
  ),
  jsonb_build_array(
    jsonb_build_object(
      'type', 'send_message',
      'template', 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.'
    )
  ),
  true,
  5,
  jsonb_build_object('created_by', 'seed')
)
on conflict (id) do nothing;

insert into agent_activity_metrics (id, agent_id, org_id, activity_date, messages_count)
values
  ('40000000-0000-4000-8000-000000000400', '10000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000001', (current_date - interval '6 day')::date, 12),
  ('40000000-0000-4000-8000-000000000401', '10000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000001', (current_date - interval '5 day')::date, 18),
  ('40000000-0000-4000-8000-000000000402', '10000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000001', (current_date - interval '4 day')::date, 22),
  ('40000000-0000-4000-8000-000000000403', '10000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000001', (current_date - interval '3 day')::date, 17),
  ('40000000-0000-4000-8000-000000000404', '10000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000001', (current_date - interval '2 day')::date, 19),
  ('40000000-0000-4000-8000-000000000405', '10000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000001', (current_date - interval '1 day')::date, 24),
  ('40000000-0000-4000-8000-000000000406', '10000000-0000-4000-8000-000000000100', '00000000-0000-4000-8000-000000000001', current_date, 40)
on conflict (id) do nothing;
