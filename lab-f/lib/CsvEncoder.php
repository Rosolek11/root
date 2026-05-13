<?php
namespace App;

class CsvEncoder extends AbstractDelimiterEncoder
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'csv';
    }

    protected function getDelimiter(): string
    {
        return ',';
    }
}

