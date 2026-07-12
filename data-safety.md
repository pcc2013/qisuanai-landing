# Nira Data Safety Disclosure

**Last Updated: May 5, 2026**

## 1. Encryption

| Data Type | Encryption Method |
|-----------|-------------------|
| Data in transit | TLS 1.3 (HTTPS) |
| Real-person video calls | WebRTC end-to-end encryption (DTLS-SRTP) |
| Login credentials | Firebase Auth (bcrypt hashing) |
| JWT tokens | HMAC-SHA256 signed, 15-minute validity |
| Data at rest | AES-256 encryption |

## 2. Data Storage Location

All user personal data is stored in **Singapore** (Alibaba Cloud Singapore).

## 3. Access Control

| Role | Accessible Data |
|------|-----------------|
| User (self) | All own data |
| CTO | System logs (anonymized) |
| Data Protection Officer (DPO) | System logs (anonymized) + GDPR request processing |
| Developers | Anonymized development environment data only |
| Other personnel | No access |

## 4. Log Management

| Item | Policy |
|------|--------|
| Log storage location | Singapore |
| Log retention period | 30 days |
| PII (personally identifiable information) | Automatically redacted |
| Audio/video data | Not logged |
| IP addresses | Redacted |

## 5. Data Deletion Timelines

| Deletion Type | Timeline |
|---------------|----------|
| User-initiated account deletion | All personal data cleared within 7 days |
| Biometric consent withdrawal | Related data deleted within 7 days |
| Raw material auto-cleanup | Permanently deleted 7 days after Exclusive Avatar creation |
| Financial record anonymized retention | 7 years |
| Backup data synchronization | Within 30 days |

## 6. Security Incident Response

In the event of a data breach, we will:
1. Notify affected users within 72 hours
2. Report to relevant regulatory authorities within 72 hours (where applicable)
3. Immediately take measures to contain the breach
4. Provide a post-incident investigation report

## 7. Third-Party Security Certifications

| Service | Security Certifications |
|---------|-------------------------|
| Firebase Auth | SOC 1, SOC 2, SOC 3, ISO 27001 |
| Stripe | PCI DSS Level 1 |
| Alibaba Cloud Singapore | ISO 27001, SOC 2, PDPA compliant |

## 8. Enterprise Data Isolation

Enterprise clients receive dedicated data isolation:
- Data stored in a separate, client-dedicated environment
- No shared infrastructure with general users
- Custom data retention policies as defined in the enterprise agreement
- Independent audit trails and access logs

## 9. Local .nira File Format

Exclusive Avatar personality data is stored locally in the `.nira` file format:

### File Structure
- **Header** (128 bytes): Magic number "NIRA0001", version, cleaning level, user ID hash, persona UUID, timestamp
- **Encrypted Payload** (variable): AES-256-GCM encrypted — style vector (1024B), behavior rules, voice fingerprint (512B), face embedding (512B), metadata
- **Signature** (64 bytes): HMAC-SHA256 digital signature
- **Tail Magic** (8 bytes): "NIRA0001"

### Key Distribution
| Key Component | Storage Location | Length |
|---------------|------------------|--------|
| Component A | Device Keychain (iOS Keychain / Android Keystore) | 256-bit |
| Component B | Nira Singapore Server (requires login + token) | 256-bit |
| Component C | Device Fingerprint (hardware-bound) | 256-bit |

Key derivation: HKDF-SHA256(Component A ⊕ Component B ⊕ Component C) → Encryption Key + Signing Key

### Security Properties
- **Magic number validation**: Any deviation → load rejected
- **AES-256-GCM**: Complete persona data encryption; no key → unintelligible
- **HMAC-SHA256**: Signature verified before every read; tampering detected
- **Distributed keys**: Decryption requires all three components; missing any one → impossible to decrypt
- **Device binding**: Copying to another device → Component C mismatch → decryption fails
- **Login requirement**: Component B requires a valid Nira session token; offline or logged out → decryption fails

## 10. Contact

Data Protection Officer (DPO): dpo@qisuanai.com
Security incident reporting: security@qisuanai.com