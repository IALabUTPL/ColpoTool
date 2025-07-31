import jwt

# ⚠️ Usa la misma clave con la que generas tus tokens
SECRET_KEY = "colpotool_secret_key"

# 🔁 Reemplaza este token por el que te devuelve el login
token = "PEGAR_AQUÍ_TU_TOKEN_JWT"

try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    print("=== TOKEN DECODIFICADO ===")
    for k, v in payload.items():
        print(f"{k}: {v}")
except jwt.ExpiredSignatureError:
    print("❌ Token expirado.")
except jwt.InvalidTokenError as e:
    print("❌ Token inválido:", str(e))
