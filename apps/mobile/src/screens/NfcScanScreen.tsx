import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import NfcManager, { NfcTech, NdefStatus } from 'react-native-nfc-manager';

interface NfcScanScreenProps {
  onCardRead: (cardData: any) => void;
  onCancel: () => void;
}

export const NfcScanScreen: React.FC<NfcScanScreenProps> = ({
  onCardRead,
  onCancel,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState('Ready to scan');

  useEffect(() => {
    return () => {
      // Clean up NFC when component unmounts
      NfcManager.cancel();
    };
  }, []);

  const startNfcScan = async () => {
    try {
      setIsScanning(true);
      setStatus('Initializing NFC...');

      // Check if NFC is available
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        Alert.alert('NFC Disabled', 'Please enable NFC in your device settings');
        setIsScanning(false);
        return;
      }

      setStatus('Waiting for card...');

      // Register for NFC technology
      await NfcManager.requestTechnology(NfcTech.IsoDep);

      // Get the card
      const tag = await NfcManager.getTag();
      
      if (tag) {
        setStatus('Card detected! Reading...');
        await processCard(tag);
      }

    } catch (error) {
      console.error('NFC Error:', error);
      setStatus('Scan failed. Please try again.');
      Alert.alert('Scan Error', 'Failed to read NFC card. Please try again.');
    } finally {
      setIsScanning(false);
      await NfcManager.cancel();
    }
  };

  const processCard = async (tag: any) => {
    try {
      // Send APDU commands to the card
      const cardData = await readCardData(tag);
      
      if (cardData) {
        setStatus('Card read successfully!');
        onCardRead(cardData);
      } else {
        setStatus('Failed to read card data');
        Alert.alert('Error', 'Could not read card data');
      }
    } catch (error) {
      console.error('Card processing error:', error);
      setStatus('Error processing card');
      Alert.alert('Error', 'Failed to process card data');
    }
  };

  const readCardData = async (tag: any) => {
    try {
      // Select MFA Card application
      const selectCmd = Buffer.from('00A4040007F00000000100', 'hex');
      const selectResponse = await NfcManager.transceive(selectCmd);
      
      if (selectResponse.length < 2 || 
          selectResponse[selectResponse.length - 2] !== 0x90 || 
          selectResponse[selectResponse.length - 1] !== 0x00) {
        throw new Error('Failed to select application');
      }

      // Get public key
      const getPublicKeyCmd = Buffer.from('00B0000000', 'hex');
      const publicKeyResponse = await NfcManager.transceive(getPublicKeyCmd);
      
      if (publicKeyResponse.length < 2 || 
          publicKeyResponse[publicKeyResponse.length - 2] !== 0x90 || 
          publicKeyResponse[publicKeyResponse.length - 1] !== 0x00) {
        throw new Error('Failed to get public key');
      }

      const publicKey = publicKeyResponse.slice(0, -2); // Remove SW bytes

      // Get usage counter
      const getCounterCmd = Buffer.from('00B1000000', 'hex');
      const counterResponse = await NfcManager.transceive(getCounterCmd);
      
      let counter = 0;
      if (counterResponse.length >= 6 && 
          counterResponse[counterResponse.length - 2] === 0x90 && 
          counterResponse[counterResponse.length - 1] === 0x00) {
        counter = counterResponse.readUInt32BE(0);
      }

      // Get card info
      const getCardInfoCmd = Buffer.from('00B3000000', 'hex');
      const cardInfoResponse = await NfcManager.transceive(getCardInfoCmd);
      
      let cardInfo = null;
      if (cardInfoResponse.length >= 2 && 
          cardInfoResponse[cardInfoResponse.length - 2] === 0x90 && 
          cardInfoResponse[cardInfoResponse.length - 1] === 0x00) {
        cardInfo = cardInfoResponse.slice(0, -2);
      }

      return {
        publicKey: publicKey.toString('hex'),
        counter,
        cardInfo: cardInfo ? cardInfo.toString('hex') : null,
        tagId: tag.id,
      };

    } catch (error) {
      console.error('APDU communication error:', error);
      throw error;
    }
  };

  const signChallenge = async (challenge: string): Promise<string> => {
    try {
      setStatus('Signing challenge...');

      // Convert hex challenge to buffer
      const challengeBuffer = Buffer.from(challenge, 'hex');
      
      // Send sign challenge command
      const signCmd = Buffer.concat([
        Buffer.from('00B2000020', 'hex'),
        challengeBuffer
      ]);
      
      const response = await NfcManager.transceive(signCmd);
      
      if (response.length < 2 || 
          response[response.length - 2] !== 0x90 || 
          response[response.length - 1] !== 0x00) {
        throw new Error('Failed to sign challenge');
      }

      const signature = response.slice(0, -2); // Remove SW bytes
      setStatus('Challenge signed successfully!');
      
      return signature.toString('hex');

    } catch (error) {
      console.error('Sign challenge error:', error);
      setStatus('Failed to sign challenge');
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>NFC Card Scan</Text>
          <Text style={styles.subtitle}>Hold your MFA card near the device</Text>
        </View>

        <View style={styles.scanArea}>
          <View style={[styles.scanCircle, isScanning && styles.scanning]}>
            {isScanning ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <View style={styles.scanIcon}>
                <Text style={styles.scanIconText}>NFC</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{status}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={startNfcScan}
            disabled={isScanning}
          >
            <Text style={styles.buttonText}>
              {isScanning ? 'Scanning...' : 'Start Scan'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={onCancel}
            disabled={isScanning}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  scanArea: {
    alignItems: 'center',
    marginBottom: 40,
  },
  scanCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  scanning: {
    borderColor: '#34C759',
  },
  scanIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  actions: {
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

export default NfcScanScreen;
