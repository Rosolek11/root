<?php
namespace App;
abstract class AbstractDelimiterEncoder implements EncoderInterface
{
    abstract protected function getDelimiter(): string;
    public function decode(string $data): array
    {
        $lines = explode("\n", trim($data));
        if (empty($lines) || (count($lines) === 1 && empty($lines[0]))) {
            return [];
        }
        $delimiter = $this->getDelimiter();
        $headers = str_getcsv(array_shift($lines), $delimiter, '"', "");
        $headers = array_map('trim', $headers);
        $result = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;
            $values = str_getcsv($line, $delimiter, '"', "");
            $row = [];
            foreach ($headers as $index => $header) {
                $row[$header] = $values[$index] ?? null;
            }
            $result[] = $row;
        }
        return $result;
    }
    public function encode(array $data): string
    {
        if (empty($data)) {
            return '';
        }
        $delimiter = $this->getDelimiter();
        $stream = fopen('php://temp', 'r+');
        $headers = array_keys($data[0]);
        fputcsv($stream, $headers, $delimiter, '"', "");
        foreach ($data as $row) {
            $values = [];
            foreach ($headers as $header) {
                $values[] = $row[$header] ?? '';
            }
            fputcsv($stream, $values, $delimiter, '"', "");
        }
        rewind($stream);
        $csv = stream_get_contents($stream);
        fclose($stream);
        return $csv;
    }
}
