<?php
namespace App;

class SsvEncoder extends AbstractDelimiterEncoder
{
    public function supports(string $format): bool
    {
        return strtolower($format) === 'ssv';
    }

    protected function getDelimiter(): string
    {
        return ';';
    }
}

