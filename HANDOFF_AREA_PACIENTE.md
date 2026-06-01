# Handoff — Integração Área do Paciente

## Contexto

O backend (`PRDBackend`) foi implementado com novos endpoints para autenticação e dados da área do paciente. O mobile (`protea-mobile`) já tem boa parte da estrutura construída com **mocks**. Este documento lista o que foi feito no backend, o que já existe no mobile, e os ajustes necessários para conectar os dois.

---

## O que existe no mobile (já implementado)

| Arquivo | O que faz |
|---|---|
| `app/(paciente)/_layout.tsx` | Layout com `PacienteFooterNavBar` |
| `app/(paciente)/index.tsx` | Dashboard do paciente |
| `app/(paciente)/agendamentos.tsx` | Tela de agendamentos |
| `app/(paciente)/evolucoes.tsx` | Tela de evoluções |
| `app/(paciente)/evolucao/[id].tsx` | Detalhe de evolução |
| `app/(paciente)/perfil.tsx` | Perfil do paciente |
| `app/login.tsx` | Login com toggle prof/paciente |
| `app/paciente-criar-senha.tsx` | Tela de primeiro acesso |
| `src/services/pacienteLoginService.ts` | Chamadas de auth |
| `src/services/pacienteDataService.ts` | Chamadas de dados (em mock) |
| `src/services/pacienteAuthService.ts` | Salvar/ler token no SecureStore |
| `src/stores/pacienteAuthStore.ts` | Zustand store do paciente |
| `src/hooks/usePacienteAgendamentos.ts` | Hook de agendamentos |
| `src/hooks/usePacienteEvolucoes.ts` | Hook de evoluções |

---

## Endpoints do backend (já deployados)

### Auth — sem token

#### `POST /mobile/paciente/auth/primeiro-acesso`
Verifica se o e-mail pertence a um paciente cadastrado. **Não cria usuário, não recebe senha.**

```json
// Request
{ "email": "paciente@email.com" }

// Response
{
  "token": "",
  "paciente_id": 217,
  "nome": "ALAN VITOR",
  "email": "paciente@email.com",
  "primeiro_acesso": true,   // true = não tem senha ainda
  "mensagem": null
}
```

---

#### `POST /mobile/paciente/auth/definir-senha`
Cria o usuário e define a senha. Retorna JWT pronto para uso.

```json
// Request
{ "email": "paciente@email.com", "senha": "MinhaS3nha", "confirmar_senha": "MinhaS3nha" }

// Response
{
  "token": "<jwt>",
  "paciente_id": 217,
  "nome": "ALAN VITOR",
  "email": "paciente@email.com",
  "primeiro_acesso": false,
  "mensagem": null
}
```

---

#### `POST /mobile/paciente/auth/login`
Login normal após senha já definida.

```json
// Request
{ "email": "paciente@email.com", "senha": "MinhaS3nha" }

// Response (mesmo shape do /definir-senha)
{
  "token": "<jwt>",
  "paciente_id": 217,
  "nome": "ALAN VITOR",
  "email": "paciente@email.com",
  "primeiro_acesso": false,
  "mensagem": null
}
```

> Se `token` vier vazio, o campo `mensagem` explica o erro.

---

### Dados — requer `Authorization: Bearer <token>`

#### `GET /mobile/paciente/meus-atendimentos`
Lista os agendamentos do paciente autenticado (infere o paciente pelo JWT).

```json
// Response — array de objetos
[
  {
    "id": 1234,
    "data": "2026-06-02",          // formato ISO — precisa formatar no mobile
    "hora": "08:00",
    "horafim": "09:00",
    "profissional__nome": "Milena Gomes Santos",
    "unidadeId__unidade": "Protea Vitória",
    "status__status": "Agendado"
  }
]
```

---

#### `GET /mobile/paciente/minhas-evolucoes`
Lista as evoluções do paciente autenticado.

```json
// Response — array de objetos
[
  {
    "id": 405600,
    "data": "2026-05-20",          // formato ISO
    "hora": "08:00",
    "profissional__nome": "Milena Gomes Santos",
    "unidade__unidade": "Protea Vitória",
    "tipoevolucao__tipo": "Atendimento",
    "evolucao": "<p>Texto da evolução...</p>",
    "codigoAgendamento": 1234
  }
]
```

---

## Discrepâncias a corrigir no mobile

### 1. Campo `senha` vs `password` no login — `pacienteLoginService.ts`

**Linha 23 — login:** manda `password` mas o backend espera `senha`.
```ts
// ❌ atual
{ email, password: senha }

// ✅ correto
{ email, senha }
```

**Linha 52 — primeiro acesso:** o `pacientePrimeiroAcesso` chama `/primeiro-acesso` passando senha, mas esse endpoint **só aceita email** e **não cria usuário**. A função precisa chamar `/definir-senha`.
```ts
// ❌ atual — endpoint e campos errados
await api.post('/mobile/paciente/auth/primeiro-acesso', { email, password: novaSenha })

// ✅ correto — endpoint e campos certos
await api.post('/mobile/paciente/auth/definir-senha', {
  email,
  senha: novaSenha,
  confirmar_senha: novaSenha,   // a tela já valida localmente — pode repetir
})
```

---

### 2. URLs dos dados — `pacienteDataService.ts`

O mobile chama URLs com `/{pacienteId}/` mas o backend infere o paciente pelo JWT.

```ts
// ❌ atual
pacienteApi.get(`/mobile/paciente/${pacienteId}/agendamentos`)
pacienteApi.get(`/mobile/paciente/${pacienteId}/evolucoes`)
pacienteApi.get(`/mobile/paciente/${pacienteId}/evolucoes/${evolucaoId}`)

// ✅ correto
pacienteApi.get('/mobile/paciente/meus-atendimentos')
pacienteApi.get('/mobile/paciente/minhas-evolucoes')
// detalhe de evolução: ainda não existe no backend — manter mock por enquanto
```

> O parâmetro `pacienteId` não é mais necessário nas chamadas de dados — pode remover dos hooks também.

---

### 3. Mapeamento de campos na resposta

O backend retorna nomes de campos com `__` (sintaxe do Django ORM). O mobile precisa mapear para os tipos que já usa (`AgendamentoPaciente`, `EvolucaoPaciente`).

**Agendamentos — função de mapeamento sugerida:**
```ts
import { format, parseISO, getDay } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

function mapAgendamento(raw: any): AgendamentoPaciente {
  const date = parseISO(raw.data)
  return {
    id: raw.id,
    data: format(date, 'dd/MM/yyyy'),
    diaSemana: DIAS[getDay(date)],
    hora: raw.hora,
    modalidade: raw.status__status ?? '',
    profissional: raw['profissional__nome'],
    local: raw['unidadeId__unidade'] ?? null,
    status: mapStatus(raw['status__status']),
  }
}

function mapStatus(s: string | null): AgendamentoStatus {
  const slug = (s ?? '').toLowerCase()
  if (slug.includes('realizado') || slug.includes('atendido')) return 'realizado'
  if (slug.includes('falta') || slug.includes('ausente')) return 'falta'
  if (slug.includes('confirmado')) return 'confirmado'
  return 'agendado'
}
```

**Evoluções — função de mapeamento sugerida:**
```ts
function mapEvolucao(raw: any): EvolucaoPaciente {
  return {
    id: raw.id,
    tipo: raw['tipoevolucao__tipo'] ?? 'Atendimento',
    modalidade: raw['unidade__unidade'] ?? '',
    profissional: raw['profissional__nome'],
    data: raw.data ? format(parseISO(raw.data), 'dd/MM/yyyy') : '',
    hora: raw.hora ?? '',
  }
}
```

---

### 4. Campo `nomeresponsavel` ausente na resposta de auth

O `PacienteAuthResponse` e o `pacienteAuthStore` esperam `nomeresponsavel`, mas o backend não retorna esse campo. Duas opções:

- **Opção A (recomendada):** Remover `nomeresponsavel` do store e do tipo — ele pode ser carregado depois via `/mobile/paciente/{id}/perfil` que já existe.
- **Opção B:** Pedir ao backend para incluir `nomeresponsavel` no response de auth.

---

### 5. Detalhe de evolução — manter mock

O endpoint `GET /mobile/paciente/{id}/evolucoes/{evolucaoId}` **ainda não existe** no backend. Manter o mock ativo para essa chamada até o backend implementar.

---

## Fluxo de autenticação corrigido

```
Tela de login
  ├── [aba profissional] → POST /seguranca/login  (não muda)
  └── [aba paciente]
        ├── login normal → POST /mobile/paciente/auth/login
        │     { email, senha }
        │
        └── botão "Primeiro acesso" → app/paciente-criar-senha.tsx
              usuário informa email + senha + confirmar
              → POST /mobile/paciente/auth/definir-senha
                { email, senha, confirmar_senha }
              ← recebe JWT → salva no SecureStore → navega para /(paciente)
```

---

## Variável de ambiente

Para desativar os mocks e apontar para o backend real, definir no `.env`:
```
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_API_URL=http://<ip-do-backend>:8000
EXPO_PUBLIC_PROTEA_KEY=98ff2595a575d3f1c42ac83e70170e01eb538603
```

---

## Resumo das mudanças necessárias no mobile

| Arquivo | Mudança |
|---|---|
| `src/services/pacienteLoginService.ts` | `password` → `senha` no login; `/primeiro-acesso` → `/definir-senha` com campos corretos |
| `src/services/pacienteDataService.ts` | URLs de agendamentos e evoluções; adicionar funções de mapeamento |
| `src/hooks/usePacienteAgendamentos.ts` | Remover parâmetro `pacienteId` |
| `src/hooks/usePacienteEvolucoes.ts` | Remover parâmetro `pacienteId` |
| `src/types/pacienteContextTypes.ts` | `PacienteAuthResponse` — `nomeresponsavel` opcional ou removida |
| `src/stores/pacienteAuthStore.ts` | Remover `nomeresponsavel` se optar pela Opção A acima |
