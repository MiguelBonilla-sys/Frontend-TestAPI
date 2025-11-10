/**
 * API Types - Generated from OpenAPI Schema
 * Base types for API responses and requests
 */

// ============= Base Response Types =============

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  timestamp?: string;
  data?: T;
  count?: number;
}

export interface ErrorResponse {
  success: false;
  message: string;
  timestamp: string;
  errors?: Array<Record<string, unknown>>;
  error_code?: string;
  error_type?: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  count?: number;
  pagination?: PaginationMeta;
  timestamp?: string;
}

// ============= Authentication Types =============

export interface UserResponse {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserResponse;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  role?: 'desarrolladora' | 'editor' | 'superadmin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends ApiResponse<TokenResponse> {
  success: true;
  data: TokenResponse;
}

export interface RegisterResponse extends ApiResponse<UserResponse> {
  success: true;
  data: UserResponse;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshResponse extends ApiResponse<TokenResponse> {
  success: true;
  data: TokenResponse;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface LogoutResponse extends ApiResponse {
  success: true;
}

// ============= Role & Permission Types =============

export interface RoleResponse {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  user_count?: number;
}

export interface PermissionResponse {
  name: string;
  description: string;
}

export interface RolePermissionsResponse {
  role: RoleResponse;
  permissions: PermissionResponse[];
}

export interface RolePermissionsApiResponse extends ApiResponse<RolePermissionsResponse> {
  success: true;
  data: RolePermissionsResponse;
}

export interface CheckPasswordStrengthRequest {
  password: string;
}

export interface PasswordStrengthResponse extends ApiResponse {
  success: true;
  data: {
    strength: 'weak' | 'medium' | 'strong' | 'very_strong';
    score: number;
    feedback?: string[];
  };
}

// ============= 2FA Types =============

export interface Verify2FARequest {
  temp_token: string;
  otp_code: string;
  challenge_id?: string;
}

export interface Enable2FAResponse extends ApiResponse {
  success: true;
  data: {
    qr_code?: string;
    secret?: string;
    message: string;
  };
}

export interface Confirm2FAResponse extends ApiResponse {
  success: true;
  data: {
    message: string;
  };
}

export interface TwoFAStatusData {
  enabled: boolean;
  verified?: boolean;
}

export interface TwoFAStatusResponse extends ApiResponse<TwoFAStatusData> {
  success: true;
  data: TwoFAStatusData;
}

// ============= Desarrolladora Types =============

export interface DesarrolladoraResponse {
  id: number;
  nombre: string;
  pais?: string;
  fundacion?: number;
  sitio_web?: string;
  descripcion?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface DesarrolladoraListParams extends PaginationParams {
  pais?: string;
  buscar?: string;
  ordenar?: string;
  direccion?: 'asc' | 'desc';
}

export interface DesarrolladoraSearchParams {
  nombre?: string;
  pais?: string;
  fundacion_desde?: number;
  fundacion_hasta?: number;
  empleados_min?: number;
  empleados_max?: number;
}

// ============= Videojuego Types =============

export interface VideojuegoResponse {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  valoracion: number;
  desarrolladora_id?: number;
  desarrolladora?: DesarrolladoraResponse;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface VideojuegoCreateRequest {
  nombre: string;
  categoria: string;
  precio: number;
  valoracion: number;
  desarrolladora_id?: number;
}

export interface VideojuegoUpdateRequest {
  nombre?: string;
  categoria?: string;
  precio?: number;
  valoracion?: number;
  desarrolladora_id?: number;
}

export interface VideojuegoListParams extends PaginationParams {
  categoria?: string;
  desarrolladora?: string;
  buscar?: string;
  ordenar?: 'nombre' | 'precio' | 'valoracion' | 'categoria';
  direccion?: 'asc' | 'desc';
}

export interface VideojuegoSearchParams {
  nombre?: string;
  categoria?: string;
  desarrolladora?: string;
  precio_min?: number;
  precio_max?: number;
  valoracion_min?: number;
  valoracion_max?: number;
  fecha_lanzamiento_desde?: string;
  fecha_lanzamiento_hasta?: string;
}

export interface VideojuegoListResponse extends ApiResponse<VideojuegoResponse[]> {
  success: true;
  data: VideojuegoResponse[];
  count?: number;
}

export interface VideojuegoDetailResponse extends ApiResponse<VideojuegoResponse> {
  success: true;
  data: VideojuegoResponse;
}

export interface VideojuegoCreateResponse extends ApiResponse<VideojuegoResponse> {
  success: true;
  data: VideojuegoResponse;
}

export interface VideojuegoUpdateResponse extends ApiResponse<VideojuegoResponse> {
  success: true;
  data: VideojuegoResponse;
}

export interface VideojuegoDeleteResponse extends ApiResponse {
  success: true;
}

export interface CategoriasResponse extends ApiResponse<string[]> {
  success: true;
  data: string[];
  count?: number;
}

export interface EstadisticasData {
  total_videojuegos: number;
  categorias_unicas: number;
  precio_promedio: number;
  valoracion_promedio: number;
}

export interface EstadisticasResponse extends ApiResponse<EstadisticasData> {
  success: true;
  data: EstadisticasData;
}

// ============= Admin Types =============

export interface UserListResponse extends PaginatedResponse<UserResponse> {
  success: true;
  data: UserResponse[];
  count?: number;
}

export interface UserDetailResponse extends ApiResponse<UserResponse> {
  success: true;
  data: UserResponse;
}

export interface SystemStatsData {
  total_users: number;
  total_videojuegos: number;
  total_desarrolladoras: number;
  roles_count: Record<string, number>;
}

export interface SystemStatsResponse extends ApiResponse<SystemStatsData> {
  success: true;
  data: SystemStatsData;
}

// ============= Sync Logs Types =============

export interface SyncLogResponse {
  id: number;
  status: 'pending' | 'running' | 'success' | 'failed';
  api_source: 'rawg' | 'steam' | 'igdb';
  games_processed?: number;
  games_successful?: number;
  games_failed?: number;
  games_skipped?: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface SyncLogListParams extends PaginationParams {
  status?: 'pending' | 'success' | 'failed';
  api_source?: 'rawg' | 'steam' | 'igdb';
}

export interface SyncLogListResponse extends PaginatedResponse<SyncLogResponse> {
  success: true;
  data: SyncLogResponse[];
  count?: number;
}

export interface SyncLogStatisticsData {
  total: number;
  successful: number;
  failed: number;
  pending: number;
  success_rate: number;
}

export interface SyncLogStatisticsResponse extends ApiResponse<SyncLogStatisticsData> {
  success: true;
  data: SyncLogStatisticsData;
}

// ============= Videojuegos Avanzados Types =============

export interface ImportBatchGame {
  external_id: string;
}

export interface ImportBatchRequest {
  games?: ImportBatchGame[];
}

export interface ImportBatchResult {
  success: VideojuegoResponse[];
  failed: Array<{ external_id: string; error: string }>;
  skipped: Array<{ external_id: string; reason: string }>;
}

export interface ImportBatchResponse extends ApiResponse<ImportBatchResult> {
  success: true;
  data: ImportBatchResult;
  message: string; // e.g., "Importación completada: 5 exitosos, 1 fallidos, 0 omitidos"
}

export interface VideojuegoEnriquecidoData extends VideojuegoResponse {
  plataformas?: string[];
  screenshots?: string[];
  tags?: string[];
  external_id?: string;
}

export interface VideojuegoEnriquecidoResponse extends ApiResponse<VideojuegoEnriquecidoData> {
  success: true;
  data: VideojuegoEnriquecidoData;
}

export interface SyncStatusData {
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  progress?: number;
  result?: unknown;
}

export interface SyncStatusResponse extends ApiResponse<SyncStatusData> {
  success: true;
  data: SyncStatusData;
}
