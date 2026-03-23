using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace Task1_EmployeeManagement.Helpers
{
    public static class EncryptionHelper
    {
        // AES requires a 16, 24, or 32-byte key.
        // We derive a fixed-length key from the configured key string.
        private static byte[] DeriveKey(string keyString)
        {
            using var sha256 = SHA256.Create();
            return sha256.ComputeHash(Encoding.UTF8.GetBytes(keyString));
            // SHA-256 always produces 32 bytes → AES-256
        }

        /// <summary>
        /// Encrypts plaintext using AES-256-CBC. Returns Base64-encoded "IV:Ciphertext".
        /// </summary>
        public static string Encrypt(string plainText, string keyString)
        {
            if (string.IsNullOrEmpty(plainText))
                throw new ArgumentNullException(nameof(plainText), "Plain text cannot be null or empty.");

            byte[] key = DeriveKey(keyString);

            using var aes = Aes.Create();
            aes.Key = key;
            aes.GenerateIV();                   // Random IV per encryption
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            using var encryptor = aes.CreateEncryptor();
            using var ms = new MemoryStream();

            // Write IV first so we can read it back during decryption
            ms.Write(aes.IV, 0, aes.IV.Length);

            using (var cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
            using (var sw = new StreamWriter(cs))
            {
                sw.Write(plainText);
            }

            return Convert.ToBase64String(ms.ToArray());
        }

        /// <summary>
        /// Decrypts a Base64-encoded AES ciphertext that was produced by <see cref="Encrypt"/>.
        /// </summary>
        public static string Decrypt(string cipherTextBase64, string keyString)
        {
            if (string.IsNullOrEmpty(cipherTextBase64))
                throw new ArgumentNullException(nameof(cipherTextBase64), "Cipher text cannot be null or empty.");

            byte[] key = DeriveKey(keyString);
            byte[] fullCipher = Convert.FromBase64String(cipherTextBase64);

            using var aes = Aes.Create();
            aes.Key = key;
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;

            // Extract IV (first 16 bytes)
            byte[] iv = new byte[16];
            Array.Copy(fullCipher, 0, iv, 0, iv.Length);
            aes.IV = iv;

            // Remaining bytes are the actual ciphertext
            byte[] cipherBytes = new byte[fullCipher.Length - iv.Length];
            Array.Copy(fullCipher, iv.Length, cipherBytes, 0, cipherBytes.Length);

            using var decryptor = aes.CreateDecryptor();
            using var ms = new MemoryStream(cipherBytes);
            using var cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read);
            using var sr = new StreamReader(cs);

            return sr.ReadToEnd();
        }
    }
}
