from flask import Flask, jsonify, request, abort
import os
import serial
import serial.tools.list_ports

app = Flask(__name__)

# Директория с прошивками
FIRMWARES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'firmwares')
FIRMWARES = {
    "cardputer": ["Bruce.bin"],
    "wemos_d1_mini": ["Deauther.bin", "NetherCap.bin"],
    "m5stick_c2_plus": ["Nemo.bin", "Bruce.bin", "CatHack.bin"],
    "m5stick_c1_1_plus": ["Bruce.bin"],
    "cyd": ["Bruce.bin", "Marauder.bin"]
}

@app.route('/devices', methods=['GET'])
def list_devices():
    """Возвращает список доступных устройств."""
    return jsonify({"devices": list(FIRMWARES.keys())})

@app.route('/firmwares/<device>', methods=['GET'])
def list_firmwares(device):
    """Возвращает список прошивок для устройства."""
    if device not in FIRMWARES:
        abort(404, description="Устройство не найдено")
    return jsonify({"firmwares": FIRMWARES[device]})

@app.route('/ports', methods=['GET'])
def list_ports():
    """Возвращает список доступных COM-портов."""
    ports = serial.tools.list_ports.comports()
    available_ports = [port.device for port in ports]
    return jsonify({"ports": available_ports})

@app.route('/flash', methods=['POST'])
def flash_device():
    """Прошивает устройство, используя выбранный порт и прошивку."""
    data = request.json
    device = data.get("device")
    firmware = data.get("firmware")
    port = data.get("port")
    
    if device not in FIRMWARES or firmware not in FIRMWARES[device]:
        abort(404, description="Прошивка не найдена для данного устройства")
    
    firmware_path = os.path.join(FIRMWARES_DIR, device, firmware)
    if not os.path.isfile(firmware_path):
        abort(404, description="Файл прошивки не найден на сервере")
    
    # Попытка подключения к COM-порту и отправка прошивки
    try:
        with serial.Serial(port, 115200, timeout=1) as ser:
            with open(firmware_path, 'rb') as firmware_file:
                ser.write(firmware_file.read())
        return jsonify({"status": "Прошивка успешно загружена"})
    except Exception as e:
        abort(500, description=f"Ошибка прошивки: {str(e)}")

if __name__ == '__main__':
    app.run(debug=True)