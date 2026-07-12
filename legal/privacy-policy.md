# Nira Privacy Policy

**Last Updated: May 5, 2026**
**Effective Date: May 5, 2026**

## 1. Introduction

CogCloud ("we," "us," "our," or "the Platform") operates the Nira mobile application and the website qisuanai.com (collectively, "Nira" or "the Service").

We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, store, and share your personal information, and what rights you have regarding that information.

This Privacy Policy applies to all Nira users globally and complies with:
- EU General Data Protection Regulation (GDPR)
- U.S. Children's Online Privacy Protection Act (COPPA)
- Singapore Personal Data Protection Act (PDPA)
- Indonesia Electronic Information and Transactions Law (UU ITE)
- Vietnam Law on Children
- U.S. TAKE IT DOWN Act
- EU Artificial Intelligence Act (EU AI Act)

## 2. Information We Collect

### 2.1 Information You Provide
| Information Type | Purpose | Required |
|------------------|---------|----------|
| Email address | Account registration and login | Yes |
| Date of birth | Age verification and legal compliance | Yes |
| Voice recordings | AI voice call functionality | Optional (during use) |
| Photo (front-facing) | Exclusive Avatar image generation | Optional (when creating Exclusive Avatar) |
| Chat logs | Exclusive Avatar personality customization | Optional (when creating Exclusive Avatar) |
| Voice samples (3–10 seconds) | Exclusive Avatar voice cloning | Optional (when creating Exclusive Avatar) |

### 2.2 Information Collected Automatically
| Information Type | Purpose |
|------------------|---------|
| Device information (model, OS version) | Compatibility optimization, crash reporting |
| IP address | Region detection, compliance routing |
| Usage logs (feature frequency, call duration) | Service improvement |
| QS transaction records | Billing and account management |

### 2.3 Information We Do NOT Collect
- **We do not store audio/video call content.** Real-person video calls use end-to-end encryption (WebRTC standard). Call data is discarded immediately after the call ends. The Platform does not record, store, or enable playback.
- **We do not collect precise location data.** Only IP-based country/region detection is used to determine applicable law.

## 3. Biometric Data (Special Provisions)

### 3.1 Definition
For purposes of this Privacy Policy, "biometric data" includes:
- Your uploaded facial photo
- Your provided voice sample
- Facial feature vectors and voiceprint models extracted during Exclusive Avatar creation

### 3.2 Legal Basis
Under Article 9 of the GDPR, biometric data constitutes a "special category of personal data." Our legal basis for processing your biometric data is:
**Your explicit consent (GDPR Article 9(2)(a))**

### 3.3 Usage Limitations
- Biometric data is used **solely** to generate your Exclusive Avatar
- It is **not used** for any other commercial purpose
- It is **not used** for public model training
- It is **not shared** with any third party
- It is **not publicly displayed**

### 3.4 Retention Period
- **Raw materials** (photos, chat logs, voice samples): Automatically and permanently deleted **within 7 days** after Exclusive Avatar distillation is complete
- **Generated Exclusive Avatar data**: Retained until you actively delete it. Once deleted, it is **immediately cleared and irrecoverable**

### 3.5 Local .nira File Storage and Encryption
- Exclusive Avatar personality data is stored locally on your device in an encrypted `.nira` file format
- Encryption uses AES-256-GCM with a three-component key distribution (device keychain + server token + device fingerprint)
- Raw distillation materials are never uploaded to Nira servers—only the cleaned, encrypted persona file is transmitted
- The `.nira` file is device-bound; copying to another device renders it unreadable

## 4. Data Storage

All user personal data is stored in **Singapore** (Alibaba Cloud Singapore node).

We do **not** transfer user data to any other jurisdiction for storage purposes.

## 5. Your Rights

Under applicable data protection laws, you have the following rights:

| Right | Description | How to Exercise |
|-------|-------------|-----------------|
| Right of Access | Obtain a copy of your personal data | In-app: Settings → Export Data |
| Right to Rectification | Correct inaccurate personal data | In-app: Settings → Edit Profile |
| Right to Erasure (Right to be Forgotten) | Delete your account and all personal data | In-app: Settings → Delete Account |
| Right to Restriction of Processing | Restrict how we process your data | Contact privacy@qisuanai.com |
| Right to Data Portability | Export your data in a structured format | In-app: Settings → Export Data |
| Right to Withdraw Consent | Withdraw consent for biometric data at any time | In-app: Settings → Exclusive Avatar → Delete |
| Right to Lodge a Complaint | File a complaint with a supervisory authority | Contact your local data protection authority |

### Response Timeline
- Account deletion: Personal data deleted within **7 days**
- Biometric consent withdrawal: Related data deleted within **7 days**
- Data export request: Copy provided within **30 days**
- Access request: Responded to within **30 days**

## 6. Children and Minor Protection

### 6.1 Age Thresholds

| Age | Permissions |
|-----|-------------|
| Under 15 | **Registration prohibited** |
| 15–17 | Registration requires **dynamic guardian verification**; Minor Mode applies |
| 18 and above | Full functionality available |

### 6.2 Minor Mode Restrictions
Users aged 15–17 who complete guardian verification:
- ✅ Allowed: AI text chat, AI voice calls
- ❌ Not allowed: Digital human video calls, Exclusive Avatar, Real-person video calls

### 6.3 Dynamic Guardian Verification
The Platform uses a dynamic knowledge-based verification system to confirm the identity of the guardian:

1. The minor user provides the guardian's email address
2. The Platform sends a verification request to the guardian's email
3. The guardian must correctly answer at least 2 out of 3 randomly generated dynamic questions based on publicly available data associated with the guardian's email
4. Upon passing, the guardian sets a 6-digit PIN and communicates it to the minor user
5. The minor user enters the PIN to complete registration

**Anti-spoofing measures**:
- 3 incorrect answers → 30-minute lockout
- 5 cumulative incorrect answers → 24-hour lockout
- The guardian's email and verification timestamp are recorded for audit purposes

### 6.4 Guardian Rights
Guardians may:
- Request to review the minor user's activity logs
- Request closure of the minor user's account
- Dispute QS consumption by the minor user
- Withdraw consent at any time (account will be closed upon withdrawal)

Contact: guardian@qisuanai.com

## 7. Data Security

We implement the following technical and organizational measures:
- **Encryption in transit**: TLS 1.3 (HTTPS)
- **End-to-end encryption**: WebRTC DTLS-SRTP for real-person video calls
- **Access control**: Only the CTO and Data Protection Officer may access full system logs
- **Log anonymization**: Personally identifiable information is automatically redacted in logs
- **Regular audits**: Security audits conducted quarterly

## 8. AI-Generated Content Labeling

In compliance with the EU AI Act and U.S. Deepfake regulations:
- All text, voice, and video content generated by Exclusive Avatars is labeled as **"AI-Generated / Digital Avatar"**
- Users may view content labeling information in Settings
- AI-generated content may not be used to mislead others or impersonate real persons

## 9. Third-Party Services

Nira uses the following third-party services:

| Service | Purpose | Privacy Policy |
|---------|---------|----------------|
| Firebase (Google) | User authentication | [Firebase Privacy Policy](https://firebase.google.com/support/privacy) |
| Stripe | Payment processing | [Stripe Privacy Policy](https://stripe.com/privacy) |
| Hive Moderation | Content moderation | [Hive Privacy Policy](https://thehive.ai/privacy) |
| Cloudflare | CDN | [Cloudflare Privacy Policy](https://www.cloudflare.com/privacypolicy/) |

## 10. Cookies and Tracking

Nira does **not** use third-party advertising or tracking cookies.

We use only the following essential local storage:
- Authentication token (expires in 7 days)
- Language preference
- Theme preference

## 11. Policy Updates

We may update this Privacy Policy from time to time. For material changes, we will:
- Notify you via an in-app pop-up
- Notify you via your registered email
- Update the "Last Updated" date at the top of this page

Continued use of the Service constitutes acceptance of the updated Privacy Policy.

## 12. Contact Us

| Matter | Contact |
|--------|---------|
| Privacy inquiries | privacy@qisuanai.com |
| Data Protection Officer (DPO) | dpo@qisuanai.com |
| Guardian-related matters | guardian@qisuanai.com |
| Report violations | report@qisuanai.com |

**Company Information:**
CogCloud
Operational address: Singapore
Website: https://qisuanai.com

---

© 2026 CogCloud. All rights reserved.