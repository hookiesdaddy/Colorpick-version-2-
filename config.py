from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    version: str = "0.9.2"
    max_image_size_bytes: int = 10 * 1024 * 1024  # 10MB

    govee_api_key: str = ""
    govee_devices: list[dict] = [
        {"device": "7F:4B:D9:38:31:39:39:2B", "model": "H61E1", "name": "Ambient Light"},
        {"device": "38:8C:D0:03:C1:06:28:83", "model": "H6076", "name": "Floor Lamp"},
    ]

    class Config:
        env_file = ".env"


settings = Settings()
