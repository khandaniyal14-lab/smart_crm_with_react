from pydantic import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./crm.db"
    SECRET_KEY: str = "Magic"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # SMTP / Email settings
    EMAIL_SENDER: str = "your_email@example.com"
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = "Daniyal@irp.edu.pk"
    SMTP_PASSWORD: str = "kkttumhiklscooqu"
    EMAIL_FROM: str = "no-reply@smartcrm.com"

    # App settings
    APP_NAME: str = "Smart CRM"
    FRONTEND_URL: str = "http://localhost:5173"

settings = Settings()
