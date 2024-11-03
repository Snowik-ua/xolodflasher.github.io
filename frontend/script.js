let port;
let comPorts = [];

async function getAvailablePorts() {
    const ports = await navigator.serial.getPorts();
    return ports.map(port => port.getInfo().usbVendorId);
}

async function showFirmwarePage(device) {
    // Получаем доступные порты
    comPorts = await getAvailablePorts();
    let firmwareButtons = '';

    switch (device) {
        case 'Cardputer':
            firmwareButtons = `
                <button class="device-button" onclick="openSerialPort('${device}', 'Bruce.bin')">Прошить Bruce</button>
            `;
            break;
        case 'Wemos D1 Mini':
            firmwareButtons = `
                <button class="device-button" onclick="openSerialPort('${device}', 'Deauther.bin')">Прошить Deauther</button>
                <button class="device-button" onclick="openSerialPort('${device}', 'NetherCap.bin')">Прошить NetherCap</button>
            `;
            break;
        case 'M5Stick C 2 Plus':
            firmwareButtons = `
                <button class="device-button" onclick="openSerialPort('${device}', 'Nemo.bin')">Прошить Nemo</button>
                <button class="device-button" onclick="openSerialPort('${device}', 'Bruce.bin')">Прошить Bruce</button>
                <button class="device-button" onclick="openSerialPort('${device}', 'CatHack.bin')">Прошить CatHack</button>
            `;
            break;
        case 'M5Stick C 1.1 Plus':
            firmwareButtons = `
                <button class="device-button" onclick="openSerialPort('${device}', 'Bruce.bin')">Прошить Bruce</button>
            `;
            break;
        case 'ESP32 Cyd':
            firmwareButtons = `
                <button class="device-button" onclick="openSerialPort('${device}', 'Bruce.bin')">Прошить Bruce</button>
                <button class="device-button" onclick="openSerialPort('${device}', 'Marauder.bin')">Прошить Marauder</button>
            `;
            break;
    }

    document.body.innerHTML = `
        <header>
            <h1>Прошивки для ${device}</h1>
        </header>
        <main>
            <section>
                <h2>${device}</h2>
                <label for="portSelect">Выберите COM-порт:</label>
                <select id="portSelect">
                    ${comPorts.map(port => `<option value="${port}">${port}</option>`).join('')}
                </select>
                ${firmwareButtons}
                <button class="device-button" onclick="goBack()">Назад</button>
            </section>
        </main>
        <footer>
            <p>&copy; 2024 xolodflasher</p>
        </footer>
    `;
}

async function openSerialPort(device, firmware) {
    const portSelect = document.getElementById('portSelect');
    const selectedPort = portSelect.value;

    try {
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 115200 });
        alert(`Выбран COM-порт ${selectedPort} для ${device}. Прошивка ${firmware} начнется...`);
        // Здесь можно добавить код для загрузки прошивки
    } catch (err) {
        console.error("Ошибка доступа к COM-порту: ", err);
    }
}

function goBack() {
    location.reload();
}