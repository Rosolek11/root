<?php
namespace App;

class Converter
{
    /** @var EncoderInterface[] */
    private array $encoders = [];

    public function addEncoder(EncoderInterface $encoder): void
    {
        $this->encoders[] = $encoder;
    }

    public function convert(string $data, string $inputFormat, string $outputFormat): string
    {
        $inputEncoder = $this->getEncoder($inputFormat);
        $outputEncoder = $this->getEncoder($outputFormat);

        if (!$inputEncoder || !$outputEncoder) {
            throw new \Exception("Unsupported format");
        }

        $decodedData = $inputEncoder->decode($data);
        return $outputEncoder->encode($decodedData);
    }

    private function getEncoder(string $format): ?EncoderInterface
    {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder;
            }
        }
        return null;
    }
}

