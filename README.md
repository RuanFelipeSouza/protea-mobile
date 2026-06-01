# Protea Mobile

App React Native (Expo) do ecossistema Protea — clínica de neurodesenvolvimento. Atende dois públicos no mesmo binário:

- **Área Profissional**: médicos, terapeutas e equipe clínica (pacientes, evoluções, agenda, prontuário, relatórios).
- **Área do Paciente / Responsável**: agendamentos, evoluções e perfil.

A escolha entre as duas áreas é feita na tela de login.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Expo SDK 54 (RN 0.81, React 19) |
| Roteamento | `expo-router` v6 (typed routes habilitado) |
| Estado | `zustand` |
| HTTP | `axios` (interceptors + multi-host) |
| Persistência local | `expo-secure-store` |
| Linguagem | TypeScript |

Detalhes:
- **New Architecture (Fabric)** ligada (`newArchEnabled: true`).
- **React Compiler** experimental ligado.
- Tema claro/escuro com hidratação via `themeStore`.

---

## Pré-requisitos

- Node.js 20+
- Yarn 1.22 (`packageManager` fixado no `package.json`)
- Para rodar no celular físico: app **Expo Go** instalado
- Para emulador Android: Android Studio com um AVD configurado
- Para emulador iOS (apenas macOS): Xcode com simulador

---

## Configuração de ambiente

Crie um arquivo `.env` na raiz com:

```bash
# Backend principal (Django Ninja)
EXPO_PUBLIC_API_URL=http://10.0.2.2:8000

# Backend da agenda (pode apontar para o mesmo host)
EXPO_PUBLIC_AGENDA_URL=http://agenda.backhealthweb.protea.intranet:8000

# Header `Host` para o middleware multi-host do backend
# (em dev local: localhost; em produção: webprotea.protea.intranet)
EXPO_PUBLIC_PROTEA_HOST=localhost

# Chave compartilhada da origem — exigida pelo header `proteakey`
EXPO_PUBLIC_PROTEA_KEY=<obter com o time backend>

# Usa respostas mockadas em dev sem precisar do backend rodando
EXPO_PUBLIC_USE_MOCK=false
```

### Por que `10.0.2.2`?

`10.0.2.2` é o alias do **host do emulador Android** para `localhost` da sua máquina. Substitua conforme o cenário:

| Cenário | `EXPO_PUBLIC_API_URL` |
|---|---|
| Emulador Android + backend local | `http://10.0.2.2:8000` |
| Simulador iOS + backend local | `http://localhost:8000` |
| Celular físico na mesma rede Wi-Fi | `http://<IP_DA_MAQUINA>:8000` |
| Backend hospedado | `https://api.webprotea.protea.intranet` |

### Modo mock

Setando `EXPO_PUBLIC_USE_MOCK=true`, os serviços de login (profissional e paciente) e algumas listagens retornam dados fixos sem chamar o backend. Útil para desenvolver UI sem dependência de rede.

---

## Instalação

```bash
yarn install
```

---

## Como rodar

```bash
# Dev server (escolhe plataforma no QR code)
yarn start

# Abre direto no emulador / simulador
yarn android
yarn ios

# Web (suporte parcial — útil só para layout)
yarn web
```

O comando `yarn start` sobe o Metro bundler e mostra um QR code:
- **Expo Go** (celular físico): aponte a câmera para o QR.
- **Emulador**: pressione `a` (Android) ou `i` (iOS) no terminal.

---

## Fluxo de autenticação

O guard de autenticação vive em [`app/_layout.tsx`](app/_layout.tsx) e segue três fases:

### 1. Bootstrap (validação contra backend)

Ao abrir o app:

1. Lê o JWT profissional do `SecureStore`. Se existir e não estiver expirado localmente, valida contra `GET unidade/unidadesPrest?user={id}`:
   - **200** → restaura sessão profissional.
   - **401/403** → interceptor do `apiClient` limpa o token automaticamente.
   - **Erro de rede** → confia no JWT local (uso offline).
2. Se não há profissional válido, faz o mesmo para o JWT de paciente contra `GET /mobile/paciente/{id}/perfil`.
3. Hidrata `unidadeStore` e `themeStore`.
4. Marca `authReady = true` e some o splash.

### 2. Guard de navegação

Roda sempre que `authReady`, `token`, `pacienteToken` ou a rota raiz muda. Regras:

| Estado | Pode estar em | Senão, redireciona para |
|---|---|---|
| Profissional autenticado | qualquer rota exceto `login` e `(paciente)` | `/(tabs)` |
| Paciente autenticado | apenas `(paciente)` | `/(paciente)` |
| Não autenticado | `login` ou `paciente-criar-senha` | `/login` |

### 3. Login

A tela [`app/login.tsx`](app/login.tsx) tem dois modos (`prof` / `paciente`) controlados por um link no rodapé. Após login bem-sucedido:
- **Prof**: `setAuth()` no store → guard redireciona pra `/(tabs)`.
- **Paciente**: `setPacienteAuth()` + `router.replace('/(paciente)')`.

### Como acessar

- **Profissional**: usuário e senha cadastrados no backend Protea (login via `POST /seguranca/login`).
- **Paciente**:
  - Já cadastrado → e-mail + senha em `POST /mobile/paciente/auth/login`.
  - Primeiro acesso → fluxo em [`app/paciente-criar-senha.tsx`](app/paciente-criar-senha.tsx) (verifica e-mail, cria senha).

JWT tem validade definida pelo backend (atualmente 2 dias). Logout limpa o `SecureStore` localmente — **não invalida o token no backend** (até o time backend expor um endpoint de revogação).

---

## Estrutura

```
app/                       # Rotas do expo-router (file-based routing)
  _layout.tsx              # Bootstrap + guard de auth
  login.tsx
  paciente-criar-senha.tsx
  (tabs)/                  # Grupo área profissional
    _layout.tsx            # Stack + FooterNavBar
    index.tsx              # Home profissional
    pacientes.tsx
    evolucoes.tsx
    agenda.tsx
    ...
  (paciente)/              # Grupo área do paciente
    _layout.tsx            # Stack + PacienteFooterNavBar
    index.tsx              # Dashboard paciente
    agendamentos.tsx
    evolucoes.tsx
    perfil.tsx
    evolucao/[id].tsx
  prontuario/[id]/...      # Prontuário do paciente (prof)
  minhas-unidades/...

src/
  components/              # Atomic design: atoms / molecules / organisms / templates / pages
  hooks/                   # Hooks de domínio (useUnidades, usePacientePerfil, ...)
  services/                # Camada HTTP — apiClient.ts + um arquivo por domínio
  stores/                  # Zustand stores (auth, paciente, unidade, theme)
  theme/                   # Tokens de cor + tema claro/escuro
  types/                   # Tipos compartilhados
```

> **Atenção sobre roteamento**: tanto `app/(tabs)/index.tsx` quanto `app/(paciente)/index.tsx` mapeiam para a URL `/`. O `expo-router` resolve esse conflito pelo nome do grupo mais curto (`(tabs)` vence). O guard em `_layout.tsx` corrige a rota com base na sessão ativa.

---

## Multi-host (importante em dev)

O backend Protea usa o header `Host` para decidir entre `protea.urls` e `publico.urls` (middleware `ProteaConfigMult`). Por isso o `apiClient.ts` expõe três instâncias axios:

| Instância | Para que serve | Header `Host` |
|---|---|---|
| `api` | Endpoints públicos (login, unidades, agenda) | nenhum por padrão; use `HOST_PUBLICO` ou `HOST_PROTEA` por chamada |
| `proteaApi` | `PacienteController`, prontuário, evoluções | `EXPO_PUBLIC_PROTEA_HOST` |
| `agendaApi` | Endpoints da agenda | `EXPO_PUBLIC_AGENDA_URL` |

Todos os endpoints precisam do header `proteakey` (`EXPO_PUBLIC_PROTEA_KEY`). Cada instância adiciona automaticamente o `Authorization: Bearer <jwt>` lido do `SecureStore`.

---

## Lint e tipos

```bash
yarn lint          # ESLint (config Expo)
npx tsc --noEmit   # Type-check
```

---

## Troubleshooting

| Sintoma | Possível causa |
|---|---|
| `Network request failed` no emulador Android | `EXPO_PUBLIC_API_URL` usando `localhost` em vez de `10.0.2.2` |
| 401 em todas as chamadas após login | Header `proteakey` ausente/errado (cheque `.env`) |
| App não detecta backend local rodando em HTTPS no celular físico | Certificado dev não confiável — use HTTP ou instale o certificado |
| Splash some mas a tela não responde | Verifique no console: o `useEffect` de bootstrap pode estar travado em uma chamada lenta (timeout padrão é 5s) |
| Token de paciente persistido após "logout" no backend | Logout atual só limpa local — token continua válido até o `exp` (~2 dias) |
