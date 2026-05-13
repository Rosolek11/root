<?php
namespace App;

class TsvEncoder extends AbstractDelimiterEncoder
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'tsv';
    }

    protected function getDelimiter(): string
    {
        return "\t";
    }
}

