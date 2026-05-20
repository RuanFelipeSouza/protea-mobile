# Exemplos de Integração Mobile API

## Headers Obrigatórios

```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

---

## 1. Listar Unidades

**Endpoint:** `GET /mobile/unidades`

**Request:**
```bash
curl -X GET http://localhost:8000/mobile/unidades \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

**Response (200):**
```json
[
  {
    "id": 20,
    "unidade": "Unidade Centro"
  },
  {
    "id": 21,
    "unidade": "Unidade Sul"
  },
  {
    "id": 22,
    "unidade": "Unidade Norte"
  }
]
```

**TypeScript/React:**
```typescript
import { api } from './services/apiClient';

async function carregarUnidades() {
  try {
    const { data } = await api.get('mobile/unidades');
    console.log('Unidades:', data);
    // data = [{ id: 20, unidade: "Unidade Centro" }, ...]
  } catch (error) {
    console.error('Erro ao carregar unidades:', error);
  }
}
```

---

## 2. Listar Pacientes da Unidade

**Endpoint:** `GET /mobile/unidade/{unidade_id}/paciente`

**Query Parameters:**
- `is_active` (opcional): `true` | `false`

**Request:**
```bash
# Apenas pacientes ativos
curl -X GET "http://localhost:8000/mobile/unidade/20/paciente?is_active=true" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json"

# Todos os pacientes
curl -X GET "http://localhost:8000/mobile/unidade/20/paciente" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

**Response (200):**
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "datanascimento": "15/05/1990",
    "imagem_url": "http://api.backhealthweb.protea.intranet/media/pacientes/1.jpg",
    "is_active": true,
    "cpf": "123.456.789-00",
    "nomemae": "Maria Silva",
    "sexo": {
      "sexo": "Masculino"
    }
  },
  {
    "id": 2,
    "nome": "Ana Santos",
    "datanascimento": "20/03/1985",
    "imagem_url": null,
    "is_active": true,
    "cpf": "987.654.321-00",
    "nomemae": "Conceição Santos",
    "sexo": {
      "sexo": "Feminino"
    }
  }
]
```

**TypeScript/React:**
```typescript
async function carregarPacientes(unidadeId: number, isActive?: boolean) {
  try {
    const { data } = await api.get(`mobile/unidade/${unidadeId}/paciente`, {
      params: {
        ...(isActive !== undefined && { is_active: isActive })
      }
    });
    console.log('Pacientes:', data);
    // data = [{ id: 1, nome: "João Silva", ... }, ...]
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error);
  }
}

// Uso
carregarPacientes(20, true); // Apenas ativos
carregarPacientes(20); // Todos
```

---

## 3. Listar Todas as Evoluções da Unidade (Paginadas)

**Endpoint:** `GET /mobile/unidade/{unidade_id}/evolucoes`

**Query Parameters:**
- `page` (opcional, padrão: 1): número da página
- `page_size` (opcional, padrão: 20): itens por página

**Request:**
```bash
# Página 1
curl -X GET "http://localhost:8000/mobile/unidade/20/evolucoes?page=1" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json"

# Página 2 com 30 itens por página
curl -X GET "http://localhost:8000/mobile/unidade/20/evolucoes?page=2&page_size=30" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

**Response (200):**
```json
{
  "count": 150,
  "next": "http://localhost:8000/mobile/unidade/20/evolucoes?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "tipo": "Atendimento",
      "data": "20/05/2026",
      "hora": "14:30",
      "paciente_nome": "João Silva",
      "paciente_id": 1,
      "pendente": false
    },
    {
      "id": 2,
      "tipo": "Consulta",
      "data": "19/05/2026",
      "hora": "10:15",
      "paciente_nome": "Ana Santos",
      "paciente_id": 2,
      "pendente": true
    }
  ]
}
```

**TypeScript/React:**
```typescript
async function carregarEvolucoes(unidadeId: number, page = 1) {
  try {
    const { data } = await api.get(`mobile/unidade/${unidadeId}/evolucoes`, {
      params: { page }
    });
    console.log('Evoluções:', data.results);
    console.log('Total:', data.count);
    console.log('Próxima página:', data.next);
    // data.results = [{ id: 1, tipo: "Atendimento", ... }, ...]
  } catch (error) {
    console.error('Erro ao carregar evoluções:', error);
  }
}

// Uso
carregarEvolucoes(20, 1);
```

---

## 4. Listar Evoluções de um Paciente Específico

**Endpoint:** `GET /mobile/unidade/{unidade_id}/evolucoes/{paciente_id}`

**Request:**
```bash
curl -X GET "http://localhost:8000/mobile/unidade/20/evolucoes/1" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

**Response (200):**
```json
[
  {
    "id": 10,
    "data": "20/05/2026",
    "hora": "14:30",
    "tipo": "Atendimento"
  },
  {
    "id": 11,
    "data": "15/05/2026",
    "hora": "09:00",
    "tipo": "Consulta"
  },
  {
    "id": 12,
    "data": "10/05/2026",
    "hora": "16:45",
    "tipo": null
  }
]
```

**TypeScript/React:**
```typescript
async function carregarEvolucoesDosPaciente(unidadeId: number, pacienteId: number) {
  try {
    const { data } = await api.get(`mobile/unidade/${unidadeId}/evolucoes/${pacienteId}`);
    console.log('Evoluções do paciente:', data);
    // data = [{ id: 10, data: "20/05/2026", hora: "14:30", tipo: "Atendimento" }, ...]
  } catch (error) {
    console.error('Erro ao carregar evoluções:', error);
  }
}

// Uso
carregarEvolucoesDosPaciente(20, 1);
```

---

## 5. Buscar Evolução Específica (Completa)

**Endpoint:** `GET /mobile/evolucoes/{evolucao_id}`

**Request:**
```bash
curl -X GET "http://localhost:8000/mobile/evolucoes/10" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

**Response (200):**
```json
{
  "id": 10,
  "data": "20/05/2026",
  "hora": "14:30",
  "tipo": "Atendimento",
  "evolucao": "Paciente apresentou queixa de dor na coluna. Realizamos avaliação postural e indicamos exercícios de alongamento. Paciente respondeu bem ao tratamento. Continuar com sessões semanais.",
  "paciente_id": 1,
  "paciente_nome": "João Silva"
}
```

**TypeScript/React:**
```typescript
async function carregarEvolucaoCompleta(evolucaoId: number) {
  try {
    const { data } = await api.get(`mobile/evolucoes/${evolucaoId}`);
    console.log('Evolução completa:', data);
    console.log('Conteúdo:', data.evolucao);
    // data = { id: 10, data: "20/05/2026", evolucao: "...", ... }
  } catch (error) {
    console.error('Erro ao carregar evolução:', error);
  }
}

// Uso
carregarEvolucaoCompleta(10);
```

---

## 6. Listar Pendências da Unidade (Paginadas)

**Endpoint:** `GET /mobile/unidade/{unidade_id}/pendencias`

**Query Parameters:**
- `page` (opcional, padrão: 1): número da página

**Request:**
```bash
curl -X GET "http://localhost:8000/mobile/unidade/20/pendencias?page=1" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json"
```

**Response (200):**
```json
{
  "count": 8,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 2,
      "tipo": "Consulta",
      "data": "19/05/2026",
      "hora": "10:15",
      "paciente_nome": "Ana Santos",
      "paciente_id": 2,
      "pendente": true
    },
    {
      "id": 5,
      "tipo": null,
      "data": "18/05/2026",
      "hora": "15:30",
      "paciente_nome": "Carlos Oliveira",
      "paciente_id": 5,
      "pendente": true
    }
  ]
}
```

**TypeScript/React:**
```typescript
async function carregarPendencias(unidadeId: number, page = 1) {
  try {
    const { data } = await api.get(`mobile/unidade/${unidadeId}/pendencias`, {
      params: { page }
    });
    console.log('Pendências:', data.results);
    console.log('Total de pendências:', data.count);
    // data.results = [{ id: 2, pendente: true, ... }, ...]
  } catch (error) {
    console.error('Erro ao carregar pendências:', error);
  }
}

// Uso
carregarPendencias(20, 1);
```

---

## Fluxo Completo de Integração

```typescript
import { api } from './services/apiClient';

// 1. Carregar unidades
const unidades = await api.get('mobile/unidades');
const unidadeId = unidades.data[0].id; // Seleciona a primeira

// 2. Carregar pacientes da unidade
const pacientes = await api.get(`mobile/unidade/${unidadeId}/paciente`, {
  params: { is_active: true }
});

// 3. Carregar pendências da unidade
const pendencias = await api.get(`mobile/unidade/${unidadeId}/pendencias?page=1`);

// 4. Usuário clica em uma pendência
const evolucaoId = pendencias.data.results[0].id;

// 5. Carregar detalhes completos da evolução
const evolucao = await api.get(`mobile/evolucoes/${evolucaoId}`);
console.log('Conteúdo:', evolucao.data.evolucao);
```

---

## Códigos de Erro

| Status | Descrição |
|--------|-----------|
| **200** | Sucesso |
| **401** | Não autenticado (JWT inválido/expirado) |
| **403** | Não autorizado |
| **404** | Recurso não encontrado |
| **500** | Erro no servidor |

**Exemplo de erro 404:**
```json
{
  "detail": "Evolução não encontrada"
}
```

---

## Dicas de Integração

### 1. Sempre verificar autenticação
```typescript
if (!token) {
  // Redirecionar para login
  navigation.navigate('Login');
  return;
}
```

### 2. Tratamento de erros
```typescript
try {
  const { data } = await api.get('mobile/unidades');
} catch (error) {
  if (error.response?.status === 401) {
    // Token expirado, fazer refresh
  } else if (error.response?.status === 404) {
    // Recurso não encontrado
  } else {
    // Erro genérico
  }
}
```

### 3. Loading states
```typescript
const [loading, setLoading] = useState(false);

async function carregar() {
  setLoading(true);
  try {
    const { data } = await api.get('mobile/unidades');
  } finally {
    setLoading(false);
  }
}
```

### 4. Paginação
```typescript
const [page, setPage] = useState(1);

async function carregarProxima() {
  const { data } = await api.get(`mobile/unidade/20/evolucoes`, {
    params: { page: page + 1 }
  });
  if (data.next) {
    setPage(page + 1);
  }
}
```

---

## Testing com Postman/Insomnia

**Postman Collection JSON:**
```json
{
  "info": {
    "name": "Mobile API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Get Unidades",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/mobile/unidades",
          "host": ["{{base_url}}"],
          "path": ["mobile", "unidades"]
        }
      }
    },
    {
      "name": "Get Pacientes",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{jwt_token}}"
          }
        ],
        "url": {
          "raw": "{{base_url}}/mobile/unidade/20/paciente?is_active=true",
          "host": ["{{base_url}}"],
          "path": ["mobile", "unidade", "20", "paciente"],
          "query": [
            {
              "key": "is_active",
              "value": "true"
            }
          ]
        }
      }
    }
  ]
}
```

---

## Variáveis de Ambiente

```typescript
// .env ou .env.local
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ou para Expo:

```typescript
// constants/config.ts
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';
export const JWT_TOKEN = process.env.EXPO_PUBLIC_JWT_TOKEN;
```

