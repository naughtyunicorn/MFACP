# NFC Smart Card APDU Specification

## Overview

This document defines the APDU (Application Protocol Data Unit) command structure for the MFA Card Platform NFC smart cards. The cards implement challenge-response authentication using elliptic curve cryptography.

## Card Identification

### AID (Application Identifier)
- **AID**: `F000000001`
- **Name**: MFA Card Platform Authentication

## Command Set

### 1. Select Application

**Command**: `00 A4 04 00 07 F000000001 00`

**Response**:
- **Success**: `9000` (SW1=0x90, SW2=0x00)
- **Error**: `6A82` (Application not found)

### 2. Get Public Key

**Command**: `00 B0 00 00 00`

**Response**:
- **Data**: Uncompressed SEC1 encoded EC public key (65 bytes for P-256)
- **SW1SW2**: `9000` on success

**Format**:
```
Byte 0: 0x04 (Uncompressed point indicator)
Bytes 1-32: X coordinate (32 bytes for P-256)
Bytes 33-64: Y coordinate (32 bytes for P-256)
```

### 3. Sign Challenge

**Command**: `00 B2 00 00 20 [CHALLENGE_DATA]`

**Parameters**:
- **CHALLENGE_DATA**: 32-byte challenge from the server

**Response**:
- **Data**: DER-encoded ECDSA signature (variable length, typically 70-72 bytes)
- **SW1SW2**: `9000` on success

**Signature Format** (DER):
```
30  [total_length]        // SEQUENCE
02  [r_length] [r_bytes]  // INTEGER r
02  [s_length] [s_bytes]  // INTEGER s
```

### 4. Get Usage Counter

**Command**: `00 B1 00 00 00`

**Response**:
- **Data**: 4-byte usage counter (big-endian)
- **SW1SW2**: `9000` on success

**Format**:
```
Bytes 0-3: Usage counter (unsigned 32-bit integer)
```

### 5. Get Card Information

**Command**: `00 B3 00 00 00`

**Response**:
- **Data**: Card information block
- **SW1SW2**: `9000` on success

**Format**:
```
Byte 0: Card version (1 byte)
Bytes 1-8: Serial number (8 bytes)
Bytes 9-16: Manufacturing date (8 bytes, YYYYMMDD)
Bytes 17-24: Card ID (8 bytes, unique identifier)
```

## Status Words

### Success Codes
- `9000`: Command executed successfully
- `61XX`: XX bytes of response data available (GET RESPONSE needed)

### Error Codes
- `6700`: Wrong length (Lc field incorrect)
- `6982`: Security condition not satisfied
- `6985`: Conditions of use not satisfied
- `6A80`: Incorrect parameters in command data field
- `6A81`: Function not supported
- `6A82`: Application not found
- `6A86`: Incorrect P1/P2
- `6A88`: Data object not found
- `6B00`: Incorrect parameters (P1-P2)
- `6D00`: Instruction code not supported or invalid
- `6E00`: Class not supported

## Security Features

### 1. Challenge-Response Authentication
- Server generates 32-byte random challenge
- Card signs challenge with stored private key
- Server verifies signature using stored public key

### 2. Replay Protection
- Usage counter increments on each signature operation
- Server tracks last counter value per card
- Rejects signatures with stale counter values

### 3. Key Protection
- Private key never leaves the card
- All cryptographic operations performed on-card
- No key export functionality

## Implementation Notes

### 1. Cryptographic Parameters
- **Curve**: P-256 (secp256r1)
- **Hash Algorithm**: SHA-256
- **Signature Algorithm**: ECDSA with SHA-256

### 2. Session Flow
1. Server generates random 32-byte challenge
2. Server sends challenge to client application
3. Client application sends SIGN CHALLENGE command to card
4. Card returns DER-encoded signature
5. Client forwards signature to server
6. Server verifies signature and updates usage counter

### 3. Error Handling
- Always check SW1SW2 status words
- Handle partial responses with GET RESPONSE if needed
- Implement retry logic for temporary failures (6985)

### 4. Performance Considerations
- SIGN CHALLENGE operation typically takes 200-500ms
- Card should support concurrent operations
- Implement timeout handling (recommended: 60 seconds)

## Example Usage

### JavaScript/TypeScript Example

```typescript
interface ApduCommand {
  cla: number;
  ins: number;
  p1: number;
  p2: number;
  data?: Buffer;
  le?: number;
}

interface ApduResponse {
  data: Buffer;
  sw1: number;
  sw2: number;
  status: number;
}

class MfaCard {
  async selectApp(): Promise<ApduResponse> {
    const aid = Buffer.from('F000000001', 'hex');
    return this.sendApdu({
      cla: 0x00,
      ins: 0xA4,
      p1: 0x04,
      p2: 0x00,
      data: aid,
      le: 0x00
    });
  }

  async getPublicKey(): Promise<Buffer> {
    const response = await this.sendApdu({
      cla: 0x00,
      ins: 0xB0,
      p1: 0x00,
      p2: 0x00,
      le: 0x00
    });
    
    if (response.status !== 0x9000) {
      throw new Error(`Failed to get public key: ${response.status.toString(16)}`);
    }
    
    return response.data;
  }

  async signChallenge(challenge: Buffer): Promise<Buffer> {
    if (challenge.length !== 32) {
      throw new Error('Challenge must be 32 bytes');
    }
    
    const response = await this.sendApdu({
      cla: 0x00,
      ins: 0xB2,
      p1: 0x00,
      p2: 0x00,
      data: challenge,
      le: 0x00
    });
    
    if (response.status !== 0x9000) {
      throw new Error(`Failed to sign challenge: ${response.status.toString(16)}`);
    }
    
    return response.data;
  }

  async getUsageCounter(): Promise<number> {
    const response = await this.sendApdu({
      cla: 0x00,
      ins: 0xB1,
      p1: 0x00,
      p2: 0x00,
      le: 0x00
    });
    
    if (response.status !== 0x9000) {
      throw new Error(`Failed to get usage counter: ${response.status.toString(16)}`);
    }
    
    return response.data.readUInt32BE(0);
  }

  private async sendApdu(command: ApduCommand): Promise<ApduResponse> {
    // Implementation depends on NFC library
    // This is a placeholder for the actual NFC communication
    throw new Error('Not implemented');
  }
}
```

### Server Verification Example

```typescript
import * as crypto from 'crypto';

export function verifySignature(
  publicKey: Buffer,
  challenge: Buffer,
  signature: Buffer
): boolean {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(challenge);
    return verify.verify(publicKey, signature);
  } catch (error) {
    return false;
  }
}

export function extractPublicKeyFromCard(cardData: Buffer): Buffer {
  // Card data is 65 bytes: 0x04 + X (32 bytes) + Y (32 bytes)
  if (cardData.length !== 65 || cardData[0] !== 0x04) {
    throw new Error('Invalid public key format');
  }
  
  // Convert to uncompressed SEC1 format for Node.js crypto
  return cardData;
}
```

## Testing

### Test Vectors

**Challenge**: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`

**Expected Signature Format**: DER-encoded ECDSA signature (variable length)

**Public Key Format**: 65-byte uncompressed SEC1 encoding

## Security Considerations

1. **Random Number Generation**: Server challenges must use cryptographically secure random numbers
2. **Replay Attacks**: Usage counter prevents replay of old signatures
3. **Key Compromise**: Private key never exposed outside secure element
4. **Side Channel Attacks**: Card should implement constant-time operations
5. **Physical Attacks**: Card should include tamper resistance features

## Version History

- **v1.0**: Initial specification with P-256 support
- **Future**: Support for additional curves (P-384, P-521)
- **Future**: Support for additional algorithms (Ed25519)
