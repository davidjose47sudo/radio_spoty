# AuraRadio - Deployment Guide

Este proyecto ha sido actualizado con un esquema de base de datos completo y funcionalidad de generación de radios con IA.

## 🚀 Pasos para el Deployment

### 1. Aplicar el Esquema de Base de Datos

Ejecuta los siguientes scripts SQL en tu consola de Supabase en este orden:

```sql
-- 1. Aplicar el esquema completo y las migraciones
-- Ejecutar: scripts/deploy-database-updates.sql

-- 2. Aplicar las políticas de seguridad RLS
-- Ejecutar: scripts/01-create-rls-policies.sql
```

### 2. Configurar Variables de Entorno

Asegúrate de que tu archivo `.env` tenga todas estas variables:

```env
# Supabase Configuration (ya tienes estas)
POSTGRES_URL="tu_postgres_url"
SUPABASE_URL="tu_supabase_url"
NEXT_PUBLIC_SUPABASE_URL="tu_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key"
SUPABASE_SERVICE_ROLE_KEY="tu_service_role_key"

# Nuevas variables necesarias
GEMINI_API_KEY="tu_clave_de_google_gemini"
CRON_SECRET="un_secreto_seguro_para_cron_jobs"
```

### 3. Obtener Google Gemini API Key

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto o usa uno existente
4. Ve a "Get API Key"
5. Copia la clave y agrégala a tu `.env` como `GEMINI_API_KEY`

### 4. Instalar Dependencias

```bash
npm install
# o
pnpm install
```

### 5. Ejecutar la Aplicación

```bash
npm run dev
# o
pnpm dev
```

## 🗃️ Estructura de Base de Datos

### Tablas Principales

- **profiles**: Perfiles de usuario con subscripciones y preferencias
- **artists**: Información de artistas
- **albums**: Albums de música
- **songs**: Canciones con referencias a artistas y albums
- **playlists**: Listas de reproducción de usuarios
- **playlist_tracks**: Relación muchos a muchos entre playlists y songs
- **jams**: Sesiones de música colaborativa
- **radio_stations**: Estaciones de radio (tradicionales y generadas por IA)
- **radio_station_songs**: Canciones en cada estación de radio
- **subscriptions**: Subscripciones de usuarios
- **ai_radio_jobs**: Jobs de generación de radios con IA
- **weekly_ai_radios**: Radios semanales generadas automáticamente

### Funcionalidades de IA

1. **Generación de Radios Personalizadas**: Los usuarios premium pueden describir su radio ideal y la IA selecciona canciones de la base de datos
2. **Radios Semanales Automáticas**: Los usuarios premium reciben automáticamente una radio nueva cada semana con temas variados
3. **Procesamiento Asíncrono**: Las generaciones de IA se procesan en background para no bloquear la interfaz

## 🔧 APIs Disponibles

### Generación de Radios con IA

- `POST /api/ai-radio/generate` - Generar una nueva radio con IA
- `GET /api/ai-radio/status?jobId=xxx` - Verificar estado de generación
- `GET /api/ai-radio/weekly` - Obtener la radio semanal del usuario
- `POST /api/ai-radio/weekly` - Generar radios semanales (solo admin)

### Procesamiento de Cron Jobs

- `POST /api/cron/process-ai-jobs` - Procesar jobs pendientes de IA

## 🎵 Componentes Principales

### AIRadioGenerator

Un componente React que permite a usuarios premium generar radios personalizadas:

```tsx
import { AIRadioGenerator } from '@/components/ai-radio-generator'

// En tu página/componente
<AIRadioGenerator userSubscription={userSubscription} />
```

## 📝 Funciones de Base de Datos

- `increment_play_count(user_id)`: Incrementa el contador de reproducciones
- `update_playlist_stats()`: Actualiza estadísticas de playlists automáticamente
- `generate_weekly_ai_radio()`: Genera radios semanales para usuarios premium

## 🔒 Seguridad

- **Row Level Security (RLS)** habilitado en todas las tablas
- Los usuarios solo pueden acceder a sus propios datos
- Las funciones de IA requieren subscription premium
- Políticas granulares por tipo de contenido (público vs privado)

## 🚨 Notas Importantes

1. **Carga de Canciones**: Asegúrate de tener canciones en tu base de datos antes de usar las funciones de IA
2. **Gemini API**: La generación de IA requiere una clave válida de Google Gemini
3. **Subscripciones**: Solo usuarios con planes 'premium' o 'family' pueden usar funciones de IA
4. **Cron Jobs**: Configura un cron job para ejecutar `/api/cron/process-ai-jobs` cada 5-10 minutos

## 🔄 Cron Job Setup (Opcional)

Para procesar automáticamente los jobs de IA, configura un cron job que llame:

```bash
curl -X POST https://tu-dominio.com/api/cron/process-ai-jobs \
  -H "Authorization: Bearer tu_cron_secret"
```

## 📚 Ejemplos de Uso

### Crear una Radio con IA

```typescript
const response = await fetch('/api/ai-radio/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'Música relajante para estudiar, con instrumentales y acoustic'
  })
})
```

### Verificar Estado de Generación

```typescript
const status = await fetch(`/api/ai-radio/status?jobId=${jobId}`)
const data = await status.json()
console.log(data.status) // 'pending', 'processing', 'completed', 'failed'
```

¡Tu aplicación AuraRadio ahora está lista con funcionalidades completas de IA para generación de radios personalizadas! 🎉
