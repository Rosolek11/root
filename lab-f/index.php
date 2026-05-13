<?php

spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/lib/';

    if (strpos($class, $prefix) === 0) {
        $relative = substr($class, strlen($prefix));
        $file = $baseDir . str_replace('\\', '/', $relative) . '.php';

        if (file_exists($file)) {
            require $file;
        }
    }
});

use App\Converter;
use App\CsvEncoder;
use App\SsvEncoder;
use App\TsvEncoder;
use App\JsonEncoder;
use App\YamlEncoder;

// Inicjalizacja konwertera
$converter = new Converter();
$converter->addEncoder(new CsvEncoder());
$converter->addEncoder(new SsvEncoder());
$converter->addEncoder(new TsvEncoder());
$converter->addEncoder(new JsonEncoder());
$converter->addEncoder(new YamlEncoder());

$inputData = $_POST['inputData'] ?? $_COOKIE['inputData'] ?? '';
$inputFormat = $_POST['inputFormat'] ?? $_COOKIE['inputFormat'] ?? 'csv';
$outputFormat = $_POST['outputFormat'] ?? $_COOKIE['outputFormat'] ?? 'json';

$requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($requestMethod === 'POST') {
    setcookie('inputData', $inputData, time() + 3600 * 24 * 365, '/');
    setcookie('inputFormat', $inputFormat, time() + 3600 * 24 * 365, '/');
    setcookie('outputFormat', $outputFormat, time() + 3600 * 24 * 365, '/');
}

$outputData = '';
$error = '';

if ($requestMethod === 'POST' && !empty($inputData)) {
    try {
        $outputData = $converter->convert($inputData, $inputFormat, $outputFormat);
    } catch (\Throwable $e) {
        $error = "Błąd konwersji: " . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter formatów</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .container { display: flex; gap: 20px; }
        .box { flex: 1; }
        textarea { width: 100%; height: 300px; font-family: monospace; }
        pre { background: #f4f4f4; padding: 10px; min-height: 300px; white-space: pre-wrap; word-wrap: break-word; }
        select, button { font-size: 16px; padding: 5px; margin-top: 10px; }
        .error { color: red; margin-bottom: 20px; }
    </style>
</head>
<body>
    <h1>Konwerter danych (CSV, SSV, TSV, JSON, YAML)</h1>
    
    <?php if ($error): ?>
        <div class="error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <form method="POST">
        <div class="container">
            <div class="box">
                <label for="inputFormat">Format wejściowy:</label>
                <select name="inputFormat" id="inputFormat">
                    <?php foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $fmt): ?>
                        <option value="<?= $fmt ?>" <?= $inputFormat === $fmt ? 'selected' : '' ?>><?= strtoupper($fmt) ?></option>
                    <?php endforeach; ?>
                </select>
                <br><br>
                <textarea name="inputData"><?= htmlspecialchars($inputData) ?></textarea>
            </div>
            
            <div class="box">
                <label for="outputFormat">Format wyjściowy:</label>
                <select name="outputFormat" id="outputFormat">
                    <?php foreach (['csv', 'ssv', 'tsv', 'json', 'yaml'] as $fmt): ?>
                        <option value="<?= $fmt ?>" <?= $outputFormat === $fmt ? 'selected' : '' ?>><?= strtoupper($fmt) ?></option>
                    <?php endforeach; ?>
                </select>
                <br><br>
                <pre><?= htmlspecialchars($outputData) ?></pre>
            </div>
        </div>
        
        <button type="submit">Konwertuj</button>
    </form>
</body>
</html>

