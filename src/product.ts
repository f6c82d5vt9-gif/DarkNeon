export const PRODUCT = {
  name: "NEMO LIGHT",
  concept: "기울이면 밝아지는 네모난 조명",
  description:
    "알루미늄 프로파일 프레임에 아크릴 패널을 끼운 사각 조명입니다. 기울기 센서가 기울어진 정도를 읽어 LED 밝기를 바꿉니다. 이 화면에서 지금 밝기를 보고 전원을 켜고 끌 수 있습니다.",
}
export const DEVICE_ID = "lamp-01"
export const SENSOR_MIN = 0
export const SENSOR_MAX = 4095 // ESP32 ADC 12bit. 업로드하는 값의 범위가 다르면 여기만 바꾼다
export const MAX_POINTS = 60
