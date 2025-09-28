import { EnhancedPatient } from './enhanced-patient-management'

export interface SecurityConfig {
  encryptionEnabled: boolean
  auditLogEnabled: boolean
  accessControlEnabled: boolean
  sessionTimeout: number // minutes
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxAge: number // days
  }
  hipaaCompliance: boolean
  dataRetentionPeriod: number // days
}

export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userRole: string
  action: string
  resource: string
  resourceId?: string
  ipAddress?: string
  userAgent?: string
  success: boolean
  errorMessage?: string
  sensitiveDataAccessed?: boolean
}

export interface AccessControl {
  userId: string
  role: 'admin' | 'practitioner' | 'staff' | 'readonly'
  permissions: string[]
  dataAccessLevel: 'full' | 'limited' | 'readonly'
  expiryDate?: Date
  active: boolean
}

export interface DataPrivacySettings {
  patientId: string
  consentGiven: boolean
  consentDate: Date
  dataProcessingPurposes: string[]
  dataRetentionConsent: boolean
  marketingConsent: boolean
  researchConsent: boolean
  thirdPartySharing: boolean
  rightsExercised: Array<{
    right: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection'
    requestDate: Date
    completedDate?: Date
    status: 'pending' | 'completed' | 'rejected'
  }>
}

export class SecurityComplianceService {
  private static readonly AUDIT_LOG_KEY = 'security_audit_log'
  private static readonly ACCESS_CONTROL_KEY = 'access_control'
  private static readonly PRIVACY_SETTINGS_KEY = 'privacy_settings'
  private static readonly SECURITY_CONFIG_KEY = 'security_config'
  
  private static readonly DEFAULT_CONFIG: SecurityConfig = {
    encryptionEnabled: true,
    auditLogEnabled: true,
    accessControlEnabled: true,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90
    },
    hipaaCompliance: true,
    dataRetentionPeriod: 2555 // 7 years in days
  }

  // Security Configuration
  static getSecurityConfig(): SecurityConfig {
    const stored = localStorage.getItem(this.SECURITY_CONFIG_KEY)
    return stored ? JSON.parse(stored) : this.DEFAULT_CONFIG
  }

  static updateSecurityConfig(config: Partial<SecurityConfig>): void {
    const currentConfig = this.getSecurityConfig()
    const updatedConfig = { ...currentConfig, ...config }
    localStorage.setItem(this.SECURITY_CONFIG_KEY, JSON.stringify(updatedConfig))
    
    this.logAudit('admin', 'security-config-update', 'configuration', undefined, true)
  }

  // Data Encryption
  static encryptSensitiveData(data: string, key?: string): string {
    if (!this.getSecurityConfig().encryptionEnabled) {
      return data
    }
    
    // Simple encryption for demo - use proper crypto libraries in production
    const encryptionKey = key || 'AhaarWISE_2024_SecureKey'
    let encrypted = ''
    
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length)
      encrypted += String.fromCharCode(charCode)
    }
    
    return btoa(encrypted) // Base64 encode
  }

  static decryptSensitiveData(encryptedData: string, key?: string): string {
    if (!this.getSecurityConfig().encryptionEnabled) {
      return encryptedData
    }
    
    try {
      const encryptionKey = key || 'AhaarWISE_2024_SecureKey'
      const decoded = atob(encryptedData)
      let decrypted = ''
      
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ encryptionKey.charCodeAt(i % encryptionKey.length)
        decrypted += String.fromCharCode(charCode)
      }
      
      return decrypted
    } catch (error) {
      console.error('Decryption failed:', error)
      return ''
    }
  }

  // Audit Logging
  static logAudit(
    userId: string,
    action: string,
    resource: string,
    resourceId?: string,
    success: boolean = true,
    errorMessage?: string,
    sensitiveDataAccessed: boolean = false
  ): void {
    if (!this.getSecurityConfig().auditLogEnabled) {
      return
    }

    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      userId,
      userRole: this.getUserRole(userId),
      action,
      resource,
      resourceId,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      success,
      errorMessage,
      sensitiveDataAccessed
    }

    const logs = this.getAuditLogs()
    logs.push(entry)

    // Keep only last 10,000 entries to prevent storage overflow
    if (logs.length > 10000) {
      logs.splice(0, logs.length - 10000)
    }

    localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(logs))
  }

  static getAuditLogs(filters?: {
    userId?: string
    action?: string
    resource?: string
    startDate?: Date
    endDate?: Date
    sensitiveDataOnly?: boolean
  }): AuditLogEntry[] {
    const stored = localStorage.getItem(this.AUDIT_LOG_KEY)
    let logs: AuditLogEntry[] = stored ? JSON.parse(stored).map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    })) : []

    if (!filters) return logs

    // Apply filters
    if (filters.userId) {
      logs = logs.filter(log => log.userId === filters.userId)
    }
    if (filters.action) {
      logs = logs.filter(log => log.action === filters.action)
    }
    if (filters.resource) {
      logs = logs.filter(log => log.resource === filters.resource)
    }
    if (filters.startDate) {
      logs = logs.filter(log => log.timestamp >= filters.startDate!)
    }
    if (filters.endDate) {
      logs = logs.filter(log => log.timestamp <= filters.endDate!)
    }
    if (filters.sensitiveDataOnly) {
      logs = logs.filter(log => log.sensitiveDataAccessed)
    }

    return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Access Control
  static setUserAccessControl(userId: string, accessControl: Omit<AccessControl, 'userId'>): void {
    const controls = this.getAllAccessControls()
    const existingIndex = controls.findIndex(c => c.userId === userId)
    
    const newControl: AccessControl = { userId, ...accessControl }
    
    if (existingIndex >= 0) {
      controls[existingIndex] = newControl
    } else {
      controls.push(newControl)
    }
    
    localStorage.setItem(this.ACCESS_CONTROL_KEY, JSON.stringify(controls))
    this.logAudit('system', 'access-control-update', 'user-permissions', userId, true)
  }

  static getUserAccessControl(userId: string): AccessControl | null {
    const controls = this.getAllAccessControls()
    return controls.find(c => c.userId === userId) || null
  }

  static checkPermission(userId: string, permission: string): boolean {
    const control = this.getUserAccessControl(userId)
    if (!control || !control.active) return false
    
    // Check expiry
    if (control.expiryDate && control.expiryDate < new Date()) {
      return false
    }
    
    return control.permissions.includes(permission) || control.permissions.includes('*')
  }

  static getAllAccessControls(): AccessControl[] {
    const stored = localStorage.getItem(this.ACCESS_CONTROL_KEY)
    return stored ? JSON.parse(stored).map((control: any) => ({
      ...control,
      expiryDate: control.expiryDate ? new Date(control.expiryDate) : undefined
    })) : []
  }

  // Data Privacy and GDPR Compliance
  static setPatientPrivacySettings(settings: DataPrivacySettings): void {
    const allSettings = this.getAllPrivacySettings()
    const existingIndex = allSettings.findIndex(s => s.patientId === settings.patientId)
    
    if (existingIndex >= 0) {
      allSettings[existingIndex] = settings
    } else {
      allSettings.push(settings)
    }
    
    localStorage.setItem(this.PRIVACY_SETTINGS_KEY, JSON.stringify(allSettings))
    this.logAudit('system', 'privacy-settings-update', 'patient-privacy', settings.patientId, true, undefined, true)
  }

  static getPatientPrivacySettings(patientId: string): DataPrivacySettings | null {
    const allSettings = this.getAllPrivacySettings()
    return allSettings.find(s => s.patientId === patientId) || null
  }

  static getAllPrivacySettings(): DataPrivacySettings[] {
    const stored = localStorage.getItem(this.PRIVACY_SETTINGS_KEY)
    return stored ? JSON.parse(stored).map((settings: any) => ({
      ...settings,
      consentDate: new Date(settings.consentDate),
      rightsExercised: settings.rightsExercised.map((right: any) => ({
        ...right,
        requestDate: new Date(right.requestDate),
        completedDate: right.completedDate ? new Date(right.completedDate) : undefined
      }))
    })) : []
  }

  // GDPR Rights Implementation
  static exerciseDataRight(
    patientId: string,
    right: 'access' | 'rectification' | 'erasure' | 'portability' | 'objection'
  ): { success: boolean; requestId: string; estimatedCompletion: Date } {
    const settings = this.getPatientPrivacySettings(patientId)
    if (!settings) {
      throw new Error('Patient privacy settings not found')
    }

    const requestId = `right_${Date.now()}`
    const estimatedCompletion = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    settings.rightsExercised.push({
      right,
      requestDate: new Date(),
      status: 'pending'
    })

    this.setPatientPrivacySettings(settings)
    this.logAudit('system', `gdpr-right-${right}`, 'patient-data', patientId, true, undefined, true)

    return {
      success: true,
      requestId,
      estimatedCompletion
    }
  }

  // Data Retention and Cleanup
  static cleanupExpiredData(): {
    patientsRemoved: number
    logsRemoved: number
    bytesFreed: number
  } {
    const config = this.getSecurityConfig()
    const cutoffDate = new Date(Date.now() - config.dataRetentionPeriod * 24 * 60 * 60 * 1000)
    
    let patientsRemoved = 0
    let logsRemoved = 0
    let bytesFreed = 0

    // Clean up old audit logs
    const logs = this.getAuditLogs()
    const originalLogCount = logs.length
    const filteredLogs = logs.filter(log => log.timestamp > cutoffDate)
    logsRemoved = originalLogCount - filteredLogs.length
    
    if (logsRemoved > 0) {
      localStorage.setItem(this.AUDIT_LOG_KEY, JSON.stringify(filteredLogs))
    }

    // In a real implementation, would clean up patient data based on consent and legal requirements
    // For demo purposes, we don't actually delete patient data

    this.logAudit('system', 'data-cleanup', 'system-maintenance', undefined, true)

    return {
      patientsRemoved,
      logsRemoved,
      bytesFreed: logsRemoved * 500 // Estimated bytes per log entry
    }
  }

  // Security Monitoring and Alerts
  static getSecurityAlerts(): Array<{
    id: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    type: string
    message: string
    timestamp: Date
    resolved: boolean
  }> {
    const alerts = []
    const logs = this.getAuditLogs()
    const recentLogs = logs.filter(log => 
      log.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
    )

    // Check for multiple failed login attempts
    const failedLogins = recentLogs.filter(log => 
      log.action === 'login' && !log.success
    )
    
    if (failedLogins.length > 5) {
      alerts.push({
        id: `alert_${Date.now()}`,
        severity: 'high' as const,
        type: 'authentication',
        message: `${failedLogins.length} failed login attempts in the last 24 hours`,
        timestamp: new Date(),
        resolved: false
      })
    }

    // Check for unusual data access patterns
    const sensitiveAccess = recentLogs.filter(log => log.sensitiveDataAccessed)
    if (sensitiveAccess.length > 50) {
      alerts.push({
        id: `alert_${Date.now() + 1}`,
        severity: 'medium' as const,
        type: 'data-access',
        message: `High volume of sensitive data access: ${sensitiveAccess.length} operations`,
        timestamp: new Date(),
        resolved: false
      })
    }

    return alerts
  }

  // Password Security
  static validatePassword(password: string): {
    valid: boolean
    errors: string[]
    strength: 'weak' | 'fair' | 'good' | 'strong'
  } {
    const config = this.getSecurityConfig()
    const policy = config.passwordPolicy
    const errors: string[] = []

    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters long`)
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }

    // Calculate strength
    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
    let score = 0

    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
    if (password.length >= 16) score++

    if (score <= 2) strength = 'weak'
    else if (score <= 4) strength = 'fair'
    else if (score <= 6) strength = 'good'
    else strength = 'strong'

    return {
      valid: errors.length === 0,
      errors,
      strength
    }
  }

  // Session Management
  static createSession(userId: string): string {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session = {
      id: sessionId,
      userId,
      createdAt: new Date(),
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + this.getSecurityConfig().sessionTimeout * 60 * 1000)
    }

    const sessions = this.getActiveSessions()
    sessions.push(session)
    localStorage.setItem('active_sessions', JSON.stringify(sessions))

    this.logAudit(userId, 'session-create', 'authentication', sessionId, true)
    return sessionId
  }

  static validateSession(sessionId: string): boolean {
    const sessions = this.getActiveSessions()
    const session = sessions.find(s => s.id === sessionId)
    
    if (!session) return false
    if (new Date() > new Date(session.expiresAt)) {
      this.invalidateSession(sessionId)
      return false
    }

    // Update last activity
    session.lastActivity = new Date()
    session.expiresAt = new Date(Date.now() + this.getSecurityConfig().sessionTimeout * 60 * 1000)
    localStorage.setItem('active_sessions', JSON.stringify(sessions))

    return true
  }

  static invalidateSession(sessionId: string): void {
    const sessions = this.getActiveSessions()
    const filteredSessions = sessions.filter(s => s.id !== sessionId)
    localStorage.setItem('active_sessions', JSON.stringify(filteredSessions))
    
    this.logAudit('system', 'session-invalidate', 'authentication', sessionId, true)
  }

  private static getActiveSessions(): any[] {
    const stored = localStorage.getItem('active_sessions')
    return stored ? JSON.parse(stored).map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      lastActivity: new Date(session.lastActivity),
      expiresAt: new Date(session.expiresAt)
    })) : []
  }

  // Utility methods
  private static getUserRole(userId: string): string {
    const control = this.getUserAccessControl(userId)
    return control?.role || 'unknown'
  }

  private static getClientIP(): string {
    // In a real application, this would get the actual client IP
    return '127.0.0.1'
  }

  // Compliance Reporting
  static generateComplianceReport(): {
    overall: 'compliant' | 'partial' | 'non-compliant'
    hipaa: { compliant: boolean; score: number; issues: string[] }
    gdpr: { compliant: boolean; score: number; issues: string[] }
    iso27001: { compliant: boolean; score: number; issues: string[] }
    recommendations: string[]
  } {
    const config = this.getSecurityConfig()
    const logs = this.getAuditLogs()
    const privacySettings = this.getAllPrivacySettings()
    
    const hipaaIssues: string[] = []
    const gdprIssues: string[] = []
    const iso27001Issues: string[] = []

    // HIPAA Compliance Check
    if (!config.encryptionEnabled) hipaaIssues.push('Data encryption not enabled')
    if (!config.auditLogEnabled) hipaaIssues.push('Audit logging not enabled')
    if (!config.accessControlEnabled) hipaaIssues.push('Access controls not enabled')
    
    // GDPR Compliance Check
    const patientsWithoutConsent = privacySettings.filter(p => !p.consentGiven).length
    if (patientsWithoutConsent > 0) {
      gdprIssues.push(`${patientsWithoutConsent} patients without explicit consent`)
    }
    
    // ISO 27001 Compliance Check
    if (config.sessionTimeout > 60) iso27001Issues.push('Session timeout too long')
    if (!config.passwordPolicy.requireSpecialChars) iso27001Issues.push('Weak password policy')

    const hipaaScore = Math.max(0, 100 - hipaaIssues.length * 25)
    const gdprScore = Math.max(0, 100 - gdprIssues.length * 20)
    const iso27001Score = Math.max(0, 100 - iso27001Issues.length * 15)

    const overallScore = (hipaaScore + gdprScore + iso27001Score) / 3
    const overall = overallScore >= 90 ? 'compliant' : overallScore >= 70 ? 'partial' : 'non-compliant'

    return {
      overall,
      hipaa: { compliant: hipaaIssues.length === 0, score: hipaaScore, issues: hipaaIssues },
      gdpr: { compliant: gdprIssues.length === 0, score: gdprScore, issues: gdprIssues },
      iso27001: { compliant: iso27001Issues.length === 0, score: iso27001Score, issues: iso27001Issues },
      recommendations: [
        'Regular security training for all staff',
        'Quarterly security audits',
        'Update password policies annually',
        'Review data retention policies',
        'Implement multi-factor authentication'
      ]
    }
  }
}