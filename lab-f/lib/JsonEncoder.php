<?php
namespace App;

class JsonEncoder implements EncoderInterface
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'json';
    }

    public function decode(string $data): array
    {
        $decoded = json_decode($data, true);
        return is_array($decoded) ? $decoded : [];
    }

    public function encode(array $data): string
    {
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}

