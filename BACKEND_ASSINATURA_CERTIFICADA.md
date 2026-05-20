# Backend - Assinatura Certificada de Médico em Evolução

## Resumo
Feature de assinatura digital certificada para evoluções de pacientes no app mobile Protea. Segue o mesmo padrão implementado no PRDWebProtea.

---

## 1. Modelos Django

### DocumentosAssinados (já existe)
```python
class DocumentosAssinados(models.Model):
    documento_fk = ForeignKey(DocumentoPaciente, on_delete=CASCADE)
    tcn = CharField(max_length=300)  # Token de assinatura do certificado
    result = CharField(max_length=300)  # Resultado da assinatura
    file_data = TextField(null=True, blank=True)  # PDF em base64
    assinado_por = ForeignKey(PrestadorServico, null=True, blank=True)
    storage_path = CharField(null=True, max_length=255)
    
    @property
    def storage_url(self):
        if not self.storage_path:
            return None
        return f"{STORAGE_BASE_URL}{self.storage_path}"
```

**Status**: ✅ Já existe no backend

---

## 2. Endpoints Necessários

### 2.1 `POST /prestador/cpfCertificado`
**Descrição**: Retorna informações do certificado do profissional logado

**Autenticação**: JWT (Bearer token)

**Request**: Body vazio (usa usuário do token)

**Response**:
```json
{
  "id": 123,
  "cpf": "123.456.789-10",
  "habilitar": true
}
```

**Notas**:
- `habilitar`: boolean que indica se o certificado digital está ativado
- Se `habilitar: false`, não deve permitir assinatura
- CPF deve estar sem máscara ou pode estar com máscara (mobile faz `.replace(/\D/g, '')`)

**Status**: ❓ Verificar se existe no PRDBackend

---

### 2.2 `POST /prestador/autenticarCertificado`
**Descrição**: Autentica o certificado digital com a senha

**Autenticação**: JWT (Bearer token)

**Request**:
```json
{
  "senha": "string",
  "cpf": "12345678910"
}
```

**Response**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Notas**:
- O `access_token` retornado é usado nos próximos endpoints
- Deve validar senha do certificado
- CPF sem máscara

**Status**: ❓ Verificar se existe no PRDBackend

---

### 2.3 `POST /prestador/buscarCertificadoAlias`
**Descrição**: Busca os aliases disponíveis do certificado digital

**Autenticação**: JWT (Bearer token) + access_token do certificado

**Request**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response**:
```json
{
  "certificates": [
    {
      "alias": "nome-do-certificado",
      "subject": "CN=Nome Profissional",
      "issuer": "CN=Autoridade Certificadora"
    }
  ]
}
```

**Notas**:
- Retorna array de certificados (usar o primeiro `[0]`)
- O `alias` é usado para assinar o documento

**Status**: ❓ Verificar se existe no PRDBackend

---

### 2.4 `POST /prestador/assinarDocumento`
**Descrição**: Assina o documento com o certificado digital

**Autenticação**: JWT (Bearer token) + access_token do certificado

**Request**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "certificado_alias": "nome-do-certificado",
  "file_data": "JVBERi0xLjQK..."  // PDF em base64
}
```

**Response**:
```json
{
  "tcn": "2024-05-20T10:30:00Z-123456789",
  "documents": [
    {
      "result": "signature-result-hash"
    }
  ]
}
```

**Notas**:
- `file_data` é o PDF em formato base64
- `tcn`: Token de Confirmação de Não-repúdio (timestamp + hash)
- `result`: Hash ou string que confirma a assinatura

**Status**: ❓ Verificar se existe no PRDBackend

---

### 2.5 `POST /prestador/salvarDadosAssinatura`
**Descrição**: Salva os dados da assinatura no banco de dados

**Autenticação**: JWT (Bearer token)

**Request**:
```json
{
  "tcn": "2024-05-20T10:30:00Z-123456789",
  "documento_fk": 456,
  "result": "signature-result-hash"
}
```

**Response**:
```json
{
  "id": 789,
  "documento_fk": 456,
  "tcn": "2024-05-20T10:30:00Z-123456789",
  "result": "signature-result-hash",
  "assinado_por": 123,
  "assinado_em": "2024-05-20T10:35:00Z"
}
```

**Lógica**:
```python
def salvar_dados_assinatura(self, user, dados):
    documento = DocumentoPaciente.objects.get(id=dados.documento_fk)
    usuario_protea = UsuarioProtea.objects.get(userfk=user)
    assinatura, _ = DocumentosAssinados.objects.get_or_create(
        documento_fk=documento
    )
    
    assinatura.tcn = dados.tcn
    assinatura.result = dados.result
    assinatura.assinado_por_id = usuario_protea.prestadorfk_id
    assinatura.save()
    
    return assinatura
```

**Status**: ✅ Já existe no backend (PRDBackend)

---

## 3. DTOs (Pydantic/Ninja)

### DadosAssinados
```python
class DadosAssinados(Schema):
    tcn: Optional[str]
    documento_fk: Optional[int]
    result: Optional[str]
```

### CertificadoInfo
```python
class CertificadoInfo(Schema):
    id: int
    cpf: str
    habilitar: bool
```

**Status**: ✅ DadosAssinados existe no backend

---

## 4. Integração com EvolucaoDetalhes (Mobile)

### Endpoint necessário: `GET /mobile/evolucoes/{id}`

Deve retornar com campos adicionais:

```json
{
  "id": 123,
  "data": "2024-05-20",
  "hora": "10:30",
  "tipo": "Evolução Clínica",
  "evolucao": "Paciente apresentou melhora...",
  "paciente_id": 456,
  "paciente_nome": "João Silva",
  "document_id": 789,
  "arquivo": null,
  "file_data": "JVBERi0xLjQK...",
  "storage_url": null,
  "pode_assinar": true,
  "assinatura": {
    "id": 1001,
    "documento_fk": 789,
    "tcn": "2024-05-20T10:30:00Z-123456789",
    "result": "signature-result-hash",
    "assinado_por": {
      "id": 999,
      "nome": "Dr. Silva"
    },
    "assinado_em": "2024-05-20T10:35:00Z",
    "storage_url": "https://storage.protea/assinado/123.pdf"
  }
}
```

**Campos necessários**:
- `document_id`: ID do DocumentoPaciente (usado em salvarDadosAssinatura)
- `pode_assinar`: boolean (true se é evolução pendente e do profissional logado)
- `assinatura`: dados da assinatura se já foi assinada (null se pendente)

**Status**: ❓ Verificar se retorna todos estes campos

---

## 5. Dados para Testes

### Pré-requisitos:
1. ✅ Usuário profissional logado com JWT token
2. ✅ PrestadorServico com `assinatura_digital=True`
3. ✅ CertificadoDigital ativo e habilitado
4. ✅ Evolução pendente de assinatura

### Dados de Teste:

#### a) Profissional com Certificado
```python
# Usuario Admin
user_admin = User.objects.create_user(
    username='dr.silva',
    email='silva@protea.local',
    password='senha123'
)

# Prestador Serviço
prestador = PrestadorServico.objects.create(
    usuario_fk=user_admin,
    nome='Dr. Silva Santos',
    cpf='123.456.789-10',
    profissao=Profissao.objects.first(),  # Médico
    assinatura_digital=True
)

# Usuario Protea
UsuarioProtea.objects.create(
    userfk=user_admin,
    prestadorfk=prestador
)

# Certificado Digital (se houver modelo)
# CertificadoDigital.objects.create(
#     prestador=prestador,
#     cpf='12345678910',
#     habilitar=True,
#     data_vencimento=date(2026, 12, 31)
# )
```

#### b) Paciente
```python
paciente = Paciente.objects.create(
    nome='João Silva Oliveira',
    datanasc=date(1990, 5, 15),
    cpf='987.654.321-00',
    sexo=Sexo.objects.get(sexo='M')
)
```

#### c) Evolução Pendente de Assinatura
```python
from django.utils import timezone

documento = DocumentoPaciente.objects.create(
    paciente_fk=paciente,
    tipo='Evolução Clínica',
    datainclusao=timezone.now(),
    documento='<html>Conteúdo da evolução...</html>'
)

evolucao = Evolucao.objects.create(
    prestadorservico_fk=prestador,
    pacientefk=paciente,
    dataevolucao=timezone.now(),
    tipoevolucao=TipoEvolucao.objects.first(),
    evolucao='Paciente apresentou melhora significativa nos últimos dias.'
)

# Versão PDF para assinatura
pdf_base64 = generate_pdf_base64(documento)  # Função helper
```

#### d) Dados Mock para Resposta de Certificado
```python
# Retorno simulado de autenticarCertificado
mock_auth_response = {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

# Retorno simulado de buscarCertificadoAlias
mock_alias_response = {
    "certificates": [
        {
            "alias": "dr-silva-2024",
            "subject": "CN=Dr Silva Santos",
            "issuer": "CN=Autoridade Certificadora Brasil"
        }
    ]
}

# Retorno simulado de assinarDocumento
mock_sign_response = {
    "tcn": "2024-05-20T10:30:00Z-ABC123DEF456",
    "documents": [
        {
            "result": "sha256_hash_of_signature_base64"
        }
    ]
}
```

---

## 6. Checklist de Implementação no Backend

- [ ] Verificar se endpoints `/prestador/cpfCertificado` existe
- [ ] Verificar se endpoint `/prestador/autenticarCertificado` existe
- [ ] Verificar se endpoint `/prestador/buscarCertificadoAlias` existe
- [ ] Verificar se endpoint `/prestador/assinarDocumento` existe
- [ ] Verificar se endpoint `/prestador/salvarDadosAssinatura` existe
- [ ] Verificar se endpoint `GET /mobile/evolucoes/{id}` retorna todos os campos necessários
- [ ] Criar/atualizar modelo DocumentoPaciente para armazenar PDF (file_data)
- [ ] Criar/atualizar serializer para incluir assinatura em EvolucaoDetalhes
- [ ] Implementar campo `pode_assinar` na serialização (validar se é do profissional + pendente)
- [ ] Adicionar integração com serviço de certificado digital (se não existe)
- [ ] Criar dados de teste (profissional, paciente, evolução)

---

## 7. Notas de Integração

### Fluxo Completo:

```
Mobile App                          Backend
    |                                  |
    |-- GET /mobile/evolucoes/{id} --> |
    |<-- EvolucaoDetalhes -------------|
    |
    |-- [Clica em "Assinar"]
    |-- POST /prestador/cpfCertificado -> |
    |<-- CertificadoInfo ----------------| 
    |
    |-- [Abre SenhaDialog, digita senha]
    |-- POST /prestador/autenticarCertificado -> |
    |<-- {access_token} -------------------------|
    |
    |-- POST /prestador/buscarCertificadoAlias -> |
    |<-- {certificates[0].alias} ---------------| 
    |
    |-- POST /prestador/assinarDocumento -> |
    |<-- {tcn, documents[0].result} ---------|
    |
    |-- POST /prestador/salvarDadosAssinatura -> |
    |<-- DocumentosAssinados (gravado) ---------|
    |
    |-- [Sucesso! Evolução assinada]
```

---

## 8. Exemplo de Request cURL para Testes

```bash
# 1. Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr.silva",
    "password": "senha123"
  }'

# Salva o token JWT retornado

# 2. Buscar certificado do profissional
curl -X POST http://localhost:8000/prestador/cpfCertificado \
  -H "Authorization: Bearer $JWT_TOKEN"

# 3. Autenticar certificado
curl -X POST http://localhost:8000/prestador/autenticarCertificado \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "senha": "123456",
    "cpf": "12345678910"
  }'

# 4. Buscar alias do certificado
curl -X POST http://localhost:8000/prestador/buscarCertificadoAlias \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'

# 5. Assinar documento
curl -X POST http://localhost:8000/prestador/assinarDocumento \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "certificado_alias": "dr-silva-2024",
    "file_data": "JVBERi0xLjQK..."
  }'

# 6. Salvar dados da assinatura
curl -X POST http://localhost:8000/prestador/salvarDadosAssinatura \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tcn": "2024-05-20T10:30:00Z-ABC123DEF456",
    "documento_fk": 789,
    "result": "sha256_hash_of_signature_base64"
  }'
```

---

## 9. Próximos Passos

1. **Backend**: Validar/implementar endpoints faltantes
2. **Dados de Teste**: Gerar profissional, paciente e evolução de teste
3. **Mobile**: Testar fluxo completo com servidor local
4. **Validação**: Verificar se assinatura está sendo salva corretamente no DB
5. **UI**: Confirmar que badge "Assinado" aparece após assinatura bem-sucedida
